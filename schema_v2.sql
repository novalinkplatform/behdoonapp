-- ==============================================================================
-- Behdoon Platform - D1 Unified Database Schema v2 (Marketplace MVP & Core Data)
-- ==============================================================================

-- ۱. جدول تنظیمات سراسری پلتفرم
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- ۲. شمارنده روزانه سفارشات جهت تولید شناسه استاندارد BD-2026-XXXXXX
CREATE TABLE IF NOT EXISTS daily_order_counters (
  day_key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1
);

-- ۳. جدول مشتریان (Customers)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT,
  gender TEXT DEFAULT 'male',
  company_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active', -- active, suspended
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- ۴. جدول آدرس‌های ذخیره‌شده مشتریان (Customer Addresses)
CREATE TABLE IF NOT EXISTS customer_addresses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  title TEXT NOT NULL, -- خانه، محل کار، ویلا
  city TEXT DEFAULT 'تهران',
  district TEXT, -- نام محله / منطقه تهران
  address TEXT NOT NULL,
  floor TEXT,
  unit TEXT,
  has_elevator INTEGER DEFAULT 1,
  lat REAL,
  lng REAL,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- ۵. جدول کدهای تأیید یکبار مصرف پیامکی (SMS OTPs)
CREATE TABLE IF NOT EXISTS customer_otps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at INTEGER NOT NULL, -- Unix timestamp in milliseconds
  attempts INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_customer_otps_phone ON customer_otps(phone);

-- ۶. جدول ارائه‌دهندگان خدمت / متخصصان (Providers)
CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  national_id TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'تهران',
  districts TEXT, -- JSON array of covered Tehran districts: e.g. ["all"] or ["سعادت‌آباد", "پونک"]
  service_categories TEXT NOT NULL, -- JSON array: ["hvac", "plumbing", "electrical", "renovation"]
  bio TEXT,
  years_experience INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending', -- pending, under_review, verified, active, suspended, rejected
  is_online INTEGER DEFAULT 0,
  pricing_base INTEGER DEFAULT 0,
  performance_score REAL DEFAULT 5.0,
  total_jobs INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  cancelled_jobs INTEGER DEFAULT 0,
  verified_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_providers_phone ON providers(phone);
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);

-- ۷. جدول ارتقایافته سفارشات و درخواست‌ها (Requests / Orders)
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_code TEXT UNIQUE NOT NULL, -- e.g. BD-2026-000001
  customer_id INTEGER,
  provider_id INTEGER,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_id TEXT NOT NULL,
  service_label TEXT NOT NULL,
  origin_province TEXT DEFAULT 'تهران',
  origin_city TEXT DEFAULT 'تهران',
  origin_district TEXT,
  origin_notes TEXT,
  origin_property_type TEXT DEFAULT 'residential', -- residential, commercial, office, industrial
  origin_lat REAL DEFAULT 35.7219,
  origin_lng REAL DEFAULT 51.3347,
  has_elevator INTEGER DEFAULT 1,
  floor_number INTEGER DEFAULT 1,
  needs_parts INTEGER DEFAULT 0, -- 1 if technician should provide materials
  urgency TEXT DEFAULT 'normal', -- immediate, normal, scheduled
  pricing_model TEXT DEFAULT 'fixed', -- fixed, inspection_quote, provider_quote
  scheduled_date TEXT DEFAULT 'امروز',
  scheduled_time TEXT DEFAULT 'فوری',
  estimate_avg INTEGER DEFAULT 1800000,
  final_price INTEGER,
  status TEXT DEFAULT 'submitted',
  -- State Machine:
  -- draft, submitted, under_review, waiting_for_provider, provider_assigned,
  -- provider_accepted, scheduled, on_the_way, arrived, in_progress, completed,
  -- payment_pending, rated, closed, cancelled, rejected, disputed
  insurance_tier_id TEXT DEFAULT 'gold_300m',
  cancellation_reason TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_requests_tracking_code ON requests(tracking_code);
CREATE INDEX IF NOT EXISTS idx_requests_phone ON requests(phone);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_provider_id ON requests(provider_id);

-- ۸. جدول تاریخچه تغییرات وضعیت سفارش (Order Status Transition Logs)
CREATE TABLE IF NOT EXISTS order_status_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by_role TEXT NOT NULL, -- customer, provider, admin, system
  changed_by_id INTEGER,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_order_status_logs_request_id ON order_status_logs(request_id);

-- ۹. جدول درخواست‌های همکاری / استخدام متخصصین (Job Applications)
CREATE TABLE IF NOT EXISTS job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  position_label TEXT,
  city TEXT DEFAULT 'تهران',
  message TEXT,
  has_vehicle INTEGER DEFAULT 0,
  vehicle_type TEXT,
  status TEXT DEFAULT 'new', -- new, reviewed, contacted, hired, rejected
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

-- ۱۰. جدول برگه‌های سفارشی محتوا (Custom Pages)
CREATE TABLE IF NOT EXISTS custom_pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT,
  excerpt TEXT,
  excerpt_en TEXT,
  cover_image_url TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft',
  author_staff_id INTEGER DEFAULT 1,
  published_at TEXT,
  show_in_header INTEGER DEFAULT 0,
  show_in_footer INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_custom_pages_slug ON custom_pages(slug);

-- ==============================================================================
-- Behdoon Platform - D1 Unified Database Schema v3 (Marketplace Engine)
-- ==============================================================================

-- ۱. کاندیداهای تطبیق‌یافته برای هر سفارش (Matching Candidates)
CREATE TABLE IF NOT EXISTS request_candidates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  matching_score REAL NOT NULL, -- نمره تطابق ۰ تا ۱۰۰
  rank INTEGER DEFAULT 1,
  selection_mode TEXT DEFAULT 'auto', -- auto, customer_choice
  status TEXT DEFAULT 'candidate', -- candidate, offered, accepted, declined, assigned
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_req_cand_request ON request_candidates(request_id);
CREATE INDEX IF NOT EXISTS idx_req_cand_provider ON request_candidates(provider_id);

-- ۲. سیستم پیش‌فاکتور و استعلام قیمت (Quotes & Pricing Models)
CREATE TABLE IF NOT EXISTS quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  pricing_model TEXT NOT NULL DEFAULT 'fixed', -- fixed, inspection_quote, provider_quote
  base_amount INTEGER NOT NULL DEFAULT 0,
  materials_amount INTEGER NOT NULL DEFAULT 0,
  labor_amount INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  final_amount INTEGER NOT NULL,
  description TEXT,
  valid_until TEXT,
  status TEXT DEFAULT 'sent', -- draft, sent, viewed, accepted, rejected, expired, cancelled
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_quotes_request ON quotes(request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_provider ON quotes(provider_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- ۳. تقویم کاری متخصصان و جلوگیری از تداخل زمان (Provider Schedules & Conflict Prevention)
CREATE TABLE IF NOT EXISTS provider_schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- 1405/06/28 or YYYY-MM-DD
  time_slot TEXT NOT NULL, -- 10:00 - 12:00
  request_id INTEGER,
  status TEXT DEFAULT 'booked', -- booked, blocked, holiday
  created_at TEXT NOT NULL,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_provider_schedules_slot ON provider_schedules(provider_id, date, time_slot);

-- ۴. فاکتورهای رسمی و مالی سفارشات (Invoices)
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT UNIQUE NOT NULL, -- e.g. INV-2026-000001
  request_id INTEGER NOT NULL,
  quote_id INTEGER,
  customer_id INTEGER,
  provider_id INTEGER,
  subtotal INTEGER NOT NULL DEFAULT 0,
  materials_total INTEGER NOT NULL DEFAULT 0,
  labor_total INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'issued', -- draft, issued, paid, cancelled
  items_json TEXT, -- JSON array of line items
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_invoices_request ON invoices(request_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);

-- ۵. تراکنش‌ها و پرداخت‌های مشتریان (Payments & Transactions)
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  request_id INTEGER NOT NULL,
  customer_id INTEGER,
  amount INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'online', -- online, card_reader, cash, wallet
  transaction_ref TEXT,
  status TEXT DEFAULT 'completed', -- pending, completed, failed, refunded
  paid_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_payments_request ON payments(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);

-- ۶. تسویه‌حساب و کمیسیون سهم پلتفرم (Provider Settlements & Platform Commission)
CREATE TABLE IF NOT EXISTS provider_settlements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  gross_amount INTEGER NOT NULL,
  commission_rate REAL DEFAULT 0.15, -- 15% platform cut
  commission_amount INTEGER NOT NULL,
  net_payable INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, settled
  settled_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_settlements_provider ON provider_settlements(provider_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON provider_settlements(status);

-- ۷. امتیازدهی و کنترل کیفیت تاییدشده (Verified Ratings & QC)
CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER UNIQUE NOT NULL, -- هر سفارش تکمیل‌شده فقط ۱ نظر
  customer_id INTEGER NOT NULL,
  provider_id INTEGER NOT NULL,
  overall_score INTEGER NOT NULL CHECK(overall_score BETWEEN 1 AND 5),
  punctuality_score INTEGER DEFAULT 5,
  cleanliness_score INTEGER DEFAULT 5,
  skill_score INTEGER DEFAULT 5,
  comment TEXT,
  status TEXT DEFAULT 'approved', -- approved, hidden
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ratings_provider ON ratings(provider_id);

-- ۸. سیستم داوری و حل اختلاف شکایات (Dispute System)
CREATE TABLE IF NOT EXISTS disputes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  opened_by TEXT NOT NULL, -- customer, provider
  opened_by_id INTEGER,
  reason TEXT NOT NULL, -- incomplete_work, price_dispute, damages, no_show, delay, poor_quality
  claim_amount INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  evidence_urls_json TEXT, -- JSON array of image/document URLs
  status TEXT DEFAULT 'open', -- open, under_review, settled_refund, settled_redo, rejected
  admin_notes TEXT,
  refund_amount INTEGER DEFAULT 0,
  resolved_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_disputes_request ON disputes(request_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);

-- ۹. تیکت‌های پشتیبانی ساختاریافته (Support Tickets)
CREATE TABLE IF NOT EXISTS support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  provider_id INTEGER,
  request_id INTEGER,
  dispute_id INTEGER,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- technical, billing, dispute, general
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE SET NULL,
  FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

CREATE TABLE IF NOT EXISTS support_ticket_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL,
  sender_role TEXT NOT NULL, -- customer, provider, support
  sender_id INTEGER,
  message TEXT NOT NULL,
  attachments_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON support_ticket_messages(ticket_id);

-- ۱۰. آرشیو اعلان‌های رویدادمحور (Notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_type TEXT NOT NULL, -- customer, provider, admin
  recipient_id INTEGER,
  event_type TEXT NOT NULL, -- request_submitted, provider_matched, quote_issued, status_updated, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channel TEXT DEFAULT 'in_app', -- in_app, sms
  is_read INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_type, recipient_id);

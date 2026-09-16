export interface FaqItem {
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'بهدون دقیقاً چه خدماتی ارائه می‌دهد؟',
    questionEn: 'What services does Behdoon offer?',
    answer:
      'بهدون ارائه دهنده خدمات تخصصی فنی و ساختمانی شامل سرمایش و گرمایش (کولر آبی، گازی، پکیج، شوفاژ)، لوله‌کشی آب و فاضلاب، نشت‌یابی نقطه زن، برقکاری و رفع اتصالی، و نوسازی و بازسازی ساختمان در سراسر تهران است.',
    answerEn:
      'Behdoon offers comprehensive home repair and building maintenance services across Tehran, including HVAC (water coolers, AC, heating packages, radiators), plumbing and acoustic leak detection, electrical troubleshooting, and interior renovation.',
  },
  {
    question: 'آیا خدمات فنی و تعمیرات بهدون ضمانت دارد؟',
    questionEn: 'Do Behdoon repairs have a warranty?',
    answer:
      'بله، تمامی خدمات انجام شده توسط تکنسین‌های بهدون همراه با تست تحویل و ضمانت کتبی کیفیت ارائه می‌شوند تا خیالتان از بابت کیفیت و ماندگاری تعمیرات راحت باشد.',
    answerEn:
      'Yes, all repairs and services performed by Behdoon technicians include testing and an official written quality guarantee.',
  },
  {
    question: 'سرعت اعزام تکنسین در تهران چقدر است؟',
    questionEn: 'How fast are technicians dispatched in Tehran?',
    answer:
      'با توجه به حضور تیم‌های سیار بهدون در مناطق شمال، جنوب، شرق، غرب و مرکز تهران، در موارد اورژانسی مانند ترکیدگی لوله یا اتصالی برق، اعزام در کمتر از ۴۵ دقیقه انجام می‌شود.',
    answerEn:
      'With mobile technical teams across North, South, East, West, and Central Tehran, emergency dispatches arrive in under 45 minutes.',
  },
  {
    question: 'هزینه خدمات چگونه محاسبه می‌شود؟',
    questionEn: 'How are service costs calculated?',
    answer:
      'هزینه‌ها کاملاً شفاف، منصفانه و بر اساس نرخ مصوب اتحادیه محاسبه می‌شوند. پیش از شروع کار، تکنسین پس از بررسی، برآورد دقیق هزینه را به شما اعلام می‌نماید.',
    answerEn:
      'Pricing is transparent, fair, and based on official guild rates. Technicians provide an exact estimate after initial inspection before starting work.',
  },
  {
    question: 'چگونه وضعیت درخواست خود را پیگیری کنم؟',
    questionEn: 'How can I track my request status?',
    answer:
      'پس از ثبت درخواست، یک کد رهگیری اختصاصی برای شما پیامک می‌شود که می‌توانید با وارد کردن شماره موبایل در صفحه پیگیری درخواست‌ها، وضعیت لحظه‌ای را مشاهده کنید.',
    answerEn:
      'After submitting, a unique tracking code is issued. You can track live dispatch status on the tracking page anytime.',
  },
];

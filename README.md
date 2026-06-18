# منصة وئام للإصلاح الأسري — Next.js

منصة كاملة (تطبيق العميل + لوحة الإدارة) لتقييم وتحسين العلاقات الأسرية.

## التقنيات
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + نظام تصميم وئام (RTL، خط Tajawal، تأثيرات حيوية)
- **Prisma** + **PostgreSQL** (Supabase)
- مصادقة **JWT** (jose) عبر كوكي httpOnly + حماية المسارات بـ middleware
- نشر على **Vercel**

## البنية
```
src/
  app/
    login/                  صفحة الدخول (عميل / موظف)
    (customer)/             منطقة العميل (topbar مشترك)
      home/                 الرئيسية + الإحصائيات + الخدمات
      assessments/          تقييماتي (بطاقات + نسبة التقدّم)
      assessment/new        إجراء تقييم جديد
      assessment/[id]       عرض/تعبئة التقييم
      settings, about, rate
    admin/                  لوحة الإدارة (sidebar)
      page                  لوحة المعلومات
      customers, assessments, offices
    api/auth/login|logout   نقاط المصادقة
  components/               Topbar, ServiceMenu, Placeholder
  lib/                      prisma, session
prisma/
  schema.prisma            نموذج البيانات الكامل
  seed.ts                  بيانات تجريبية
```

## التشغيل محلياً (يتطلب Node 20+)
```bash
npm install
cp .env.example .env        # واملأ DATABASE_URL و AUTH_SECRET
npm run db:push             # إنشاء الجداول
npm run db:seed             # بيانات تجريبية
npm run dev
```

### حسابات تجريبية (بعد البذور)
- **مدير:** `admin` / `admin123`
- **عميل:** `0500000000` / `123456`

## النشر على Vercel
1. اربط المستودع بـ Vercel.
2. أضِف متغيّرات البيئة: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`.
3. أمر البناء الافتراضي يكفي (`prisma generate && next build`).
4. بعد أول نشر شغّل `prisma db push` (محلياً أو عبر Vercel CLI) لإنشاء الجداول.

## الحالة
✅ الأساس + المصادقة + الرئيسية + تقييماتي + لوحة الإدارة.
🔜 تعبئة/عرض التقييم بالتفصيل، التحليل بالذكاء الاصطناعي، التقارير، الصلاحيات.

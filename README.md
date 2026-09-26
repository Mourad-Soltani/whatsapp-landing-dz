# WhatsApp Landing DZ – خطة السفر لآسيا بالباسبور الجزائري

صفحة هبوط (Landing Page) جاهزة لبيع **الخطة الكاملة للسفر إلى آسيا** (دبي + بالي + المالديف + ماليزيا) لأصحاب الباسبور الجزائري عبر واتساب.

## المميزات

- تصميم متجاوب (موبايل أولاً) بألوان واتساب الخضراء
- دعم كامل للغة العربية واتجاه RTL
- فصل ماليزيا المجاني كعينة (PDF مثال حي)
- سعر مخفض: **2500 دج** (بدلاً من 5000 دج)
- زر واتساب ثابت في الأسفل مع تأثير نبض
- ضمان استرجاع 7 أيام
- طرق دفع: BaridiMob / CCP / Paysera / PayPal / RedotPay

## المحتوى الرئيسي

- **العنوان**: 12 شهر في آسيا بالباسبور الجزائري؟ كاينة خطة PDF مجربة
- **العرض**: فصل ماليزيا مجاني + الخطة الكاملة بـ 2500 دج
- **الدول المغطاة**: دبي، بالي، المالديف، ماليزيا
- **التواصل**: رسائل واتساب فقط (لا مكالمات) من 10:00 إلى 22:00

## الرابط المباشر لواتساب

الرابط المستخدم في الصفحة:

```
https://wa.me/213663922680?text=سلام%20احمد%20عجبني%20الفصل%20المجاني%20حاب%20نشري%20الخطة%20الكاملة%20ب%202500دج
```

## طريقة الاستخدام

1. افتح ملف `index.html` في المتصفح
2. أو انشره على أي استضافة ثابتة (GitHub Pages, Netlify, Vercel...)
3. غيّر رقم الواتساب والرسالة الافتراضية إذا لزم الأمر

## التقنيات

- React 18 (مُجمّع في ملف HTML واحد)
- Tailwind CSS
- خط Tajawal للعربية
- بدون تبعيات خارجية بعد التحميل

## النشر على GitHub Pages

يمكنك تفعيل GitHub Pages من إعدادات المستودع واختيار الفرع `main` ومصدر الجذر `/`.

---

**ملاحظة**: هذه صفحة تسويقية جاهزة. تأكد من تحديث رقم الواتساب والرسائل حسب احتياجك.

## 📊 Live visitor counter

The page includes a **live page-view counter**:

- Fixed badge (top-left): `👁 X زيارة`
- Also shown in the footer
- Powered by [countapi.mileshilliard.com](https://countapi.mileshilliard.com) (free, no signup)
- Counter key: `whatsapp-landing-dz-visits`

Each page load increments the total. You can check the raw value anytime:

```
https://countapi.mileshilliard.com/api/v1/get/whatsapp-landing-dz-visits
```


## Analytics (Microsoft Clarity)

Detailed dashboard (views, countries, cities, heatmaps, session recordings):

- Project ID: `yoav1jlin6`
- Dashboard: https://clarity.microsoft.com/projects/view/yoav1jlin6/
- Live site: https://whatsapp-landing-dz.vercel.app/


## Public analytics dashboard (Vercel)

Live demo page (no Clarity login required):

- **URL:** `https://whatsapp-landing-dz.vercel.app/analytics`
- **API:** `/api/clarity` (server-side proxy to Microsoft Clarity Data Export)

### Setup on Vercel (required once)

1. Open [Vercel Dashboard](https://vercel.com) → project `whatsapp-landing-dz`
2. **Settings → Environment Variables**
3. Add:
   - **Name:** `CLARITY_API_TOKEN`
   - **Value:** *(your Clarity API token from Settings → Data Export)*
   - Environments: Production + Preview
4. **Redeploy** the project

Without this env var, `/analytics` still loads but Clarity panels stay empty.

### Security

- The API token is **never** committed to Git.
- Only the Vercel serverless function (`api/clarity.js`) can read it.
- Rotate the token in Clarity if it was ever shared in chat.

### What the dashboard shows

- Total lifetime page views (public counter)
- Sessions / page views / scroll depth (last 1–3 days via Clarity)
- Breakdown by **Country**, **Device**, **Browser**, **OS**

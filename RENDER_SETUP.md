# 🎨 إعداد البوت على Render (مجاني 24/7)

Render توفر **750 ساعة شهرية مجانية** (كافية للبوت طول الشهر) بدون بطاقة ائتمان!

## 📋 المتطلبات

- حساب GitHub (لديك بالفعل)
- حساب Render (سننشئه)
- Discord Bot Token
- Gemini API Key

## 🚀 خطوات الإعداد

### 1. إنشاء حساب Render

1. اذهب إلى [render.com](https://render.com)
2. اضغط **Sign Up**
3. اختر **Continue with GitHub**
4. أعطِ Render صلاحيات الوصول إلى GitHub

### 2. إنشاء خدمة جديدة

1. في لوحة تحكم Render، اضغط **New +**
2. اختر **Web Service**
3. اختر **Connect a repository**
4. ابحث عن `discord-ai-bot` واختره
5. اضغط **Connect**

### 3. إعدادات الخدمة

ملء النموذج كالتالي:

| الحقل | القيمة |
|------|--------|
| **Name** | discord-ai-bot |
| **Environment** | Node |
| **Region** | Singapore (أقرب منطقة) |
| **Branch** | main |
| **Build Command** | `pnpm install && pnpm build` |
| **Start Command** | `node dist/index.js` |

### 4. إضافة متغيرات البيئة

1. اضغط **Environment** في الجانب الأيسر
2. أضف المتغيرات التالية:

```env
DISCORD_TOKEN=1445716456602992720
GEMINI_API_KEY=6cb744d29bcf90c3e6b25fd7b644caabebbb9dd88080ebbac8cc0e526b05e65b
NODE_ENV=production
DATABASE_URL=mysql://user:password@host:port/database
```

### 5. إضافة قاعدة البيانات (اختياري)

إذا أردت قاعدة بيانات مجانية:

1. اضغط **New +** → **MySQL**
2. سيتم إنشاء `DATABASE_URL` تلقائياً
3. انسخها وأضفها إلى متغيرات البيئة

### 6. التشغيل

1. اضغط **Create Web Service**
2. انتظر انتهاء البناء (Build)
3. تحقق من السجلات (Logs) للتأكد من تشغيل البوت

## 📊 المراقبة

- **Logs**: اعرض سجلات البوت في الوقت الفعلي
- **Metrics**: راقب استخدام الموارد
- **Auto-deploy**: التحديثات التلقائية من GitHub

## ⚠️ ملاحظات مهمة

- الخدمة المجانية قد تتوقف بعد 15 دقيقة عدم نشاط (لكن البوت يعمل طول الوقت)
- لا تحتاج بطاقة ائتمان للخطة المجانية
- 750 ساعة شهرية كافية للبوت (24 × 30 = 720 ساعة)

## 🔧 استكشاف الأخطاء

**البوت لا يبدأ؟**
- تحقق من السجلات (Logs)
- تأكد من `DISCORD_TOKEN` و `GEMINI_API_KEY`
- تأكد من أن قاعدة البيانات متصلة

**الأوامر لا تعمل؟**
- تأكد من تسجيل أوامر Slash Commands
- أعد تشغيل الخدمة من لوحة تحكم Render

## 🔄 التحديثات التلقائية

عند كل push إلى GitHub:
1. Render سيكتشف التحديث تلقائياً
2. سيعيد بناء المشروع
3. سيعيد تشغيل البوت

لا تحتاج لفعل أي شيء يدوياً! 🎉

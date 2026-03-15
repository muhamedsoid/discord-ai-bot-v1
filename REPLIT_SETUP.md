# 🎨 إعداد البوت على Replit (مجاني 24/7)

Replit توفر استضافة مجانية 24/7 بدون بطاقة ائتمان!

## 📋 المتطلبات

- حساب Replit (مجاني)
- Discord Bot Token
- Gemini API Key

## 🚀 خطوات الإعداد

### 1. استيراد المشروع إلى Replit

1. اذهب إلى [replit.com](https://replit.com)
2. اضغط **Create** → **Import from GitHub**
3. أدخل رابط المستودع:
   ```
   https://github.com/muhamedsoid/discord-bot-ai-v1
   ```
4. اضغط **Import**

### 2. إعداد متغيرات البيئة

1. في Replit، اضغط **Secrets** (🔒 أيقونة القفل)
2. أضف المتغيرات التالية:

```
DISCORD_TOKEN=YOUR_DISCORD_TOKEN_HERE
GEMINI_API_KEY=6cb744d29bcf90c3e6b25fd7b644caabebbb9dd88080ebbac8cc0e526b05e65b
NODE_ENV=production
```

### 3. تشغيل البوت

1. اضغط **Run** (الزر الأخضر)
2. Replit سيثبت المتطلبات تلقائياً
3. البوت سيبدأ التشغيل!

### 4. تفعيل التشغيل المستمر (Always On)

1. اضغط على اسمك في الزاوية اليمنى العليا
2. اذهب إلى **Account**
3. اختر **Replit Pro** (اختياري - لكن يمكنك استخدام المجاني)
4. أو استخدم **Uptime Robot** (مجاني) لإبقاء البوت مشغول

---

## 🔄 استخدام Uptime Robot (مجاني)

لإبقاء البوت مشغول 24/7 بدون Replit Pro:

1. اذهب إلى [uptimerobot.com](https://uptimerobot.com)
2. سجل حساب مجاني
3. أضف **Monitor** جديد
4. اختر **HTTP(s)**
5. أدخل رابط Replit الخاص بك
6. اضغط **Create Monitor**

---

## 📊 المراقبة

- **Console**: اعرض السجلات في الوقت الفعلي
- **Files**: عدّل الملفات مباشرة
- **Version Control**: تحديثات من GitHub تلقائياً

## ⚠️ ملاحظات مهمة

- ✅ مجاني تماماً (بدون بطاقة ائتمان)
- ✅ يعمل 24/7
- ✅ تحديثات تلقائية من GitHub
- ✅ سهل جداً

---

## 🔧 استكشاف الأخطاء

**البوت لا يبدأ؟**
- تحقق من Console للأخطاء
- تأكد من `DISCORD_TOKEN` و `GEMINI_API_KEY`

**الأوامر لا تعمل؟**
- تأكد من تسجيل أوامر Slash Commands
- أعد تشغيل البوت

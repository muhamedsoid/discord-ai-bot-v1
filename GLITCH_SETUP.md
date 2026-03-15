# 🎨 إعداد البوت على Glitch (مجاني 24/7)

Glitch توفر استضافة مجانية 24/7 بدون بطاقة ائتمان!

## 📋 المتطلبات

- حساب Glitch (مجاني)
- Discord Bot Token
- Gemini API Key

## 🚀 خطوات الإعداد

### 1. استيراد المشروع إلى Glitch

1. اذهب إلى [glitch.com](https://glitch.com)
2. سجل حساب مجاني
3. اضغط **New Project** → **Import from GitHub**
4. أدخل رابط المستودع:
   ```
   https://github.com/muhamedsoid/discord-bot-ai-v1
   ```
5. اضغط **Import**

### 2. إعداد متغيرات البيئة

1. في Glitch، اضغط **.env** (في الملفات)
2. أضف المتغيرات التالية:

```env
DISCORD_TOKEN=YOUR_DISCORD_TOKEN_HERE
GEMINI_API_KEY=6cb744d29bcf90c3e6b25fd7b644caabebbb9dd88080ebbac8cc0e526b05e65b
NODE_ENV=production
DATABASE_URL=mysql://user:password@host/database
```

### 3. تعديل package.json

تأكد من أن `package.json` يحتوي على:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "pnpm build",
    "dev": "pnpm dev"
  }
}
```

### 4. تشغيل البوت

1. اضغط **Logs** لرؤية السجلات
2. Glitch سيبدأ التشغيل تلقائياً
3. ستظهر رسالة "Bot is running!"

### 5. إبقاء البوت مشغول 24/7

Glitch يحافظ على المشروع مشغول طالما:
- ✅ لديك حساب مجاني
- ✅ تفتح المشروع كل 5 أيام
- ✅ أو استخدم **Uptime Robot** (مجاني)

---

## 🔄 استخدام Uptime Robot (اختياري)

لإبقاء البوت مشغول 100%:

1. اذهب إلى [uptimerobot.com](https://uptimerobot.com)
2. سجل حساب مجاني
3. أضف **Monitor** جديد
4. اختر **HTTP(s)**
5. أدخل رابط Glitch الخاص بك (يظهر في الأعلى)
6. اضغط **Create Monitor**

---

## 📊 المراقبة

- **Logs**: اعرض السجلات في الوقت الفعلي
- **Files**: عدّل الملفات مباشرة
- **Terminal**: استخدم الـ terminal

## ⚠️ ملاحظات مهمة

- ✅ مجاني تماماً (بدون بطاقة ائتمان)
- ✅ يعمل 24/7
- ✅ تحديثات تلقائية من GitHub
- ✅ سهل جداً
- ⚠️ يحتاج فتح المشروع كل 5 أيام (أو استخدم Uptime Robot)

---

## 🔧 استكشاف الأخطاء

**البوت لا يبدأ؟**
- تحقق من **Logs**
- تأكد من `DISCORD_TOKEN` و `GEMINI_API_KEY`
- تأكد من أن `package.json` صحيح

**الأوامر لا تعمل؟**
- تأكد من تسجيل أوامر Slash Commands
- أعد تشغيل البوت من **Logs**

---

## 📝 الملفات المهمة

- `.env` - متغيرات البيئة
- `package.json` - المتطلبات والأوامر
- `server/_core/index.ts` - نقطة البداية

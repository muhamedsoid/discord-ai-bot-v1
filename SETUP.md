# دليل الإعداد المفصل - Discord AI Bot

## المرحلة الأولى: الإعدادات الأساسية

### 1. الحصول على توكن Discord

1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. انقر على "New Application" وأدخل اسم التطبيق
3. انتقل إلى قسم "Bot" وانقر "Add Bot"
4. انسخ التوكن من قسم "TOKEN"
5. احفظه في مكان آمن (لا تشاركه مع أحد!)

### 2. الحصول على مفتاح Gemini API

1. اذهب إلى [Google AI Studio](https://aistudio.google.com/app/apikey)
2. انقر على "Create API Key"
3. اختر المشروع الخاص بك
4. سيتم إنشاء المفتاح تلقائياً
5. انسخ المفتاح واحفظه

### 3. إعداد قاعدة البيانات

#### خيار 1: MySQL محلي
```bash
# تثبيت MySQL
sudo apt-get install mysql-server

# تشغيل MySQL
sudo systemctl start mysql

# إنشاء قاعدة بيانات
mysql -u root -p
CREATE DATABASE discord_ai_bot;
CREATE USER 'bot_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON discord_ai_bot.* TO 'bot_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### خيار 2: TiDB Cloud
1. اذهب إلى [TiDB Cloud](https://tidbcloud.com)
2. أنشئ حساباً جديداً
3. أنشئ مجموعة (Cluster) جديدة
4. احصل على سلسلة الاتصال

## المرحلة الثانية: تثبيت المشروع

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd discord-ai-bot
```

### 2. تثبيت المكتبات
```bash
pnpm install
```

### 3. إنشاء ملف .env
أنشئ ملف `.env` في جذر المشروع:

```env
# قاعدة البيانات
DATABASE_URL=mysql://bot_user:strong_password@localhost:3306/discord_ai_bot

# Discord Bot
DISCORD_TOKEN=your_discord_bot_token_here

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# JWT
JWT_SECRET=your_random_jwt_secret_here

# OAuth (من Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# معلومات المالك
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
```

### 4. إعداد قاعدة البيانات
```bash
pnpm db:push
```

## المرحلة الثالثة: تشغيل البوت

### 1. تشغيل في بيئة التطوير
```bash
pnpm dev
```

سيتم تشغيل:
- خادم الويب على `http://localhost:3000`
- بوت الديسكورد في الخلفية

### 2. البناء للإنتاج
```bash
pnpm build
pnpm start
```

## المرحلة الرابعة: إضافة البوت إلى السيرفر

### 1. إنشاء رابط الدعوة
1. اذهب إلى [Discord Developer Portal](https://discord.com/developers/applications)
2. اختر التطبيق الخاص بك
3. انتقل إلى قسم "OAuth2" ثم "URL Generator"
4. اختر الصلاحيات:
   - `bot`
   - `send_messages`
   - `manage_messages`
   - `kick_members`
   - `ban_members`
   - `moderate_members`
5. انسخ الرابط المُنشأ

### 2. إضافة البوت إلى السيرفر
1. افتح الرابط في المتصفح
2. اختر السيرفر الذي تريد إضافة البوت إليه
3. أعط البوت الصلاحيات المطلوبة

## المرحلة الخامسة: التحقق من التثبيت

### 1. اختبار البوت
في أي قناة في السيرفر، اكتب:
```
!ping
```

يجب أن يرد البوت بـ:
```
🏓 Pong! Latency: XXms
```

### 2. اختبار الذكاء الاصطناعي
```
!ai مرحبا، كيف حالك؟
```

يجب أن يرد البوت برسالة من الذكاء الاصطناعي.

### 3. الوصول إلى الداشبورد
افتح المتصفح وانتقل إلى:
```
http://localhost:3000
```

سيطلب منك تسجيل الدخول عبر Manus OAuth.

## استكشاف الأخطاء الشائعة

### خطأ: "Invalid token"
- تأكد من أن توكن Discord صحيح
- تحقق من أنك لم تشارك التوكن مع أحد

### خطأ: "Database connection failed"
- تحقق من أن قاعدة البيانات تعمل
- تأكد من صحة سلسلة الاتصال في `.env`
- جرب الاتصال يدويا: `mysql -u bot_user -p`

### خطأ: "Gemini API error"
- تحقق من أن مفتاح API صحيح
- تأكد من تفعيل Gemini API في Google Cloud
- تحقق من حد الطلبات (قد تكون قد تجاوزت الحد المجاني)

### البوت لا يستجيب للأوامر
- تأكد من أن البوت قيد التشغيل
- تحقق من أن البوت لديه صلاحيات الكتابة في القنوات
- جرب أمر `!help` للتحقق من أن البوت يعمل

## الخطوات التالية

1. **تخصيص الإعدادات**: اذهب إلى لوحة التحكم وخصص إعدادات البوت
2. **إضافة أوامر مخصصة**: عدّل `server/bot/commands/` لإضافة أوامر جديدة
3. **نشر البوت**: استخدم خدمة استضافة مثل Heroku أو DigitalOcean

## الدعم والمساعدة

إذا واجهت مشاكل:
1. تحقق من السجلات في الكونسول
2. اقرأ رسائل الخطأ بعناية
3. تحقق من ملف `.env` من جديد
4. جرب إعادة تشغيل البوت

---

تم إنشاؤه بواسطة **Manus AI**

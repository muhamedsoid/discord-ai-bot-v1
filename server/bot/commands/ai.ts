import type { Command } from "../types";
import { Message, EmbedBuilder } from "discord.js";
import { askGemini } from "../services/geminiService";
import { getDb } from "../../db";
import { aiConversations } from "../../../drizzle/schema";

export const aiCommand: Command = {
  name: "ai",
  description: "اسأل الذكاء الاصطناعي سؤال",
  aliases: ["ask", "gpt"],
  async execute(message, args) {
    if (!(message instanceof Message)) return;

    const question = args.join(" ");
    if (!question) {
      await message.reply("❌ يجب أن تكتب سؤالك بعد الأمر. مثال: `!ai ما هو الذكاء الاصطناعي؟`");
      return;
    }

    // إظهار رسالة التحميل
    const loadingMsg = await message.reply("⏳ جاري معالجة سؤالك...");

    try {
      // الحصول على الإجابة من Gemini
      const response = await askGemini(question);

      // تقسيم الرد إذا كان طويلاً جداً
      const maxLength = 2000;
      let responseText = response;

      if (responseText.length > maxLength) {
        responseText = responseText.substring(0, maxLength - 3) + "...";
      }

      // إنشاء Embed للرد
      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("🤖 إجابة الذكاء الاصطناعي")
        .setDescription(responseText)
        .setFooter({ text: `سؤال من ${message.author.username}` })
        .setTimestamp();

      // تحديث الرسالة بالإجابة
      await loadingMsg.edit({ embeds: [embed] });

      // تسجيل المحادثة في قاعدة البيانات
      const db = await getDb();
      if (db && message.guildId && message.channelId) {
        try {
          await db.insert(aiConversations).values({
            serverId: message.guildId,
            channelId: message.channelId,
            userId: message.author.id,
            userMessage: question,
            aiResponse: response,
          });
        } catch (dbError) {
          console.error("Error saving conversation:", dbError);
        }
      }
    } catch (error) {
      console.error("AI command error:", error);

      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("❌ خطأ")
        .setDescription(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء معالجة سؤالك. يرجى المحاولة لاحقاً."
        )
        .setTimestamp();

      await loadingMsg.edit({ embeds: [errorEmbed] });
    }
  },
};

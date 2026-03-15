import type { Command } from "../types";
import { Message, EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { askGemini } from "../services/geminiService";
import { getDb } from "../../db";
import { aiConversations } from "../../../drizzle/schema";

export const aiCommand: Command = {
  name: "ai",
  description: "اسأل الذكاء الاصطناعي سؤال",
  aliases: ["ask", "gpt"],
  slashBuilder: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("اسأل الذكاء الاصطناعي سؤال")
    .addStringOption(option => 
      option.setName("question")
        .setDescription("السؤال الذي تريد طرحه")
        .setRequired(true)),
  async execute(interaction, args) {
    const isMessage = interaction instanceof Message;
    const question = isMessage ? args.join(" ") : interaction.options.getString("question");
    const author = isMessage ? interaction.author : interaction.user;

    if (!question) {
      if (isMessage) await interaction.reply("❌ يجب أن تكتب سؤالك بعد الأمر. مثال: `!ai ما هو الذكاء الاصطناعي؟`");
      return;
    }

    const reply = isMessage ? await interaction.reply("⏳ جاري معالجة سؤالك...") : await interaction.reply({ content: "⏳ جاري معالجة سؤالك...", fetchReply: true });

    try {
      const response = await askGemini(question);
      const maxLength = 2000;
      let responseText = response;
      if (responseText.length > maxLength) responseText = responseText.substring(0, maxLength - 3) + "...";

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("🤖 إجابة الذكاء الاصطناعي")
        .setDescription(responseText)
        .setFooter({ text: `سؤال من ${author.username}` })
        .setTimestamp();

      if (isMessage) {
        await reply.edit({ content: null, embeds: [embed] });
      } else {
        await interaction.editReply({ content: null, embeds: [embed] });
      }

      const db = await getDb();
      if (db && interaction.guildId && interaction.channelId) {
        try {
          await db.insert(aiConversations).values({
            serverId: interaction.guildId,
            channelId: interaction.channelId,
            userId: author.id,
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
        .setDescription(error instanceof Error ? error.message : "حدث خطأ أثناء معالجة سؤالك.")
        .setTimestamp();

      if (isMessage) {
        await reply.edit({ content: null, embeds: [errorEmbed] });
      } else {
        await interaction.editReply({ content: null, embeds: [errorEmbed] });
      }
    }
  },
};

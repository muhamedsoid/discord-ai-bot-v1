import type { Command } from "../types";
import { Message, EmbedBuilder } from "discord.js";

export const helpCommand: Command = {
  name: "help",
  description: "عرض قائمة الأوامر المتاحة",
  aliases: ["h", "commands"],
  async execute(message) {
    if (!(message instanceof Message)) return;

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("📚 قائمة الأوامر")
      .addFields(
        { name: "الأوامر العامة", value: "---" },
        { name: "!ping", value: "عرض تأخير البوت" },
        { name: "!help", value: "عرض قائمة الأوامر" },
        { name: "!ai [question]", value: "اسأل الذكاء الاصطناعي سؤال" },
        { name: "\nأوامر الإدارة (للمشرفين فقط)", value: "---" },
        { name: "!kick @user [reason]", value: "طرد عضو من السيرفر" },
        { name: "!ban @user [reason]", value: "حظر عضو من السيرفر" },
        { name: "!warn @user [reason]", value: "تحذير عضو" },
        { name: "!mute @user [reason]", value: "كتم صوت عضو لمدة ساعة" },
        { name: "!unmute @user", value: "فتح صوت عضو" }
      )
      .setFooter({ text: "Discord AI Bot" });

    await message.reply({ embeds: [embed] });
  },
};

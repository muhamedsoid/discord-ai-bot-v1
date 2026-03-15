import type { Command } from "../types";
import { Message, EmbedBuilder, SlashCommandBuilder, GuildMember } from "discord.js";

export const userinfoCommand: Command = {
  name: "userinfo",
  description: "عرض معلومات المستخدم",
  slashBuilder: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("عرض معلومات المستخدم")
    .addUserOption(opt => opt.setName("user").setDescription("المستخدم المراد عرض معلوماته")),
  async execute(interaction) {
    const isMsg = interaction instanceof Message;
    const targetUser = isMsg ? interaction.mentions.users.first() || interaction.author : interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild?.members.fetch(targetUser.id);

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle(`👤 معلومات المستخدم: ${targetUser.username}`)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: "الاسم الكامل", value: targetUser.tag, inline: true },
        { name: "ID", value: targetUser.id, inline: true },
        { name: "تاريخ إنشاء الحساب", value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "تاريخ الانضمام للسيرفر", value: member ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>` : "غير متوفر", inline: true },
        { name: "الرتب", value: member?.roles.cache.map(r => r.name).join(", ") || "لا يوجد", inline: false }
      )
      .setTimestamp();

    isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
  },
};

export const serverinfoCommand: Command = {
  name: "serverinfo",
  description: "عرض معلومات السيرفر",
  slashBuilder: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("عرض معلومات السيرفر"),
  async execute(interaction) {
    const isMsg = interaction instanceof Message;
    const guild = interaction.guild;
    if (!guild) return;

    const embed = new EmbedBuilder()
      .setColor("#e67e22")
      .setTitle(`🏰 معلومات السيرفر: ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "صاحب السيرفر", value: `<@${guild.ownerId}>`, inline: true },
        { name: "ID السيرفر", value: guild.id, inline: true },
        { name: "تاريخ الإنشاء", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "عدد الأعضاء", value: `${guild.memberCount}`, inline: true },
        { name: "عدد الرتب", value: `${guild.roles.cache.size}`, inline: true },
        { name: "عدد القنوات", value: `${guild.channels.cache.size}`, inline: true }
      )
      .setTimestamp();

    isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
  },
};

export const avatarCommand: Command = {
  name: "avatar",
  description: "عرض الصورة الشخصية للمستخدم",
  slashBuilder: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("عرض الصورة الشخصية للمستخدم")
    .addUserOption(opt => opt.setName("user").setDescription("المستخدم المراد عرض صورته")),
  async execute(interaction) {
    const isMsg = interaction instanceof Message;
    const targetUser = isMsg ? interaction.mentions.users.first() || interaction.author : interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setColor("#9b59b6")
      .setTitle(`🖼️ صورة ${targetUser.username}`)
      .setImage(targetUser.displayAvatarURL({ size: 1024 }))
      .setTimestamp();

    isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
  },
};

import type { Command } from "../types";
import { Message, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { getDb } from "../../db";
import { moderationLogs } from "../../../drizzle/schema";

const createModerationEmbed = (action: string, targetUser: string, moderator: string, reason: string, color: any = "#ff0000") => {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(`⚠️ ${action}`)
    .addFields(
      { name: "المستخدم", value: targetUser, inline: true },
      { name: "المشرف", value: moderator, inline: true },
      { name: "السبب", value: reason || "لم يتم تحديد سبب" }
    )
    .setTimestamp();
};

export const kickCommand: Command = {
  name: "kick",
  description: "طرد عضو من السيرفر",
  slashBuilder: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("طرد عضو من السيرفر")
    .addUserOption(opt => opt.setName("user").setDescription("العضو المراد طرده").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("السبب")),
  async execute(interaction, args) {
    const isMsg = interaction instanceof Message;
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;
    const moderator = isMsg ? interaction.author : interaction.user;

    if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
      const msg = "❌ ليس لديك صلاحية طرد الأعضاء";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    const targetUser = isMsg ? interaction.mentions.users.first() : interaction.options.getUser("user");
    const reason = isMsg ? args.slice(1).join(" ") : interaction.options.getString("reason") || "لم يتم تحديد سبب";

    if (!targetUser) {
      if (isMsg) await interaction.reply("❌ يجب أن تحدد عضو لطرده");
      return;
    }

    try {
      const targetMember = await guild?.members.fetch(targetUser.id);
      if (!targetMember || !targetMember.kickable) {
        const msg = "❌ لا يمكنني طرد هذا العضو (قد يكون لديه رتبة أعلى مني)";
        isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
        return;
      }

      await targetMember.kick(reason);

      const db = await getDb();
      if (db && interaction.guildId) {
        await db.insert(moderationLogs).values({
          serverId: interaction.guildId,
          targetUserId: targetUser.id,
          moderatorId: moderator.id,
          action: "kick",
          reason,
        });
      }

      const embed = createModerationEmbed("طرد", targetUser.tag, moderator.tag, reason);
      isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Kick error:", error);
      const msg = "❌ حدث خطأ أثناء محاولة طرد العضو";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
    }
  },
};

export const banCommand: Command = {
  name: "ban",
  description: "حظر عضو من السيرفر",
  slashBuilder: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("حظر عضو من السيرفر")
    .addUserOption(opt => opt.setName("user").setDescription("العضو المراد حظره").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("السبب")),
  async execute(interaction, args) {
    const isMsg = interaction instanceof Message;
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;
    const moderator = isMsg ? interaction.author : interaction.user;

    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
      const msg = "❌ ليس لديك صلاحية حظر الأعضاء";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    const targetUser = isMsg ? interaction.mentions.users.first() : interaction.options.getUser("user");
    const reason = isMsg ? args.slice(1).join(" ") : interaction.options.getString("reason") || "لم يتم تحديد سبب";

    if (!targetUser) {
      if (isMsg) await interaction.reply("❌ يجب أن تحدد عضو لحظره");
      return;
    }

    try {
      const targetMember = await guild?.members.fetch(targetUser.id).catch(() => null);
      if (targetMember && !targetMember.bannable) {
        const msg = "❌ لا يمكنني حظر هذا العضو (قد يكون لديه رتبة أعلى مني)";
        isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
        return;
      }

      await guild?.bans.create(targetUser.id, { reason });

      const db = await getDb();
      if (db && interaction.guildId) {
        await db.insert(moderationLogs).values({
          serverId: interaction.guildId,
          targetUserId: targetUser.id,
          moderatorId: moderator.id,
          action: "ban",
          reason,
        });
      }

      const embed = createModerationEmbed("حظر", targetUser.tag, moderator.tag, reason);
      isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Ban error:", error);
      const msg = "❌ حدث خطأ أثناء محاولة حظر العضو";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
    }
  },
};

export const clearCommand: Command = {
  name: "clear",
  description: "مسح عدد معين من الرسائل",
  slashBuilder: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("مسح عدد معين من الرسائل")
    .addIntegerOption(opt => opt.setName("amount").setDescription("عدد الرسائل (1-100)").setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction, args) {
    const isMsg = interaction instanceof Message;
    const member = interaction.member as GuildMember;
    const channel = interaction.channel;

    if (!member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      const msg = "❌ ليس لديك صلاحية إدارة الرسائل";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    const amount = isMsg ? parseInt(args[0]) : interaction.options.getInteger("amount");
    if (!amount || isNaN(amount) || amount < 1 || amount > 100) {
      const msg = "❌ يرجى تحديد عدد بين 1 و 100";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    try {
      if (channel?.isTextBased() && "bulkDelete" in channel) {
        await channel.bulkDelete(amount, true);
        const successMsg = `✅ تم مسح ${amount} رسالة بنجاح`;
        if (isMsg) {
           const reply = await interaction.channel.send(successMsg);
           setTimeout(() => reply.delete().catch(() => {}), 5000);
        } else {
           await interaction.reply({ content: successMsg, ephemeral: true });
        }
      }
    } catch (error) {
      console.error("Clear error:", error);
      const msg = "❌ حدث خطأ أثناء محاولة مسح الرسائل (قد تكون الرسائل قديمة جداً)";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
    }
  },
};

export const warnCommand: Command = {
  name: "warn",
  description: "تحذير عضو",
  slashBuilder: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("تحذير عضو")
    .addUserOption(opt => opt.setName("user").setDescription("العضو المراد تحذيره").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("السبب")),
  async execute(interaction, args) {
    const isMsg = interaction instanceof Message;
    const member = interaction.member as GuildMember;
    const moderator = isMsg ? interaction.author : interaction.user;

    if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      const msg = "❌ ليس لديك صلاحية تحذير الأعضاء";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    const targetUser = isMsg ? interaction.mentions.users.first() : interaction.options.getUser("user");
    const reason = isMsg ? args.slice(1).join(" ") : interaction.options.getString("reason") || "لم يتم تحديد سبب";

    if (!targetUser) {
      if (isMsg) await interaction.reply("❌ يجب أن تحدد عضو لتحذيره");
      return;
    }

    try {
      const db = await getDb();
      if (db && interaction.guildId) {
        await db.insert(moderationLogs).values({
          serverId: interaction.guildId,
          targetUserId: targetUser.id,
          moderatorId: moderator.id,
          action: "warn",
          reason,
        });
      }

      const embed = createModerationEmbed("تحذير", targetUser.tag, moderator.tag, reason, "#ffff00");
      isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Warn error:", error);
      const msg = "❌ حدث خطأ أثناء محاولة تحذير العضو";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
    }
  },
};

export const muteCommand: Command = {
  name: "mute",
  description: "كتم صوت عضو (Timeout)",
  slashBuilder: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("كتم صوت عضو (Timeout)")
    .addUserOption(opt => opt.setName("user").setDescription("العضو المراد كتمه").setRequired(true))
    .addIntegerOption(opt => opt.setName("duration").setDescription("المدة بالدقائق").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("السبب")),
  async execute(interaction, args) {
    const isMsg = interaction instanceof Message;
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;
    const moderator = isMsg ? interaction.author : interaction.user;

    if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      const msg = "❌ ليس لديك صلاحية كتم الأعضاء";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    const targetUser = isMsg ? interaction.mentions.users.first() : interaction.options.getUser("user");
    const duration = isMsg ? parseInt(args[1]) || 60 : interaction.options.getInteger("duration") || 60;
    const reason = isMsg ? args.slice(2).join(" ") : interaction.options.getString("reason") || "لم يتم تحديد سبب";

    if (!targetUser) {
      if (isMsg) await interaction.reply("❌ يجب أن تحدد عضو لكتمه");
      return;
    }

    try {
      const targetMember = await guild?.members.fetch(targetUser.id);
      if (!targetMember || !targetMember.moderatable) {
        const msg = "❌ لا يمكنني كتم هذا العضو";
        isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
        return;
      }

      await targetMember.timeout(duration * 60 * 1000, reason);

      const embed = createModerationEmbed("كتم (Timeout)", targetUser.tag, moderator.tag, `المدة: ${duration} دقيقة\nالسبب: ${reason}`, "#ff8800");
      isMsg ? await interaction.reply({ embeds: [embed] }) : await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Mute error:", error);
      const msg = "❌ حدث خطأ أثناء محاولة كتم العضو";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
    }
  },
};

export const unmuteCommand: Command = {
  name: "unmute",
  description: "إلغاء كتم عضو",
  slashBuilder: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("إلغاء كتم عضو")
    .addUserOption(opt => opt.setName("user").setDescription("العضو المراد إلغاء كتمه").setRequired(true)),
  async execute(interaction) {
    const isMsg = interaction instanceof Message;
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;

    if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      const msg = "❌ ليس لديك صلاحية إلغاء كتم الأعضاء";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
      return;
    }

    const targetUser = isMsg ? interaction.mentions.users.first() : interaction.options.getUser("user");
    if (!targetUser) {
      if (isMsg) await interaction.reply("❌ يجب أن تحدد عضو لإلغاء كتمه");
      return;
    }

    try {
      const targetMember = await guild?.members.fetch(targetUser.id);
      if (!targetMember) {
        const msg = "❌ لم يتم العثور على العضو";
        isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
        return;
      }

      await targetMember.timeout(null);
      const successMsg = `✅ تم إلغاء كتم ${targetUser.tag} بنجاح`;
      isMsg ? await interaction.reply(successMsg) : await interaction.reply(successMsg);
    } catch (error) {
      console.error("Unmute error:", error);
      const msg = "❌ حدث خطأ أثناء محاولة إلغاء كتم العضو";
      isMsg ? await interaction.reply(msg) : await interaction.reply({ content: msg, ephemeral: true });
    }
  },
};

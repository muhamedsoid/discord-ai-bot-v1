import type { Command } from "../types";
import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { getDb } from "../../db";
import { moderationLogs } from "../../../drizzle/schema";

const createModerationEmbed = (action: string, targetUser: string, reason: string) => {
  return new EmbedBuilder()
    .setColor("#ff0000")
    .setTitle(`⚠️ ${action}`)
    .addFields(
      { name: "المستخدم", value: targetUser },
      { name: "السبب", value: reason || "لم يتم تحديد سبب" }
    )
    .setTimestamp();
};

export const kickCommand: Command = {
  name: "kick",
  description: "طرد عضو من السيرفر",
  adminOnly: true,
  async execute(message, args) {
    if (!(message instanceof Message)) return;

    if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers)) {
      await message.reply("❌ ليس لديك صلاحية لطرد الأعضاء");
      return;
    }

    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      await message.reply("❌ يجب أن تحدد عضو لطرده");
      return;
    }

    const reason = args.slice(1).join(" ") || "لم يتم تحديد سبب";

    try {
      const member = await message.guild?.members.fetch(targetUser.id);
      if (!member) {
        await message.reply("❌ لم أتمكن من العثور على العضو");
        return;
      }

      await member.kick(reason);

      const db = await getDb();
      if (db) {
        await db.insert(moderationLogs).values({
          serverId: message.guildId!,
          targetUserId: targetUser.id,
          moderatorId: message.author.id,
          action: "kick",
          reason,
        });
      }

      const embed = createModerationEmbed("طرد", targetUser.username, reason);
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Kick error:", error);
      await message.reply("❌ حدث خطأ أثناء محاولة طرد العضو");
    }
  },
};

export const banCommand: Command = {
  name: "ban",
  description: "حظر عضو من السيرفر",
  adminOnly: true,
  async execute(message, args) {
    if (!(message instanceof Message)) return;

    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
      await message.reply("❌ ليس لديك صلاحية لحظر الأعضاء");
      return;
    }

    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      await message.reply("❌ يجب أن تحدد عضو لحظره");
      return;
    }

    const reason = args.slice(1).join(" ") || "لم يتم تحديد سبب";

    try {
      await message.guild?.bans.create(targetUser.id, { reason });

      const db = await getDb();
      if (db) {
        await db.insert(moderationLogs).values({
          serverId: message.guildId!,
          targetUserId: targetUser.id,
          moderatorId: message.author.id,
          action: "ban",
          reason,
        });
      }

      const embed = createModerationEmbed("حظر", targetUser.username, reason);
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Ban error:", error);
      await message.reply("❌ حدث خطأ أثناء محاولة حظر العضو");
    }
  },
};

export const warnCommand: Command = {
  name: "warn",
  description: "تحذير عضو",
  adminOnly: true,
  async execute(message, args) {
    if (!(message instanceof Message)) return;

    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply("❌ ليس لديك صلاحية لتحذير الأعضاء");
      return;
    }

    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      await message.reply("❌ يجب أن تحدد عضو لتحذيره");
      return;
    }

    const reason = args.slice(1).join(" ") || "لم يتم تحديد سبب";

    try {
      const db = await getDb();
      if (db) {
        await db.insert(moderationLogs).values({
          serverId: message.guildId!,
          targetUserId: targetUser.id,
          moderatorId: message.author.id,
          action: "warn",
          reason,
        });
      }

      const embed = createModerationEmbed("تحذير", targetUser.username, reason);
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Warn error:", error);
      await message.reply("❌ حدث خطأ أثناء محاولة تحذير العضو");
    }
  },
};

export const muteCommand: Command = {
  name: "mute",
  description: "كتم صوت عضو",
  adminOnly: true,
  async execute(message, args) {
    if (!(message instanceof Message)) return;

    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply("❌ ليس لديك صلاحية لكتم صوت الأعضاء");
      return;
    }

    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      await message.reply("❌ يجب أن تحدد عضو لكتم صوته");
      return;
    }

    const reason = args.slice(1).join(" ") || "لم يتم تحديد سبب";

    try {
      const member = await message.guild?.members.fetch(targetUser.id);
      if (!member) {
        await message.reply("❌ لم أتمكن من العثور على العضو");
        return;
      }

      const muteTime = 60 * 60 * 1000; // ساعة واحدة
      await member.timeout(muteTime, reason);

      const embed = createModerationEmbed("كتم صوت", targetUser.username, reason);
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Mute error:", error);
      await message.reply("❌ حدث خطأ أثناء محاولة كتم صوت العضو");
    }
  },
};

export const unmuteCommand: Command = {
  name: "unmute",
  description: "فتح صوت عضو",
  adminOnly: true,
  async execute(message) {
    if (!(message instanceof Message)) return;

    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply("❌ ليس لديك صلاحية لفتح صوت الأعضاء");
      return;
    }

    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      await message.reply("❌ يجب أن تحدد عضو لفتح صوته");
      return;
    }

    try {
      const member = await message.guild?.members.fetch(targetUser.id);
      if (!member) {
        await message.reply("❌ لم أتمكن من العثور على العضو");
        return;
      }

      await member.timeout(null);

      const embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("✅ فتح الصوت")
        .addFields({ name: "المستخدم", value: targetUser.username })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Unmute error:", error);
      await message.reply("❌ حدث خطأ أثناء محاولة فتح صوت العضو");
    }
  },
};

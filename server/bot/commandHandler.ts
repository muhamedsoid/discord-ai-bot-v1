import { Message } from "discord.js";
import { BotClient } from "./client";
import { pingCommand } from "./commands/ping";
import { helpCommand } from "./commands/help";
import { kickCommand, banCommand, warnCommand, muteCommand, unmuteCommand } from "./commands/moderation";
import { aiCommand } from "./commands/ai";
import { getDb } from "../db";
import { commandLogs } from "../../drizzle/schema";

const commands = [
  pingCommand,
  helpCommand,
  kickCommand,
  banCommand,
  warnCommand,
  muteCommand,
  unmuteCommand,
  aiCommand,
];

export async function handleCommand(client: BotClient, message: Message, prefix: string): Promise<void> {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = commands.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
  );

  if (!command) {
    await message.reply("❌ أمر غير معروف. استخدم `!help` لعرض الأوامر المتاحة");
    return;
  }

  try {
    await command.execute(message, args);

    // تسجيل الأمر في قاعدة البيانات
    const db = await getDb();
    if (db && message.guildId) {
      await db.insert(commandLogs).values({
        serverId: message.guildId,
        userId: message.author.id,
        commandName: command.name,
        arguments: args.join(" "),
        success: 1,
      });
    }
  } catch (error) {
    console.error(`Error executing command ${command.name}:`, error);

    // تسجيل الخطأ في قاعدة البيانات
    const db = await getDb();
    if (db && message.guildId) {
      await db.insert(commandLogs).values({
        serverId: message.guildId,
        userId: message.author.id,
        commandName: command.name,
        arguments: args.join(" "),
        success: 0,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
    }

    await message.reply("❌ حدث خطأ أثناء تنفيذ الأمر");
  }
}

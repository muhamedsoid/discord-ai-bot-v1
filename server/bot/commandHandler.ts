import { Message, ChatInputCommandInteraction, Interaction, REST, Routes } from "discord.js";
import { BotClient } from "./client";
import { pingCommand } from "./commands/ping";
import { helpCommand } from "./commands/help";
import { kickCommand, banCommand, warnCommand, muteCommand, unmuteCommand, clearCommand } from "./commands/moderation";
import { userinfoCommand, serverinfoCommand, avatarCommand } from "./commands/utility";
import { roleCommand } from "./commands/role";
import { getDb } from "../db";
import { commandLogs } from "../../drizzle/schema";

export const commands = [
  pingCommand,
  helpCommand,
  kickCommand,
  banCommand,
  warnCommand,
  muteCommand,
  unmuteCommand,
  clearCommand,
  userinfoCommand,
  serverinfoCommand,
  avatarCommand,
  roleCommand,
];

export async function registerSlashCommands(token: string, clientId: string) {
  const rest = new REST({ version: "10" }).setToken(token);
  const slashCommands = commands
    .filter(cmd => cmd.slashBuilder)
    .map(cmd => cmd.slashBuilder.toJSON());

  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
}

export async function handleInteraction(client: BotClient, interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find(cmd => cmd.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, []);
    
    const db = await getDb();
    if (db && interaction.guildId) {
      await db.insert(commandLogs).values({
        serverId: interaction.guildId,
        userId: interaction.user.id,
        commandName: command.name,
        arguments: interaction.options.data.map(opt => `${opt.name}:${opt.value}`).join(" "),
        success: 1,
      });
    }
  } catch (error) {
    console.error(`Error executing slash command ${command.name}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply("❌ حدث خطأ أثناء تنفيذ الأمر");
    } else {
      await interaction.reply({ content: "❌ حدث خطأ أثناء تنفيذ الأمر", ephemeral: true });
    }
  }
}

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

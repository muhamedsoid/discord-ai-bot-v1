import { Message, Guild, Interaction } from "discord.js";
import { BotClient } from "./client";
import { handleCommand, handleInteraction, registerSlashCommands } from "./commandHandler";
import { getDb } from "../db";
import { discordServers } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export function setupEventHandlers(client: BotClient): void {
  client.on("ready", async () => {
    console.log(`✅ Bot is ready! Logged in as ${client.user?.tag}`);
    
    // Register slash commands
    if (client.user) {
      await registerSlashCommands(process.env.DISCORD_TOKEN!, client.user.id);
    }
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    await handleInteraction(client, interaction);
  });

  client.on("guildCreate", async (guild: Guild) => {
    console.log(`✨ Bot joined guild: ${guild.name} (${guild.id})`);

    const db = await getDb();
    if (db) {
      try {
        await db.insert(discordServers).values({
          serverId: guild.id,
          serverName: guild.name,
          prefix: "!",
          aiEnabled: 1,
        });
      } catch (error) {
        console.error("Error saving guild:", error);
      }
    }
  });

  client.on("guildDelete", async (guild: Guild) => {
    console.log(`😢 Bot left guild: ${guild.name} (${guild.id})`);
  });

  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.guild) return;

    const db = await getDb();
    if (!db) return;

    // الحصول على بيانات السيرفر
    const serverData = await db
      .select()
      .from(discordServers)
      .where(eq(discordServers.serverId, message.guildId!))
      .limit(1);

    const prefix = (serverData[0]?.prefix as string) || "!";

    // معالجة الأوامر
    if (message.content.startsWith(prefix)) {
      await handleCommand(client, message, prefix);
    }
  });

  client.on("error", (error) => {
    console.error("Discord client error:", error);
  });

  client.on("warn", (info) => {
    console.warn("Discord client warning:", info);
  });
}

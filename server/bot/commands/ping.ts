import type { Command } from "../types";
import { Message, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const pingCommand: Command = {
  name: "ping",
  description: "يعرض تأخير البوت",
  aliases: ["p"],
  slashBuilder: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("يعرض تأخير البوت"),
  async execute(interaction) {
    if (interaction instanceof Message) {
      const msg = await interaction.reply("🏓 Pong!");
      const latency = msg.createdTimestamp - interaction.createdTimestamp;
      await msg.edit(`🏓 Pong! Latency: ${latency}ms`);
    } else if (interaction instanceof ChatInputCommandInteraction) {
      const startTime = Date.now();
      await interaction.reply("🏓 Pong!");
      const latency = Date.now() - startTime;
      await interaction.editReply(`🏓 Pong! Latency: ${latency}ms`);
    }
  },
};

import type { Command } from "../types";
import { Message } from "discord.js";

export const pingCommand: Command = {
  name: "ping",
  description: "يعرض تأخير البوت",
  aliases: ["p"],
  async execute(message) {
    if (!(message instanceof Message)) return;
    const msg = await message.reply("🏓 Pong!");
    const latency = msg.createdTimestamp - message.createdTimestamp;
    await msg.edit(`🏓 Pong! Latency: ${latency}ms`);
  },
};

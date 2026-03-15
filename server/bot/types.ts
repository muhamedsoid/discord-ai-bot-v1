import type { Message, CommandInteraction } from "discord.js";

export interface Command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  adminOnly?: boolean;
  execute: (message: Message | CommandInteraction, args: string[]) => Promise<void>;
}

export interface BotConfig {
  token: string;
  clientId: string;
  prefix: string;
  geminiApiKey: string;
}

import type { Message, CommandInteraction, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface Command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  adminOnly?: boolean;
  slashBuilder?: SlashCommandBuilder | any;
  execute: (message: Message | ChatInputCommandInteraction, args: string[]) => Promise<void>;
}

export interface BotConfig {
  token: string;
  clientId: string;
  prefix: string;
  geminiApiKey: string;
}

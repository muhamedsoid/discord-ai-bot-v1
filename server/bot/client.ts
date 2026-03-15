import { Client, GatewayIntentBits, Collection } from "discord.js";
import type { Command } from "./types";

export class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  public registerCommand(command: Command): void {
    this.commands.set(command.name, command);
  }
}

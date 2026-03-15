import { BotClient } from "./client";
import { setupEventHandlers } from "./eventHandler";
import { initializeGemini } from "./services/geminiService";
import type { BotConfig } from "./types";

export async function startBot(config: BotConfig): Promise<BotClient> {
  const client = new BotClient();

  // تهيئة Gemini AI
  try {
    initializeGemini(config.geminiApiKey);
  } catch (error) {
    console.warn("⚠️ Failed to initialize Gemini:", error);
  }

  // إعداد معالجات الأحداث
  setupEventHandlers(client);

  // تسجيل الدخول إلى Discord
  try {
    await client.login(config.token);
    console.log("✅ Bot logged in successfully");
    return client;
  } catch (error) {
    console.error("❌ Failed to login bot:", error);
    throw error;
  }
}

export { BotClient } from "./client";
export type { Command } from "./types";

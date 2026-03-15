import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiClient: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey: string): void {
  geminiClient = new GoogleGenerativeAI(apiKey);
  console.log("✅ Gemini AI initialized");
}

export async function askGemini(question: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
  if (!geminiClient) {
    throw new Error("Gemini AI not initialized. Call initializeGemini first.");
  }

  // Try different model names in case of 404
  const modelsToTry = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🤖 Attempting to use model: ${modelName}`);
      const model = geminiClient.getGenerativeModel({ model: modelName });

      const chat = model.startChat({
        history: conversationHistory.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      });

      const result = await chat.sendMessage(question);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error(`❌ Failed with model ${modelName}:`, error.message);
      lastError = error;
      // If it's not a 404, it might be an API key issue, so we don't need to try other models
      if (!error.message.includes("404") && !error.message.includes("not found")) {
        break;
      }
    }
  }

  throw new Error(`Failed to get response from Gemini after trying multiple models: ${lastError?.message || "Unknown error"}`);
}

export async function summarizeText(text: string): Promise<string> {
  return askGemini(`Please summarize the following text in Arabic:\n\n${text}`);
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  return askGemini(`Translate the following text to ${targetLanguage}:\n\n${text}`);
}

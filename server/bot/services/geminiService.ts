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

  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

    // بناء السياق من السجل
    const messages = [
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user" as const,
        parts: [{ text: question }],
      },
    ];

    const chat = model.startChat({
      history: conversationHistory.length > 0 ? messages.slice(0, -1) : [],
    });

    const result = await chat.sendMessage(question);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function summarizeText(text: string): Promise<string> {
  if (!geminiClient) {
    throw new Error("Gemini AI not initialized");
  }

  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Please summarize the following text in Arabic:\n\n${text}`
    );

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini summarize error:", error);
    throw new Error("Failed to summarize text");
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!geminiClient) {
    throw new Error("Gemini AI not initialized");
  }

  try {
    const model = geminiClient.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Translate the following text to ${targetLanguage}:\n\n${text}`
    );

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini translate error:", error);
    throw new Error("Failed to translate text");
  }
}

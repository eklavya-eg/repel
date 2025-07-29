import { config } from "dotenv";
config()
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY


const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "I have 2 dogs in my house." }],
      },
      {
        role: "user",
        parts: [{ text: "also I have 3 cats in my house." }],
      },
    ],
    config: {
      temperature: 1,
      // maxOutputTokens: 1024,
      thinkingConfig: {
        thinkingBudget: -1
      }
    }
  });

  const response = await chat.sendMessageStream({
    message: "also I have 2 elephants in my house.",
  });
  for await (const chunks of response) {
    console.log(chunks.text)
  }
}


main();
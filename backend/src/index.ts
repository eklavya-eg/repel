import { config } from "dotenv";
config()
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY


const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Write code for todo application in mern.",
    config: {
        temperature: 1,
        // maxOutputTokens: 1000,
        thinkingConfig: {
            thinkingBudget: -1
        }
    }
  });
  console.log(response.text);
}

main();
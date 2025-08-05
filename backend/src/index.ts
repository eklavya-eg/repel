import express, { response } from "express";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
config()

const app = express();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

app.use(express.json())

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      temperature: 1,
      systemInstruction: "Return either react or node based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra.",
      maxOutputTokens: 200,
      thinkingConfig: {
        thinkingBudget: -1
      }
    }
  })
  if (response.text) {
    const ret = response.text.split("\n")[0].split(" ")[0]
    if (ret === 'react') {
      return res.json({
        prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [reactBasePrompt]
      })
    } else if (ret === 'node') {
      return res.json({
        prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [nodeBasePrompt]
      })
    }
  }
  return res.status(403).json({
    message: "error"
  })
})

app.post("/chat", async (req, res) => {
  const prompt = req.body.prompt;
  const messages = req.body.messages;
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: messages,
    config: {
      temperature: 1,
      // maxOutputTokens: 1024,
      thinkingConfig: {
        thinkingBudget: -1
      }
    }
  })
  const response = await chat.sendMessageStream({
    message: "also I have 2 elephants in my house.",
  });
  for await (const chunks of response) {
    console.log(chunks.text)
  }
})

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

app.listen(3000, () => {
  console.log("✅ PORT -> 3000")
})
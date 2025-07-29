"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const genai_1 = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
// async function main() {
//   const response = await ai.models.generateContentStream({
//     model: "gemini-2.5-flash",
//     contents: "Write code for simple todo application in mern.",
//     config: {
//         temperature: 1,
//         // maxOutputTokens: 1024,
//         thinkingConfig: {
//             thinkingBudget: -1
//         }
//     }
//   });
//   for await (const chunk of response){
//     console.log(chunk.text)
//   }
// }
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        });
        const response1 = yield chat.sendMessage({
            message: "also I have 2 elephants in my house.",
        });
        console.log("Chat response 1:", response1.text);
        const response2 = yield chat.sendMessage({
            message: "How many paws are in my house?",
        });
        console.log("Chat response 2:", response2.text);
    });
}
main();

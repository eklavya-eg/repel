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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const genai_1 = require("@google/genai");
const dotenv_1 = require("dotenv");
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new genai_1.GoogleGenAI({ apiKey: GEMINI_API_KEY });
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield ai.models.generateContent({
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
    });
    if (response.text) {
        const ret = response.text.split("\n")[0].split(" ")[0];
        if (ret === 'react') {
            return res.json({
                prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [react_1.basePrompt]
            });
        }
        else if (ret === 'node') {
            return res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [node_1.basePrompt]
            });
        }
    }
    return res.status(403).json({
        message: "error"
    });
}));
// app.post("/chat", async (req, res) => {
//   const prompt = req.body.prompt;
//   const messages = req.body.messages;
//   const chat = ai.chats.create({
//     model: "gemini-2.5-flash",
//     history: messages,
//     config: {
//       temperature: 1,
//       // maxOutputTokens: 1024,
//       thinkingConfig: {
//         thinkingBudget: -1
//       }
//     }
//   })
//   const response = await chat.sendMessageStream({
//     message: prompt,
//   });
//   for await (const chunks of response) {
//     console.log(chunks.text)
//   }
// })
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history: [
                {
                    role: "user",
                    parts: [{ text: prompts_1.BASE_PROMPT }],
                },
                {
                    role: "user",
                    parts: [{ text: react_1.basePrompt }],
                },
            ],
            config: {
                temperature: 1,
                systemInstruction: (0, prompts_1.getSystemPrompt)(),
                // maxOutputTokens: 1024,
                thinkingConfig: {
                    thinkingBudget: -1
                }
            }
        });
        const response = yield chat.sendMessageStream({
            message: "build frontend for real-time chat app",
        });
        try {
            for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _d = true) {
                _c = response_1_1.value;
                _d = false;
                const chunks = _c;
                console.log(chunks.text);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
main();
app.listen(3000, () => {
    console.log("✅ PORT -> 3000");
});

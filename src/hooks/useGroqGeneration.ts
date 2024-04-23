import Groq from "groq-sdk";
import { env } from "../env.js";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function useGroqGeneration(content: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: content }],
    model: "llama3-8b-8192",
  });

  const data = chatCompletion?.choices[0]?.message.content;
  return data;
}

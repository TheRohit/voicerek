import { BufferMemory } from "langchain/memory";
import { UpstashRedisChatMessageHistory } from "@langchain/community/stores/message/upstash_redis";
import { ChatGroq } from "@langchain/groq";
import { ConversationChain } from "langchain/chains";
import { env } from "../env.js";
import { Redis } from "@upstash/redis";

const client = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_SECRET,
});

const memory = new BufferMemory({
  chatHistory: new UpstashRedisChatMessageHistory({
    sessionId: new Date().toISOString(),
    sessionTTL: 600, // 10 minutes, omit this parameter to make sessions never expire
    client,
  }),
});
const model = new ChatGroq({
  apiKey: env.GROQ_API_KEY,
  model: "llama3-8b-8192",
});

const initialPrompt =
  "You are an assistant speaking to the user by phone, " +
  "your answers should be very short and to the point, " +
  "while adding a touch of personality,emotional and humor.";

export async function useGroqGeneration(content: string) {
  const chain = new ConversationChain({ llm: model, memory });
  await memory.chatHistory.addUserMessage(initialPrompt);
  const res = await chain.call({
    input: content,
  });
  return res.response as string;
}

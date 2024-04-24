import { createClient } from "@deepgram/sdk";
import { env } from "../env.js";

export async function useDeepgramVoice(text: string) {
  const deepgram = createClient(env.DEEPGRAM_API_KEY);

  const speechResponse = await deepgram.speak.request(
    { text },
    { model: "aura-luna-en" },
  );

  const stream = await speechResponse.getStream();
  const headers = await speechResponse.getHeaders();
  return { stream, headers };
}

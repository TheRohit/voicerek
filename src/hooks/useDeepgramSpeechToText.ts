import { useEffect, useState } from "react";
import {
  createClient,
  LiveClient,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

interface UseDeepgramTextToSpeechReturn {
  isListening: boolean;
  caption: string | null;
  isLoading: boolean;
  connection: LiveClient | null;
}

export function useDeepgramSpeechToText(): UseDeepgramTextToSpeechReturn {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
    const listenClient: LiveClient = deepgram.listen.live({
      model: "nova",
      interim_results: true,
      smart_format: true,
    });

    listenClient.on(LiveTranscriptionEvents.Open, () => {
      console.log("connection established");
      setIsListening(true);
    });

    listenClient.on(LiveTranscriptionEvents.Close, () => {
      console.log("connection closed");
      setIsListening(false);
      setConnection(null);
    });

    listenClient.on(
      LiveTranscriptionEvents.Transcript,
      (data: LiveTranscriptionEvent) => {
        const words = data?.channel?.alternatives[0]?.words ?? [];
        const newCaption = words
          .map((word) => word.punctuated_word ?? word.word)
          .join(" ");
        if (newCaption !== "") {
          setCaption(newCaption);
        }
      },
    );

    setConnection(listenClient);
    setIsLoading(false);

    return () => {
      listenClient.removeAllListeners();
    };
  }, []);

  return { isListening, caption, isLoading, connection };
}

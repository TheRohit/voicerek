import { useEffect, useState } from "react";
import {
  createClient,
  CreateProjectKeyResponse,
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
  const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();

  useEffect(() => {
    if (!apiKey) {
      console.log("getting a new api key");
      fetch("/api/transcribe", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("No api key returned");

          setApiKey(object as CreateProjectKeyResponse);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey && "key" in apiKey) {
      console.log("connecting to deepgram");
      const deepgram = createClient(apiKey.key ?? "");
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
        setApiKey(null);
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
    }
  }, [apiKey]);

  return { isListening, caption, isLoading, connection };
}

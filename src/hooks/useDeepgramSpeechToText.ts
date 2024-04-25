/* eslint-disable prefer-const */
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
  const [connection, setConnection] = useState<LiveClient | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<CreateProjectKeyResponse | null>();
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    if (!apiKey) {
      console.log("getting a new api key");
      fetch("/api/transcribe", { cache: "no-store" })
        .then((res) => res.json())
        .then((object) => {
          if (!("key" in object)) throw new Error("No api key returned");
          setApiKey(object as CreateProjectKeyResponse);
          setIsLoadingKey(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey && "key" in apiKey && !isLoadingKey) {
      console.log("connecting to deepgram");
      const deepgram = createClient(apiKey?.key ?? "");
      let listenClient: LiveClient;
      let keepAlive;

      listenClient = deepgram.listen.live({
        model: "nova",
        interim_results: true,
        smart_format: true,
      });
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = setInterval(() => {
        console.log("KeepAlive sent.");
        listenClient.keepAlive();
      }, 3000);

      listenClient.on(LiveTranscriptionEvents.Open, () => {
        console.log("connection established");
        setIsListening(true);
      });

      listenClient.on(LiveTranscriptionEvents.Close, () => {
        console.log("connection closed");
        setIsListening(false);
        setApiKey(null);
        setConnection(null);
        clearInterval(keepAlive);
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
  }, [apiKey, isLoadingKey]);
  return { isListening, caption, isLoading, connection };
}

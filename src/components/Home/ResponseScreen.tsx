import { Canvas } from "@react-three/fiber";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDeepgramSpeechToText } from "~/hooks/useDeepgramSpeechToText";
import { playAudio } from "~/utils/utils";
import Blob from "../Blob";
import TextArea from "./TextArea";

interface ResponseScreenProps {
  response: string;
  setResponse: Dispatch<SetStateAction<string>>;
}

const ResponseScreen = ({ response, setResponse }: ResponseScreenProps) => {
  const { isListening, caption, connection, isFinal } =
    useDeepgramSpeechToText();
  const [message, setMessage] = useState<string>("");
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (reqMessage: string) => {
      const { data } = await axios.post("/api/askgroq", {
        message: reqMessage,
      });
      setMessage("");
      return data as string;
    },

    onSuccess: (data) => {
      setResponse(data);
      getAudio(data);
    },
  });

  const { mutate: getAudio } = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/speech", {
        method: "POST",
        body: JSON.stringify({ text: text }),
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.body) {
        throw new Error("Failed to get audio stream");
      }

      return response.body;
    },

    onSuccess: async (data) => {
      await playAudio(data);
    },
  });

  const handleInputReqSend = async () => {
    sendMessage(message);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (caption?.endsWith("?") || isFinal) {
      sendMessage(caption ?? "");
    }
  }, [caption, isFinal, sendMessage]);

  return (
    <div className="flex w-full items-center justify-between rounded-lg  p-5">
      <div className=" h-[70vh] w-1/3">
        <Canvas camera={{ position: [0.0, 0.0, 8.0] }}>
          <Blob isMoving={isPending} key={`${isPending}-yes`} />
        </Canvas>
      </div>
      <div className="flex w-2/3 flex-col items-center justify-center gap-10 p-10 text-center text-5xl">
        {response ??
          "Hi there! Thanks for calling! How can I brighten your day today?"}
        <TextArea
          isListening={isListening}
          connection={connection}
          setMessage={setMessage}
          handleSend={handleInputReqSend}
          message={message}
          isLoading={isPending}
        />

        {caption}
      </div>
    </div>
  );
};

export default ResponseScreen;

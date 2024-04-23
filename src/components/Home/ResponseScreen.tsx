import { Canvas } from "@react-three/fiber";
import Blob from "../Blob";
import TextArea from "./TextArea";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { playAudio } from "~/utils/utils";

interface ResponseScreenProps {
  response: string;
  setResponse: Dispatch<SetStateAction<string>>;
}

const ResponseScreen = ({ response, setResponse }: ResponseScreenProps) => {
  const [message, setMessage] = useState<string>("");
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/askgroq", { message });
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
          setMessage={setMessage}
          handleSend={sendMessage}
          message={message}
          isLoading={isPending}
        />
      </div>
    </div>
  );
};

export default ResponseScreen;

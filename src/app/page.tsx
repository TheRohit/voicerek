"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import TextArea from "~/components/Home/TextArea";
import axios from "axios";
import { playAudio } from "~/utils/utils";

export default function HomePage() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState("");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/askgroq", { message });
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
    <main className="flex h-full flex-col items-center justify-end gap-5 p-10 text-white">
      {response}
      <TextArea
        setMessage={setMessage}
        handleSend={sendMessage}
        message={message}
        isLoading={isPending}
      />
    </main>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import TextArea from "~/components/Home/TextArea";
import axios from "axios";

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
    },
  });

  return (
    <main className="flex h-full flex-col items-center justify-end p-10  text-black">
      <TextArea
        setMessage={setMessage}
        handleSend={sendMessage}
        message={message}
        isLoading={isPending}
      />
    </main>
  );
}

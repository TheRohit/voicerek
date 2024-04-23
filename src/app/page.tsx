"use client";

import { useState } from "react";
import TextArea from "~/components/Home/TextArea";

export default function HomePage() {
  const [message, setMessage] = useState<string>("");
  const handleSend = async () => {
    await fetch("api/askgroq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });
  };
  return (
    <main className="flex h-full flex-col items-center justify-center  text-black">
      <TextArea
        setMessage={setMessage}
        handleSend={handleSend}
        message={message}
      />
    </main>
  );
}

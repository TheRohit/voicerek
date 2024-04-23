"use client";

import { useState } from "react";

import ResponseScreen from "~/components/Home/ResponseScreen";

export default function HomePage() {
  const [response, setResponse] = useState(
    "Hi there! I'd love to help you with anything you need. What's on your mind today?",
  );

  return (
    <main className="flex h-full w-full flex-col items-center justify-between gap-5 p-10 text-black">
      <ResponseScreen setResponse={setResponse} response={response} />
    </main>
  );
}

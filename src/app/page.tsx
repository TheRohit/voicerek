"use client";

import { useState } from "react";

import ResponseScreen from "~/components/Home/ResponseScreen";

export default function HomePage() {
  const [response, setResponse] = useState(
    "Hi there! Thanks for calling! How can I brighten your day today?",
  );

  return (
    <main className="flex h-full w-full flex-col items-center justify-between gap-5 p-10 text-black">
      <ResponseScreen setResponse={setResponse} response={response} />
    </main>
  );
}

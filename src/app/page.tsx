"use client";

import { useState } from "react";

import ResponseScreen from "~/components/Home/ResponseScreen";
import { BorderBeam } from "~/components/border-beam";
import RetroGrid from "~/components/retro-grid";

export default function HomePage() {
  const [response, setResponse] = useState(
    "Hi there! I'd love to help you with anything you need. What's on your mind today?",
  );

  return (
    <main className="flex h-full w-full flex-col items-center justify-between gap-5  p-10 text-black">
      <ResponseScreen setResponse={setResponse} response={response} />
      {/* <BorderBeam size={200} duration={12} delay={9} /> */}
    </main>
  );
}

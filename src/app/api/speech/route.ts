import { NextRequest, NextResponse } from "next/server";
import { useDeepgramSpeech } from "~/hooks/useDeepgramSpeech";

interface RequestData {
  text: string;
}
export async function POST(req: NextRequest) {
  const { text }: RequestData = await req.json();
  const { stream, headers } = await useDeepgramSpeech(text);
  if (headers) {
    console.log("Headers:", headers);
  }
  return new NextResponse(stream, { status: 200 });
}

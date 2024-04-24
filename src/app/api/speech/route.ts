import { NextRequest, NextResponse } from "next/server";
import { useDeepgramVoice } from "~/hooks/useDeepgramVoice";

interface RequestData {
  text: string;
}
export async function POST(req: NextRequest) {
  const { text }: RequestData = await req.json();
  const { stream } = await useDeepgramVoice(text);

  return new NextResponse(stream, { status: 200 });
}

import { NextRequest, NextResponse } from "next/server";
import { useGroqGeneration } from "~/hooks/useGroqGeneration";
interface RequestData {
  message: string;
}
export async function POST(req: NextRequest) {
  const { message }: RequestData = await req.json();
  const data = await useGroqGeneration(message);
  return new NextResponse(data);
}

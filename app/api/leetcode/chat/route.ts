import { NextResponse } from "next/server";
import { generateGuidedReply, type ChatMessage } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = await request.json();
  const { problem, language, messages } = body as {
    problem?: string;
    language?: string;
    messages?: ChatMessage[];
  };

  if (!problem || !problem.trim()) {
    return NextResponse.json({ error: "Enter a problem number or statement." }, { status: 400 });
  }

  try {
    const result = await generateGuidedReply(problem, language || "Python", messages || []);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Guided-mode turn failed:", err);
    return NextResponse.json(
      { error: "Couldn't generate a response, try again." },
      { status: 502 }
    );
  }
}

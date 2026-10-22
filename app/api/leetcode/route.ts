import { NextResponse } from "next/server";
import { generateFullFramework } from "@/lib/gemini";

export async function POST(request: Request) {
  const body = await request.json();
  const { problem, language } = body as { problem?: string; language?: string };

  if (!problem || !problem.trim()) {
    return NextResponse.json({ error: "Enter a problem number or statement." }, { status: 400 });
  }

  try {
    const result = await generateFullFramework(problem, language || "Python");
    return NextResponse.json(result);
  } catch (err) {
    console.error("Full-framework generation failed:", err);
    return NextResponse.json(
      { error: "Couldn't generate a response, try again." },
      { status: 502 }
    );
  }
}

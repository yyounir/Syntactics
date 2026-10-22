import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, mode: true, title: true, problem: true, language: true, updatedAt: true },
  });
  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { mode, problem, language, stage, messages, response, steps } = body as {
    mode: "full" | "guided";
    problem: string;
    language: string;
    stage?: string;
    messages?: unknown;
    response?: unknown;
    steps?: unknown;
  };

  if (!mode || !problem || !language) {
    return NextResponse.json({ error: "Missing mode, problem, or language." }, { status: 400 });
  }

  const title = problem.length > 50 ? `${problem.slice(0, 50)}...` : problem;

  const conversation = await prisma.conversation.create({
    data: {
      mode,
      title,
      problem,
      language,
      stage,
      messages: messages ?? undefined,
      response: response ?? undefined,
      steps: steps ?? undefined,
    },
  });

  return NextResponse.json(conversation);
}

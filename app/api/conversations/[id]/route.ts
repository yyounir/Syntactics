import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await prisma.conversation.findUnique({ where: { id } });

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  return NextResponse.json(conversation);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { title, stage, messages } = body as {
    title?: string;
    stage?: string;
    messages?: unknown;
  };

  const conversation = await prisma.conversation.update({
    where: { id },
    data: {
      title: title ?? undefined,
      stage: stage ?? undefined,
      messages: messages ?? undefined,
    },
  });

  return NextResponse.json(conversation);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.conversation.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

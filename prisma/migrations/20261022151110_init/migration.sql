-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "stage" TEXT,
    "messages" JSONB,
    "response" JSONB,
    "steps" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

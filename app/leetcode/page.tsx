"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LeetCodeForm, type LeetCodeFormValues } from "@/components/LeetCodeForm";
import { FullFrameworkView } from "@/components/FullFrameworkView";
import { GuidedChat, type DisplayMessage } from "@/components/GuidedChat";
import type { FullFrameworkResponse } from "@/lib/gemini";
import type { UmpireStage } from "@/lib/umpire";

interface ConversationRecord {
  id: string;
  mode: "full" | "guided";
  title: string;
  problem: string;
  language: string;
  stage: UmpireStage | null;
  messages: DisplayMessage[] | null;
  response: FullFrameworkResponse | null;
}

function LeetCodePageContent() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FullFrameworkResponse | null>(null);
  const [fullSession, setFullSession] = useState<{ problem: string; language: string } | null>(
    null
  );
  const [guidedSession, setGuidedSession] = useState<{
    key: number;
    problem: string;
    language: string;
  } | null>(null);

  const [loadedConversation, setLoadedConversation] = useState<ConversationRecord | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets loaded state when the ?conversation param changes or clears
    setLoadedConversation(null);
    if (!conversationId) return;

    setLoadingConversation(true);
    fetch(`/api/conversations/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setLoadedConversation(data))
      .finally(() => setLoadingConversation(false));
  }, [conversationId]);

  async function handleSubmit(values: LeetCodeFormValues) {
    setError(null);
    setResult(null);
    setFullSession(null);
    setGuidedSession(null);

    if (values.style === "guided") {
      setGuidedSession({ key: Date.now(), problem: values.problem, language: values.language });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: values.problem, language: values.language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't generate a response, try again.");
        return;
      }
      setResult(data as FullFrameworkResponse);
      setFullSession({ problem: values.problem, language: values.language });
    } catch {
      setError("Couldn't generate a response, try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (conversationId) {
    return (
      <div>
        <h1>{loadedConversation?.title ?? "LeetCode Mode"}</h1>
        {loadingConversation && <p>Loading saved conversation...</p>}
        {!loadingConversation && loadedConversation?.mode === "full" && loadedConversation.response && (
          <div style={{ marginTop: "2rem" }}>
            <FullFrameworkView
              data={loadedConversation.response}
              problem={loadedConversation.problem}
              language={loadedConversation.language}
              conversationId={loadedConversation.id}
            />
          </div>
        )}
        {!loadingConversation && loadedConversation?.mode === "guided" && (
          <div style={{ marginTop: "2rem" }}>
            <GuidedChat
              key={loadedConversation.id}
              problem={loadedConversation.problem}
              language={loadedConversation.language}
              initialMessages={loadedConversation.messages ?? []}
              initialStage={loadedConversation.stage}
              initialConversationId={loadedConversation.id}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>LeetCode Mode</h1>
      <LeetCodeForm onSubmit={handleSubmit} submitting={submitting} />

      {error && <p>{error}</p>}
      {result && fullSession && (
        <div style={{ marginTop: "2rem" }}>
          <FullFrameworkView data={result} problem={fullSession.problem} language={fullSession.language} />
        </div>
      )}
      {guidedSession && (
        <div style={{ marginTop: "2rem" }}>
          <GuidedChat
            key={guidedSession.key}
            problem={guidedSession.problem}
            language={guidedSession.language}
          />
        </div>
      )}
    </div>
  );
}

export default function LeetCodePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeetCodePageContent />
    </Suspense>
  );
}

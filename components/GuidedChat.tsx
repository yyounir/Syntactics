"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/gemini";
import type { VisualizationStep } from "@/lib/visualization";
import type { UmpireStage } from "@/lib/umpire";
import { UMPIRE_STAGE_ORDER, UMPIRE_STAGE_LABELS } from "@/lib/umpire";
import { renderAsSteps } from "./InlineCode";
import { VisualizationStepper } from "./visualization/VisualizationStepper";
import { SaveButton } from "./SaveButton";
import styles from "./GuidedChat.module.css";

export interface DisplayMessage extends ChatMessage {
  steps?: VisualizationStep[];
}

export function GuidedChat({
  problem,
  language,
  initialMessages,
  initialStage,
  initialConversationId,
}: {
  problem: string;
  language: string;
  initialMessages?: DisplayMessage[];
  initialStage?: UmpireStage | null;
  initialConversationId?: string | null;
}) {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessages ?? []);
  const [stage, setStage] = useState<UmpireStage | null>(initialStage ?? null);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ?? null
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const started = useRef((initialMessages?.length ?? 0) > 0);

  async function sendTurn(nextMessages: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/leetcode/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, language, messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't generate a response, try again.");
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "model", content: data.reply, steps: data.steps },
      ]);
      setStage(data.stage);
    } catch {
      setError("Couldn't generate a response, try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    sendTurn([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSend() {
    if (!input.trim() || loading) return;
    const updated: DisplayMessage[] = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    sendTurn(updated);
  }

  return (
    <div className={styles.chat}>
      <div className={styles.stageRow}>
        {UMPIRE_STAGE_ORDER.map((s) => (
          <span key={s} className={`${styles.stagePill} ${stage === s ? styles.stagePillActive : ""}`}>
            {UMPIRE_STAGE_LABELS[s]}
          </span>
        ))}
      </div>

      <div className={styles.thread}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${message.role === "user" ? styles.messageUser : styles.messageModel}`}
          >
            <span className={styles.messageRole}>{message.role === "user" ? "You" : "Tutor"}</span>
            {renderAsSteps(message.content)}
            {message.steps && message.steps.length > 0 && (
              <div className={styles.visualization}>
                <VisualizationStepper steps={message.steps} />
              </div>
            )}
          </div>
        ))}
        {loading && <p>Thinking...</p>}
        {error && <p>{error}</p>}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Share your thinking, ask a question, or ask for a visualization..."
          disabled={loading}
        />
        <button
          type="button"
          className={styles.sendButton}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>

      {messages.length > 0 && (
        <SaveButton
          key={messages.length}
          conversationId={conversationId}
          onSaved={setConversationId}
          buildPayload={() => ({ mode: "guided", problem, language, stage, messages })}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import styles from "./SaveButton.module.css";

type SaveState = "idle" | "saving" | "saved" | "error";

export function SaveButton({
  buildPayload,
  conversationId,
  onSaved,
}: {
  buildPayload: () => object;
  conversationId?: string | null;
  onSaved?: (id: string) => void;
}) {
  const [state, setState] = useState<SaveState>("idle");

  async function handleSave() {
    setState("saving");
    try {
      const res = await fetch(
        conversationId ? `/api/conversations/${conversationId}` : "/api/conversations",
        {
          method: conversationId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        }
      );
      if (!res.ok) throw new Error("save failed");
      const data = await res.json();
      onSaved?.(data.id);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  const label =
    state === "saved"
      ? "Saved"
      : state === "saving"
        ? "Saving..."
        : state === "error"
          ? "Couldn't save, try again"
          : "Save conversation";

  return (
    <div className={styles.saveRow}>
      <button
        type="button"
        className={styles.saveButton}
        onClick={handleSave}
        disabled={state === "saving" || state === "saved"}
      >
        {label}
      </button>
      {state === "saved" && (
        <span className={styles.saveHint}>Refresh the page to see it in the sidebar.</span>
      )}
    </div>
  );
}

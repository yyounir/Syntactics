"use client";

import { useState } from "react";
import { LeetCodeForm, type LeetCodeFormValues } from "@/components/LeetCodeForm";
import { FullFrameworkView } from "@/components/FullFrameworkView";
import type { FullFrameworkResponse } from "@/lib/gemini";

export default function LeetCodePage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FullFrameworkResponse | null>(null);
  const [guidedNotice, setGuidedNotice] = useState(false);

  async function handleSubmit(values: LeetCodeFormValues) {
    setError(null);
    setResult(null);
    setGuidedNotice(false);

    if (values.style === "guided") {
      setGuidedNotice(true);
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
    } catch {
      setError("Couldn't generate a response, try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>LeetCode Mode</h1>
      <LeetCodeForm onSubmit={handleSubmit} submitting={submitting} />

      {guidedNotice && (
        <p>Guided mode arrives in a later build step — pick &ldquo;Full framework&rdquo; for now.</p>
      )}
      {error && <p>{error}</p>}
      {result && (
        <div style={{ marginTop: "2rem" }}>
          <FullFrameworkView data={result} />
        </div>
      )}
    </div>
  );
}

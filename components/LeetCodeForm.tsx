"use client";

import { useState } from "react";
import styles from "./LeetCodeForm.module.css";

export type ResponseStyle = "full" | "guided";

export interface LeetCodeFormValues {
  problem: string;
  language: string;
  style: ResponseStyle;
}

const LANGUAGES = ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go"];

export function LeetCodeForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (values: LeetCodeFormValues) => void;
  submitting: boolean;
}) {
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [style, setStyle] = useState<ResponseStyle>("full");

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ problem, language, style });
      }}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="problem">
          LeetCode problem number or pasted statement
        </label>
        <textarea
          id="problem"
          className={styles.textarea}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="e.g. 1 (Two Sum), or paste the full problem statement"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="language">
          Language
        </label>
        <select
          id="language"
          className={styles.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Response style</span>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggleButton} ${style === "guided" ? styles.toggleButtonActive : ""}`}
            onClick={() => setStyle("guided")}
          >
            Guided
          </button>
          <button
            type="button"
            className={`${styles.toggleButton} ${style === "full" ? styles.toggleButtonActive : ""}`}
            onClick={() => setStyle("full")}
          >
            Full framework
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submit} disabled={submitting || !problem.trim()}>
        {submitting ? "Generating..." : "Submit"}
      </button>
    </form>
  );
}

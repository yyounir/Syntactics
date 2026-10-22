"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import styles from "./Sidebar.module.css";

interface SavedConversation {
  id: string;
  mode: string;
  title: string;
  problem: string;
  language: string;
}

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [saved, setSaved] = useState<SavedConversation[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => setSaved(Array.isArray(data) ? data : []))
      .catch(() => setSaved([]));
  }, []);

  function startRename(conversation: SavedConversation) {
    setRenamingId(conversation.id);
    setRenameValue(conversation.title);
  }

  async function submitRename(id: string) {
    const title = renameValue.trim();
    setRenamingId(null);
    if (!title) return;

    setSaved((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }

  async function handleDelete(id: string) {
    setSaved((prev) => prev.filter((c) => c.id !== id));
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
  }

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <Image
          src="/logo.png"
          alt="Syntactics"
          width={343}
          height={48}
          className={styles.brandLogo}
          priority
        />
      </Link>

      <div className={styles.saved}>
        <div className={styles.savedHeading}>Saved conversations</div>
        {saved.length === 0 ? (
          <div className={styles.savedEmpty}>Saved conversations appear here</div>
        ) : (
          saved.map((conversation) =>
            renamingId === conversation.id ? (
              <input
                key={conversation.id}
                className={styles.renameInput}
                value={renameValue}
                autoFocus
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => submitRename(conversation.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitRename(conversation.id);
                  if (e.key === "Escape") setRenamingId(null);
                }}
              />
            ) : (
              <div key={conversation.id} className={styles.savedItemRow}>
                <Link
                  href={`/leetcode?conversation=${conversation.id}`}
                  className={styles.savedItem}
                >
                  {conversation.title}
                </Link>
                <button
                  type="button"
                  className={styles.renameButton}
                  onClick={() => startRename(conversation)}
                  aria-label="Rename conversation"
                >
                  Rename
                </button>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(conversation.id)}
                  aria-label="Delete conversation"
                >
                  &#10005;
                </button>
              </div>
            )
          )
        )}
      </div>

      <button type="button" className={styles.themeToggle} onClick={toggleTheme}>
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </button>
    </aside>
  );
}

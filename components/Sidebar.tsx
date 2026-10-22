"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme-context";
import styles from "./Sidebar.module.css";

const MODES = [
  { name: "LeetCode Mode", href: "/leetcode", active: true },
  { name: "Syntax Mode", href: null, active: false },
  { name: "Guided Mode", href: null, active: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandBracket}>{"</"}</span>
        <span className={styles.brandAccent}>Syn</span>tactics
        <span className={styles.brandBracket}>{"_>"}</span>
      </Link>

      <nav className={styles.modes}>
        {MODES.map((mode) =>
          mode.active && mode.href ? (
            <Link
              key={mode.name}
              href={mode.href}
              className={`${styles.mode} ${pathname?.startsWith(mode.href) ? styles.modeActive : ""}`}
            >
              {mode.name}
            </Link>
          ) : (
            <span key={mode.name} className={`${styles.mode} ${styles.modeDisabled}`}>
              {mode.name}
            </span>
          )
        )}
      </nav>

      <div className={styles.saved}>
        <div className={styles.savedHeading}>Saved conversations</div>
        <div className={styles.savedEmpty}>Saved conversations appear here</div>
      </div>

      <button type="button" className={styles.themeToggle} onClick={toggleTheme}>
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </button>
    </aside>
  );
}

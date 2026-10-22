import styles from "./InlineCode.module.css";

export function renderWithInlineCode(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={i} className={styles.inlineCode}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

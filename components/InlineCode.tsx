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

function splitSteps(text: string): string[] {
  return text
    .split(/(?=\d+\.\s)/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export function renderAsSteps(text: string): React.ReactNode[] {
  const steps = splitSteps(text);
  if (steps.length <= 1) {
    return [<p key="0">{renderWithInlineCode(text)}</p>];
  }
  return steps.map((step, i) => <p key={i}>{renderWithInlineCode(step)}</p>);
}

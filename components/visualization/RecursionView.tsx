import type { RecursionStepData } from "@/lib/visualization";
import styles from "./visualization.module.css";

export function RecursionView({ data }: { data: RecursionStepData }) {
  const frames = [...data.frames].sort((a, b) => a.depth - b.depth);

  return (
    <div className={styles.stage}>
      <div className={styles.recursionStack}>
        {frames.map((frame) => (
          <div
            key={frame.id}
            className={`${styles.frame} ${frame.active ? styles.frameActive : ""}`}
            style={{ marginLeft: `${frame.depth * 1.5}rem` }}
          >
            {frame.label}
          </div>
        ))}
      </div>
    </div>
  );
}

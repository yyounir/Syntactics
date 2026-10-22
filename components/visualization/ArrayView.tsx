import type { ArrayStepData } from "@/lib/visualization";
import styles from "./visualization.module.css";

export function ArrayView({ data }: { data: ArrayStepData }) {
  const pointersByIndex = new Map<number, string[]>();
  for (const pointer of data.pointers || []) {
    const labels = pointersByIndex.get(pointer.index) || [];
    labels.push(pointer.label);
    pointersByIndex.set(pointer.index, labels);
  }

  return (
    <div className={styles.stage}>
      {data.values.map((value, index) => (
        <div key={index} className={styles.cell}>
          {pointersByIndex.has(index) && (
            <span className={styles.pointerLabel}>{pointersByIndex.get(index)!.join(", ")}</span>
          )}
          <div
            className={`${styles.box} ${data.highlightIndices?.includes(index) ? styles.boxHighlight : ""}`}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}

import type { LinkedListStepData } from "@/lib/visualization";
import styles from "./visualization.module.css";

export function LinkedListView({ data }: { data: LinkedListStepData }) {
  return (
    <div className={styles.stage}>
      {data.nodes.map((node, index) => (
        <div key={node.id} className={styles.cell} style={{ flexDirection: "row" }}>
          <div
            className={`${styles.box} ${data.highlightIds?.includes(node.id) ? styles.boxHighlight : ""}`}
          >
            {node.value}
          </div>
          {index < data.nodes.length - 1 ? (
            <span className={styles.arrow}>&rarr;</span>
          ) : (
            <span className={styles.arrow}>&rarr; null</span>
          )}
        </div>
      ))}
    </div>
  );
}

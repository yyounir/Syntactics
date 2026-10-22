import type { FullFrameworkResponse } from "@/lib/gemini";
import { renderWithInlineCode } from "./InlineCode";
import { VisualizationStepper } from "./visualization/VisualizationStepper";
import styles from "./FullFrameworkView.module.css";

const UMPIRE_STAGES: Array<{ key: keyof FullFrameworkResponse["umpire"]; label: string }> = [
  { key: "understand", label: "Understand" },
  { key: "match", label: "Match" },
  { key: "plan", label: "Plan" },
  { key: "implement", label: "Implement" },
  { key: "review", label: "Review" },
  { key: "evaluate", label: "Evaluate" },
];

export function FullFrameworkView({ data }: { data: FullFrameworkResponse }) {
  return (
    <div className={styles.view}>
      <section className={styles.section}>
        <h2>UMPIRE breakdown</h2>
        {UMPIRE_STAGES.map(({ key, label }) => (
          <div key={key} className={styles.stage}>
            <span className={styles.stageLabel}>{label}</span>
            <p>{renderWithInlineCode(data.umpire[key])}</p>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>Complexity</h2>
        <div className={styles.stage}>
          <span className={styles.stageLabel}>Time: {data.complexity.time}</span>
          <p>{renderWithInlineCode(data.complexity.timeReasoning)}</p>
        </div>
        <div className={styles.stage}>
          <span className={styles.stageLabel}>Space: {data.complexity.space}</span>
          <p>{renderWithInlineCode(data.complexity.spaceReasoning)}</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Concepts</h2>
        <div className={styles.concepts}>
          {data.concepts.map((concept) => (
            <span key={concept} className={styles.concept}>
              {concept}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Code</h2>
        <pre className={styles.code}>
          <code>{data.code}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <h2>Visualization</h2>
        <VisualizationStepper steps={data.steps} />
      </section>
    </div>
  );
}

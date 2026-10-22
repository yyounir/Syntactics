import type { FullFrameworkResponse } from "@/lib/gemini";
import { UMPIRE_STAGE_ORDER, UMPIRE_STAGE_LABELS } from "@/lib/umpire";
import { renderAsSteps, renderWithInlineCode } from "./InlineCode";
import { VisualizationStepper } from "./visualization/VisualizationStepper";
import { SaveButton } from "./SaveButton";
import styles from "./FullFrameworkView.module.css";

export function FullFrameworkView({
  data,
  problem,
  language,
  conversationId,
}: {
  data: FullFrameworkResponse;
  problem: string;
  language: string;
  conversationId?: string | null;
}) {
  return (
    <div className={styles.view}>
      <section className={styles.section}>
        <h2>UMPIRE breakdown</h2>
        {UMPIRE_STAGE_ORDER.map((key) => (
          <div key={key} className={styles.stage}>
            <span className={styles.stageLabel}>{UMPIRE_STAGE_LABELS[key]}</span>
            {renderAsSteps(data.umpire[key])}
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

      <SaveButton
        conversationId={conversationId}
        buildPayload={() => ({ mode: "full", problem, language, response: data })}
      />
    </div>
  );
}

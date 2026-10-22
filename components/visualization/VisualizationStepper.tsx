"use client";

import { useState } from "react";
import type { VisualizationStep } from "@/lib/visualization";
import { renderWithInlineCode } from "@/components/InlineCode";
import { ArrayView } from "./ArrayView";
import { LinkedListView } from "./LinkedListView";
import { TreeView } from "./TreeView";
import { RecursionView } from "./RecursionView";
import styles from "./visualization.module.css";

export function VisualizationStepper({ steps }: { steps: VisualizationStep[] }) {
  const [index, setIndex] = useState(0);

  if (!steps || steps.length === 0) {
    return <p>No visualization steps were generated for this problem.</p>;
  }

  const step = steps[index];

  return (
    <div className={styles.stepper}>
      <p className={styles.description}>{renderWithInlineCode(step.description)}</p>

      {step.type === "array" && step.array && <ArrayView data={step.array} />}
      {step.type === "linkedList" && step.linkedList && <LinkedListView data={step.linkedList} />}
      {step.type === "tree" && step.tree && <TreeView data={step.tree} />}
      {step.type === "recursion" && step.recursion && <RecursionView data={step.recursion} />}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        <span className={styles.stepCounter}>
          Step {index + 1} of {steps.length}
        </span>
        <button
          type="button"
          className={styles.controlButton}
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={index === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

import type { TreeStepData } from "@/lib/visualization";
import styles from "./visualization.module.css";

function TreeNode({
  id,
  nodesById,
  highlightIds,
}: {
  id: string | null;
  nodesById: Map<string, TreeStepData["nodes"][number]>;
  highlightIds: string[];
}) {
  if (!id) return null;
  const node = nodesById.get(id);
  if (!node) return null;

  const hasChildren = node.left || node.right;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <div className={`${styles.box} ${highlightIds?.includes(node.id) ? styles.boxHighlight : ""}`}>
        {node.value}
      </div>
      {hasChildren && (
        <div className={styles.treeRow}>
          <TreeNode id={node.left} nodesById={nodesById} highlightIds={highlightIds} />
          <TreeNode id={node.right} nodesById={nodesById} highlightIds={highlightIds} />
        </div>
      )}
    </div>
  );
}

export function TreeView({ data }: { data: TreeStepData }) {
  const nodesById = new Map(data.nodes.map((n) => [n.id, n]));

  return (
    <div className={styles.stage} style={{ justifyContent: "center" }}>
      <TreeNode id={data.rootId} nodesById={nodesById} highlightIds={data.highlightIds} />
    </div>
  );
}

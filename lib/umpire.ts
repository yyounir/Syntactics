export type UmpireStage = "understand" | "match" | "plan" | "implement" | "review" | "evaluate";

export const UMPIRE_STAGE_ORDER: UmpireStage[] = [
  "understand",
  "match",
  "plan",
  "implement",
  "review",
  "evaluate",
];

export const UMPIRE_STAGE_LABELS: Record<UmpireStage, string> = {
  understand: "Understand",
  match: "Match",
  plan: "Plan",
  implement: "Implement",
  review: "Review",
  evaluate: "Evaluate",
};

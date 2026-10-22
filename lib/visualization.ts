import { Type } from "@google/genai";

export type StepType = "array" | "linkedList" | "tree" | "recursion";

export interface ArrayStepData {
  values: string[];
  highlightIndices: number[];
  pointers: { label: string; index: number }[];
}

export interface LinkedListStepData {
  nodes: { id: string; value: string; next: string | null }[];
  highlightIds: string[];
}

export interface TreeStepData {
  rootId: string;
  nodes: { id: string; value: string; left: string | null; right: string | null }[];
  highlightIds: string[];
}

export interface RecursionStepData {
  frames: { id: string; label: string; depth: number; active: boolean }[];
}

export interface VisualizationStep {
  type: StepType;
  description: string;
  array?: ArrayStepData;
  linkedList?: LinkedListStepData;
  tree?: TreeStepData;
  recursion?: RecursionStepData;
}

export const visualizationStepsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, enum: ["array", "linkedList", "tree", "recursion"] },
      description: { type: Type.STRING },
      array: {
        type: Type.OBJECT,
        properties: {
          values: { type: Type.ARRAY, items: { type: Type.STRING } },
          highlightIndices: { type: Type.ARRAY, items: { type: Type.INTEGER } },
          pointers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                index: { type: Type.INTEGER },
              },
              required: ["label", "index"],
            },
          },
        },
        required: ["values", "highlightIndices", "pointers"],
      },
      linkedList: {
        type: Type.OBJECT,
        properties: {
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                value: { type: Type.STRING },
                next: { type: Type.STRING, nullable: true },
              },
              required: ["id", "value", "next"],
            },
          },
          highlightIds: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["nodes", "highlightIds"],
      },
      tree: {
        type: Type.OBJECT,
        properties: {
          rootId: { type: Type.STRING },
          nodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                value: { type: Type.STRING },
                left: { type: Type.STRING, nullable: true },
                right: { type: Type.STRING, nullable: true },
              },
              required: ["id", "value", "left", "right"],
            },
          },
          highlightIds: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["rootId", "nodes", "highlightIds"],
      },
      recursion: {
        type: Type.OBJECT,
        properties: {
          frames: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                depth: { type: Type.INTEGER },
                active: { type: Type.BOOLEAN },
              },
              required: ["id", "label", "depth", "active"],
            },
          },
        },
        required: ["frames"],
      },
    },
    required: ["type", "description"],
  },
};

export const VISUALIZATION_PROMPT_INSTRUCTIONS = `
- steps: an array of 4 to 10 steps showing, specifically for THIS problem's data, how the relevant data structure changes as the solution runs (e.g. pointers moving across an array, a recursion tree unfolding, a linked list being traversed, a tree being visited). Pick exactly ONE "type" that best fits this problem ("array", "linkedList", "tree", or "recursion") and use it for every step. Only fill in the object matching that type (e.g. if type is "array", only fill the "array" field; leave the others absent). Each step needs a short "description" of what's happening at that moment, in plain language.
  - "array" steps: "values" is the current array contents (as strings); "highlightIndices" are the indices to highlight this step; "pointers" are named pointers (e.g. "left", "right", "i", "j") and the index they point to.
  - "linkedList" steps: "nodes" is the full list of nodes with stable "id"s, their "value", and "next" (the id of the next node, or null); "highlightIds" are the node ids to highlight this step.
  - "tree" steps: "rootId" is the id of the root node; "nodes" is every node in the tree with a stable "id", "value", and "left"/"right" (ids of children, or null); "highlightIds" are the node ids to highlight (e.g. currently visited) this step.
  - "recursion" steps: "frames" is the current call stack, each with a stable "id", a short "label" (e.g. "fib(4)"), its "depth" (0 = outermost call), and "active" (true only for the frame currently executing at this step).`;

import { GoogleGenAI, Type } from "@google/genai";
import {
  VISUALIZATION_PROMPT_INSTRUCTIONS,
  visualizationStepsSchema,
  type VisualizationStep,
} from "./visualization";
import { UMPIRE_STAGE_ORDER, type UmpireStage } from "./umpire";

const MODEL = "gemini-2.5-flash";

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Add it to .env.local.");
  }
  return new GoogleGenAI({ apiKey });
}

export interface FullFrameworkResponse {
  umpire: {
    understand: string;
    match: string;
    plan: string;
    implement: string;
    review: string;
    evaluate: string;
  };
  complexity: {
    time: string;
    timeReasoning: string;
    space: string;
    spaceReasoning: string;
  };
  concepts: string[];
  code: string;
  steps: VisualizationStep[];
}

const fullFrameworkSchema = {
  type: Type.OBJECT,
  properties: {
    umpire: {
      type: Type.OBJECT,
      properties: {
        understand: { type: Type.STRING },
        match: { type: Type.STRING },
        plan: { type: Type.STRING },
        implement: { type: Type.STRING },
        review: { type: Type.STRING },
        evaluate: { type: Type.STRING },
      },
      required: ["understand", "match", "plan", "implement", "review", "evaluate"],
    },
    complexity: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.STRING },
        timeReasoning: { type: Type.STRING },
        space: { type: Type.STRING },
        spaceReasoning: { type: Type.STRING },
      },
      required: ["time", "timeReasoning", "space", "spaceReasoning"],
    },
    concepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    code: { type: Type.STRING },
    steps: visualizationStepsSchema,
  },
  required: ["umpire", "complexity", "concepts", "code", "steps"],
};

export async function generateFullFramework(
  problem: string,
  language: string
): Promise<FullFrameworkResponse> {
  const ai = getClient();

  const prompt = `You are an interview-prep tutor for LeetCode-style coding problems.
A student gave you the following problem (it may be a LeetCode problem number, or a pasted problem statement):

"""
${problem}
"""

They want the solution explained in ${language}, using the UMPIRE framework: Understand, Match, Plan, Implement, Review, Evaluate.

In every prose field below (the umpire.* fields and the complexity reasoning fields), wrap significant technical terms in backticks — variable/function names, data structure and algorithm names, and key identifiers from the problem (e.g. \`nums\`, \`complement\`, \`hash map\`, \`num_map[complement]\`) — so they can be highlighted distinctly from the surrounding prose. Don't wrap ordinary words, only genuine code-level terms.

If this is a well-known LeetCode problem number you recognize, use your knowledge of that exact problem. If the number is unfamiliar or doesn't map to a problem you know, still do your best to infer what kind of problem it likely is and respond with the most relevant general concepts you can, rather than refusing.

Return a JSON object with:
- umpire.understand: restate the problem and constraints in plain language.
- umpire.match: what category of problem this is and what data structures/techniques it matches.
- umpire.plan: the step-by-step approach to solve it.
- umpire.implement: a description of the ${language} implementation approach (not necessarily full code).
- umpire.review: how to check the solution for correctness, including edge cases.
- umpire.evaluate: a summary assessment of the approach's trade-offs.
- complexity.time / complexity.timeReasoning: Big-O time complexity and step-by-step reasoning for it.
- complexity.space / complexity.spaceReasoning: Big-O space complexity and step-by-step reasoning for it.
- concepts: an array of concept/technique/data-structure names required to solve this problem.
- code: a complete, working solution to the problem written in ${language}, so the user can see exactly how the approach translates into code. Use plain text (no markdown code fences), with normal line breaks and indentation.
${VISUALIZATION_PROMPT_INSTRUCTIONS}`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: fullFrameworkSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(text) as FullFrameworkResponse;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface GuidedReply {
  reply: string;
  stage: UmpireStage;
  steps?: VisualizationStep[];
}

const guidedReplySchema = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    stage: { type: Type.STRING, enum: UMPIRE_STAGE_ORDER },
    steps: visualizationStepsSchema,
  },
  required: ["reply", "stage"],
};

export async function generateGuidedReply(
  problem: string,
  language: string,
  messages: ChatMessage[]
): Promise<GuidedReply> {
  const ai = getClient();

  const systemInstruction = `You are a friendly, encouraging interview-prep tutor having an ongoing conversation with a student practicing a coding problem in ${language}, using the UMPIRE framework (Understand, Match, Plan, Implement, Review, Evaluate).

The student gave you this as the problem (it may be a LeetCode problem number, or a pasted problem statement):

"""
${problem}
"""

If this is a well-known LeetCode problem number you recognize, use your knowledge of that exact problem throughout the conversation — don't ask the student to restate it. If the number is unfamiliar or doesn't map to a problem you know, still do your best to infer what kind of problem it likely is and work with the student on the general concepts, rather than refusing or asking them to restate it.

Rules for this conversation:
- Don't just hand over the solution. Ask what the student understands first, respond to their answer, and ask UMPIRE-aligned follow-up questions one stage at a time.
- Offer hints if the student seems stuck (e.g. picking a data structure/algorithm during the Match stage), without immediately giving the full answer.
- Keep asking follow-up questions on the current stage until you judge it's understood. At that point, don't silently advance — explicitly ask the student if they feel ready to move on to the next stage (name it, e.g. "Match"), and only advance "stage" once they confirm. If they're not ready or want to stay, keep asking follow-up questions on the current stage instead.
- If this is the very first turn (no prior conversation), open by asking what the student understands about the problem so far, rather than answering anything yourself.
- Wrap significant technical terms in backticks in "reply" (e.g. \`nums\`, \`hash map\`), same convention as code highlighting.
- "stage" must always reflect which UMPIRE stage the conversation is on right now: understand, match, plan, implement, review, or evaluate.
- If the student's latest message explicitly asks for a visualization, you must include "steps" in this reply — don't defer it to a later turn, even if "reply" also continues the conversation (e.g. a follow-up question). Otherwise, omit "steps" entirely. ${VISUALIZATION_PROMPT_INSTRUCTIONS}`;

  const contents =
    messages.length > 0
      ? messages.map((m) => ({ role: m.role, parts: [{ text: m.content }] }))
      : [{ role: "user" as const, parts: [{ text: "Let's begin." }] }];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: guidedReplySchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(text) as GuidedReply;
}

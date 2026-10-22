import { GoogleGenAI, Type } from "@google/genai";

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
  },
  required: ["umpire", "complexity", "concepts", "code"],
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
- code: a complete, working solution to the problem written in ${language}, so the user can see exactly how the approach translates into code. Use plain text (no markdown code fences), with normal line breaks and indentation.`;

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

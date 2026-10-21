---
doc: scope
status: draft
---

# Syntactics — LeetCode Mode

An AI interview-prep tool that walks a user through any LeetCode problem using the UMPIRE framework, with AI-generated visualizations of how the data structures change as the solution runs.

## The Unique Kernel
It's not just an AI that solves LeetCode problems — it's an AI that teaches you *how to think through* a LeetCode problem using the UMPIRE framework (Understand, Plan, Implement, Review, Evaluate), and generates a visualization of the data structure in motion (e.g. a recursion tree unfolding, pointers moving across an array) for whatever problem you give it. The generality — this works for any problem, not a canned demo of one — is the point.

## Who It's For
CS students who want to become software engineers at top companies but don't know what resources will actually teach them *how* to approach a coding interview problem, not just see an answer. The learner building this is one of them — new to backend/full-stack dev, wants to get better at it through this build.

## The Core Loop
User opens LeetCode Mode, enters a LeetCode problem number (or pastes the problem statement if no number), picks a programming language, and chooses "guided" (AI walks them through UMPIRE one stage at a time, waiting for their attempt before revealing the next) or "full framework" (AI lays out all five UMPIRE stages at once). Either way, the response includes charts/diagrams visualizing how the relevant data structure changes through the solution, plus time/space complexity and the concepts needed to understand the problem. They come back every time they want to practice a new problem before an interview.

## Inspiration & Identity
Developer-friendly, chatbot-style interface — clean and familiar to anyone who's used an AI coding assistant. Not discussed further yet; `3-prd` will fill in look-and-feel specifics.

## Why This Matters to the Learner
The learner is a CS student in the exact position this tool is built for — it comes from their own frustration figuring out how to actually learn to approach coding interview problems, not just copy solutions. Building it is also their vehicle for leveling up on backend development, which they've never done before.

## What "Working" Looks Like
In the demo: the user enters a LeetCode problem number, picks a language, picks guided or full mode, and the AI responds with a UMPIRE-framework breakdown of the problem — including a generated visualization showing the data structure changing step by step (e.g., a recursion tree unfolding for a recursive problem), alongside time/space complexity and the concepts involved. The "oh, that's cool" beat is watching the visualization render for a problem the AI has never seen hardcoded — proving the generation is real, not scripted.

## The POC Boundary
- LeetCode Mode only (Syntax Mode and Guided Mode are not built for this hackathon).
- Input: LeetCode problem number OR pasted problem statement.
- Language selector for the response.
- Toggle between "guided" (step-gated UMPIRE reveal) and "full framework" (all stages at once) response styles.
- AI response includes: UMPIRE breakdown, time/space complexity with reasoning, concepts/topics required, and a generated visualization of the relevant data structure's behavior.
- Visualization must generalize across problem types (recursion, arrays, graphs, etc.) — not limited to one hardcoded category.

## Later
- Syntax Mode (paste code, get complexity/structure/style feedback with diagrams).
- Guided Mode (concept tutor, step-by-step, any language).
- Sidebar navigation between all three modes.

## Explicitly Cut
- Fetching problem statements automatically by number from LeetCode's actual site/API — out of scope for now unless `4-spec` finds this trivial; pasted problem text is the reliable path for the PoC.

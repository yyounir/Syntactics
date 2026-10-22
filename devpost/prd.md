---
doc: prd
status: approved
---

# Syntactics — LeetCode Mode — Product Requirements

An AI interview-prep tool that walks a user through any LeetCode problem using the UMPIRE framework, generating visualizations of how the data structure changes as the solution runs.
Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel`.

## The Core Journey

1. User opens the app and sees a sidebar with three mode entries: **LeetCode Mode** (active), **Syntax Mode** and **Guided Mode** (both grayed out, not built yet), plus a saved-conversations list ("Saved conversations appear here" when empty) and a light/dark toggle.
2. User clicks **LeetCode Mode** and sees a form: enter a LeetCode problem number or paste a problem statement, pick a programming language, and choose **guided** or **full framework**.
3. User submits the form. A loading indicator shows while the AI generates the response.
4. **Full framework:** a long scrollable page renders, in order: UMPIRE breakdown, time/space complexity with reasoning, concepts/topics required, and a generated visualization of the data structure's behavior for that specific problem.
5. **Guided:** a back-and-forth chat opens. The AI asks what the user understands about the problem, responds to their answer, and asks UMPIRE-aligned follow-up questions (offering hints if the user is stuck) until it judges the current stage is understood, then moves to the next UMPIRE stage (Understand → Match → Plan → Implement → Review → Evaluate). The AI generates a visualization only if the user asks for one during the conversation.
6. User can opt in to save the conversation; saved conversations appear in the sidebar list for later viewing.
7. Success looks like: the user enters a problem the AI has never seen hardcoded, and watches a visualization (e.g. a recursion tree unfolding, pointers moving across an array) generate for that specific problem, alongside a correct UMPIRE breakdown and complexity analysis.

## Screens and Layout

- **Sidebar** (persistent): mode list (LeetCode Mode active; Syntax Mode, Guided Mode grayed out), saved-conversations list, light/dark toggle.
- **LeetCode Mode — input form**: problem number/text field, language selector, guided/full-framework toggle, submit action.
- **LeetCode Mode — response view**: either the full-framework scrollable page, or the guided-mode chat thread.

## Look and Feel

- Dark mode by default; user can switch to light mode via the sidebar toggle.
- Fixed-width (monospace) font throughout, including headings, for a developer/IDE-like feel.
- Bold typography for headings.
- Dark mode: black background, white primary text, bright green used as the secondary/accent color (active states, labels, values, borders) — refined from an updated reference image during the build (`devpost/checklist.md > Revisions`).
- Light mode: white background, dark text, green accent, mirroring the dark-mode relationship.
- Sidebar reads as a floating rounded card (inset from the edges, rounded corners) rather than an edge-to-edge panel; interactive elements (mode links, toggle buttons, submit button) are rounded and animate on hover/focus for an immersive, friendly feel.
- Overall identity: clean, developer-friendly, chatbot-style interface familiar to anyone who's used an AI coding assistant (`scope.md > Inspiration & Identity`).

## Features and Behavior

### Input and submission
- User enters a LeetCode problem number OR pastes a problem statement.
- User picks a programming language for the response.
- User picks **guided** or **full framework** response style.
- While the AI generates a response, a loading indicator is shown.

### Full framework response
- As a user who wants the whole picture at once, I want all UMPIRE stages, complexity, concepts, a visualization, and the actual solution code on one page so that I can review a problem quickly.
  - [ ] Response page shows UMPIRE stages in order (Understand, Match, Plan, Implement, Review, Evaluate).
  - [ ] Response includes time and space complexity with line-by-line or step-by-step reasoning.
  - [ ] Response lists the concepts/techniques/data structures required.
  - [ ] Response includes a generated visualization specific to the submitted problem (not a hardcoded example) showing the relevant data structure's behavior (e.g. recursion tree unfolding, pointer movement).
  - [ ] Response includes the actual solution code in the chosen language, shown alongside the UMPIRE breakdown so the user can see how the approach translates into code (added during the build at the learner's request — `devpost/checklist.md > Revisions`).

### Guided response
- As a user practicing for an interview, I want the AI to question me through each UMPIRE stage so that I build the habit of reasoning before being shown the answer.
  - [ ] AI opens by asking what the user understands about the problem.
  - [ ] AI responds to the user's answer and asks UMPIRE-aligned follow-up questions.
  - [ ] AI offers hints if the user appears stuck (e.g. in the Match stage, when picking a data structure/algorithm).
  - [ ] AI advances to the next UMPIRE stage once it judges the current stage is understood.
  - [ ] A visualization is generated only when the user asks for one during the conversation.

### Saved conversations
- As a user who wants to revisit past practice, I want to opt in to saving a conversation so that I can find it again later.
  - [ ] Saving is an opt-in action, not automatic for every session.
  - [ ] Once a conversation is saved, it appears in the sidebar's saved-conversations list.
  - [ ] Each saved conversation has a title the user can rename, so they can find a specific one later (added during the build at the learner's request — `devpost/checklist.md > Revisions`).
  - [ ] Each saved conversation can be deleted from the sidebar (added during the build at the learner's request — `devpost/checklist.md > Revisions`).
  - [ ] Storage mechanism (database vs. local storage, etc.) is a `4-spec` decision, not specified here.

### Appearance
- User can toggle light/dark mode from the sidebar at any time.

## States and Boundaries

- **First use (sidebar)** — saved-conversations list shows "Saved conversations appear here" when nothing has been saved yet.
- **Invalid/unrecognized problem number** — AI still responds with concepts relevant to what was entered, at minimum, rather than a hard failure.
- **Non-coding input** — if the pasted text isn't a coding problem, the user sees an error message prompting them to enter a valid coding problem.
- **Loading** — a loading indicator displays while the AI generates a response.
- **Persistence** — only explicitly-saved conversations persist between sessions; everything else is not retained unless the user opts in.

## Product Decisions

- Sidebar shows all three modes now, with Syntax Mode and Guided Mode grayed out, rather than hidden — sets up `scope.md > Later` without implying they work yet.
- Appearance settings cut down to light/dark mode only; font, tab width, font color, font boldness, and accent color customization deferred to **Later** — six separate controls was too much surface area for this PoC and didn't serve the unique kernel (UMPIRE + visualization).
- Saved conversations moved into the "now" bucket at the learner's request, specifically as a backend/database learning opportunity, despite adding real scope — the learner is new to backend/databases and wants the rep.
- Storage mechanism for saved conversations deliberately left open for `4-spec` — this doc defines the behavior (opt-in save, sidebar list) only.
- Visual direction (fixed-width font, bold headings, black/green dark mode, white/dark-green light mode) taken directly from a reference image the learner provided.

## What We're Building

- Sidebar with LeetCode Mode (active), Syntax Mode and Guided Mode (grayed out), saved-conversations list, and light/dark toggle.
- LeetCode Mode input form: problem number or pasted statement, language selector, guided/full-framework toggle.
- Loading indicator during generation.
- Full-framework response: UMPIRE breakdown, time/space complexity with reasoning, concepts/techniques required, the actual solution code in the chosen language, and a generated visualization specific to the submitted problem.
- Guided-mode conversational flow through all six UMPIRE stages, with follow-up questions, hints, and on-request visualization.
- Opt-in conversation saving, surfaced in the sidebar list.
- Light/dark mode toggle, styled per **Look and Feel**.
- Handling for invalid problem numbers (concepts-only fallback) and non-coding input (error message).

## Deferred From the POC

- Syntax Mode and Guided (concept-tutor) Mode — not built, shown grayed out in the sidebar (`scope.md > Later`).
- Appearance customization beyond light/dark: code font choice, tab width (2 vs 4 spaces), font color, font boldness, accent color.
- Automatically fetching problem statements from LeetCode by number — pasted text remains the reliable input path (`scope.md > Explicitly Cut`).

## Possible Later Enhancements

- Full appearance customization panel (font, tab width, font/accent color, boldness).
- Fetching problem statements automatically from LeetCode.
- Sidebar navigation fully wired across all three modes once Syntax and Guided Mode are built.

## Non-Goals

- This PoC will not fetch LeetCode problems automatically by number — pasting the statement is the supported path (`scope.md > Explicitly Cut`).
- This PoC will not build Syntax Mode or Guided (concept-tutor) Mode.
- This PoC will not build a full appearance/settings system beyond light/dark mode.

## Open Questions

- Exact storage mechanism for saved conversations (local storage vs. a real database) — intentionally deferred to `4-spec`, must be resolved there before build.

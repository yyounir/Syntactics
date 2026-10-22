---
doc: spec
status: approved
---

# Syntactics — LeetCode Mode — Technical Spec

## How This Works, In Plain Language

The whole app is one Next.js project, written in TypeScript — there's no separate frontend and backend to wire together; the same project serves the pages you see and runs the server-side code that talks to Gemini and the database.

When you submit a problem, the page sends it to a backend route inside that same project (an "API route"). That route sends one request to Google's Gemini API asking for a specific shape of answer: the UMPIRE breakdown, the complexity reasoning, the concepts involved, and — this is the unique part — a list of "steps" describing how the relevant data structure changes over the course of the solution (e.g., step 1: array is `[4,2,7]`, we're comparing indices 0 and 1; step 2: ...). Gemini doesn't draw a picture; it fills in that list. Your own React components (one for arrays, one for linked lists, one for trees, one for recursion stacks) draw boxes on screen for whichever step is active, and a Previous/Next control lets the user step through them — that's how the visualization "moves" for any problem, without needing image generation.

Guided mode works the same way, but as an ongoing conversation: each message you send, plus the whole conversation so far, gets sent to Gemini, which replies with its next question or hint. A visualization is only generated if you ask for one mid-chat.

If you hit Save, the conversation (problem, language, mode, the full chat or full-framework response, and the visualization steps) gets written to a real database — Neon, a hosted Postgres database — through Prisma, a tool that lets you read and write that database using TypeScript instead of raw SQL. The sidebar's saved-conversations list is just a query against that database. Reopening a saved guided conversation loads its full message history back in, so you can keep chatting from where you left off.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. User opens the app → Next.js renders the sidebar (modes, saved-conversations list populated from the database, light/dark toggle) and the LeetCode Mode form.
2. User fills the form (problem number or pasted text, language, guided/full-framework) and submits → `POST /api/leetcode` (full framework) or `POST /api/leetcode/chat` (guided) is called. Loading indicator shows while this is in flight.
3. **Full framework:** the API route sends one structured prompt to Gemini and gets back JSON: UMPIRE stages, complexity + reasoning, concepts, and an array of visualization steps. The page renders the UMPIRE breakdown, complexity, and concepts as formatted text/sections, and renders the visualization steps through a step-through component (Previous/Next buttons flip between steps; the component picks array/linked-list/tree/recursion rendering based on a `type` field Gemini fills in per step).
4. **Guided:** the frontend keeps the running chat (array of messages) in React state. Each new user message + the full history so far is sent to `/api/leetcode/chat`; Gemini's reply includes its next question/hint and an internal marker for which UMPIRE stage it judges the conversation to be on, which the frontend uses to show stage progress. If the user asks for a visualization mid-chat, that turn's reply includes the same `steps` array, rendered with the same step-through component.
5. User clicks **Save** → `POST /api/conversations` writes the conversation (mode, problem, language, full message history or full-framework response, visualization steps, current UMPIRE stage) to Postgres via Prisma.
6. Sidebar's saved-conversations list is fetched from `GET /api/conversations` on load. Clicking a saved conversation in guided mode loads its full message history back into the chat UI and the user can continue sending messages — Gemini receives the restored history the same way it would mid-session. A saved full-framework conversation reopens as the same read-only rendered page (there's nothing to "continue" in that mode).

## Stack

- **Next.js 14+ (App Router), TypeScript** — one project serves both pages and API routes, so there's no separate frontend/backend service to stand up or deploy. Docs: https://nextjs.org/docs
- **Google Gemini API** (`@google/generative-ai` SDK) — chosen for its free tier, avoiding a paid API for the PoC. Docs: https://ai.google.dev/gemini-api/docs
- **Prisma** — TypeScript-first ORM; write the data shape once, get type-checked queries, gentler than hand-written SQL for a first database. Docs: https://www.prisma.io/docs
- **Neon (Postgres)** — free, serverless-friendly hosted Postgres that integrates with Vercel; needed because Vercel's servers don't keep local files between requests, so a local SQLite/JSON file wouldn't actually persist saved conversations once deployed. Docs: https://neon.tech/docs/introduction
- **Vercel** — deployment target; one-click deploy from a GitHub repo, pairs natively with Next.js and Neon. Docs: https://vercel.com/docs

**To verify early in the build:** exact current Gemini TypeScript SDK package name/version and its structured-output (JSON mode) syntax — Google's SDKs and JSON-mode support have changed across versions, so confirm the current approach against the docs link above before wiring the API route, rather than assuming today's syntax.

## Where It Runs and How Someone Tries It

- Runtime: browser (Next.js pages) + Node.js server (API routes), both from the same `next dev` process locally.
- Requirements: Node.js (LTS), a Gemini API key (`GEMINI_API_KEY` env var, from https://ai.google.dev), a Neon database connection string (`DATABASE_URL` env var, from a free Neon project).
- **Local run:** `npm install`, set `.env.local` with `GEMINI_API_KEY` and `DATABASE_URL`, `npx prisma migrate dev` to set up the database tables, then `npm run dev` and open `http://localhost:3000`. This is sufficient for the required demo recording.
- **Deployment:** Vercel, connected to the GitHub repo. Add `GEMINI_API_KEY` and `DATABASE_URL` as Vercel environment variables (Neon integrates directly with Vercel for one-click provisioning). Deployment is optional — the demo video and public repo are what's required — but since the learner opted in, this gives a live link others can try directly.

## Look and Feel

Carried forward from `prd.md > Look and Feel` and the project's README font notes — no new design discovery needed.

- Dark mode by default (black background, white primary text, bright green as the secondary/accent color for labels, values, active states, and borders); light mode available via sidebar toggle (white background, dark primary text, green accent).
- **Roboto** is the default UI typeface (body text, headings, labels, buttons) across the app, except the Syntactics logo in the sidebar, which keeps **Source Code Pro** for its distinct wordmark treatment. Generated/shown code (the full-framework solution code, and any code-like content) renders in **Source Code Pro, Black (900) weight**, to visually separate "code" from "prose" — refined from the originally-approved single-monospace-typeface direction at the learner's request during the build (`devpost/checklist.md > Revisions`).
- Bold typography for headings.
- Sidebar is a floating rounded card inset from the viewport edges; mode links, toggle buttons, and the submit button are rounded rectangles with hover/focus animation (subtle lift + glow) rather than flat clickable text — refined from a reference image the learner provided during the build (`devpost/checklist.md > Revisions`).
- A subtle animated background (soft glow, low-opacity) runs behind the app shell for an immersive feel, kept dim enough not to compete with foreground text.
- Tone: clean, developer-friendly, chatbot-style — like a familiar AI coding assistant interface (`scope.md > Inspiration & Identity`).

## Components

### Sidebar
Mode list (LeetCode Mode active, Syntax/Guided grayed out), saved-conversations list (queried from the database), light/dark toggle.
PRD ref: `prd.md > Screens and Layout`, `prd.md > Saved conversations`.

### LeetCodeForm
Problem number/text input, language selector, guided/full-framework toggle, submit button, loading indicator.
PRD ref: `prd.md > Input and submission`.

### FullFrameworkView
Renders UMPIRE breakdown, complexity + reasoning, concepts, the solution code (in the chosen language), and the `VisualizationStepper`, from one Gemini response.
PRD ref: `prd.md > Full framework response`.

### GuidedChat
Chat thread UI; sends/receives messages against `/api/leetcode/chat`; shows current UMPIRE stage; triggers `VisualizationStepper` only when the user asks for one; has the Save button.
PRD ref: `prd.md > Guided response`, `prd.md > Saved conversations`.

### VisualizationStepper
Takes the `steps` array from a Gemini response; Previous/Next controls; picks a sub-renderer (`ArrayView`, `LinkedListView`, `TreeView`, `RecursionView`) per step based on a `type` field.
PRD ref: `scope.md > The Unique Kernel`, `prd.md > Full framework response`.

### API routes
- `POST /api/leetcode` — full-framework generation (calls Gemini once, returns structured JSON).
- `POST /api/leetcode/chat` — guided-mode turn (calls Gemini with full message history, returns next reply + stage + optional steps).
- `POST /api/conversations` — save a conversation.
- `GET /api/conversations` — list saved conversations for the sidebar.
- `GET /api/conversations/:id` — load one saved conversation's full record (for reopening/resuming).
- `PATCH /api/conversations/:id` — update a saved conversation's `title`, or its `messages`/`stage` when a resumed guided session is saved again.
- `DELETE /api/conversations/:id` — delete a saved conversation.

## Data Model

One table, via Prisma:

```prisma
model Conversation {
  id          String   @id @default(cuid())
  mode        String   // "full" | "guided"
  title       String   // editable label, defaults to a truncation of `problem` on save
  problem     String   // problem number or pasted text
  language    String
  stage       String?  // current UMPIRE stage, guided mode only
  messages    Json?    // full chat history, guided mode only
  response    Json?    // UMPIRE/complexity/concepts/steps, full mode only
  steps       Json?    // visualization steps, either mode
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

`title` added during the build at the learner's request (`devpost/checklist.md > Revisions`) — editable via the sidebar, defaults to a truncation of `problem` so a conversation is never untitled.

- **Where it lives:** Neon Postgres, accessed via Prisma from the API routes only (never directly from the browser).
- **How it's updated:** a new row is created on first Save; reopening a guided conversation and continuing the chat updates `messages`, `stage`, and `updatedAt` on that same row via a follow-up Save (or auto-update on each new message, learner's call during build — default to updating on Save to keep behavior predictable).
- **On leave and return:** unsaved conversations are lost on refresh/navigation (in-memory React state only), matching `prd.md > States and Boundaries > Persistence`. Saved conversations persist in Neon indefinitely and reload fully, including resuming guided chats.

## File Structure

```
syntactics/
├── app/
│   ├── page.tsx                  # Home: sidebar + mode selector
│   ├── leetcode/
│   │   └── page.tsx               # LeetCode Mode: form + response views
│   └── api/
│       ├── leetcode/
│       │   ├── route.ts           # POST: full-framework generation
│       │   └── chat/route.ts      # POST: guided-mode turn
│       └── conversations/
│           ├── route.ts           # GET (list), POST (save)
│           └── [id]/route.ts      # GET (load one, for resume)
├── components/
│   ├── Sidebar.tsx
│   ├── LeetCodeForm.tsx
│   ├── FullFrameworkView.tsx
│   ├── GuidedChat.tsx
│   └── visualization/
│       ├── VisualizationStepper.tsx
│       ├── ArrayView.tsx
│       ├── LinkedListView.tsx
│       ├── TreeView.tsx
│       └── RecursionView.tsx
├── lib/
│   ├── gemini.ts                  # Gemini client + prompt construction
│   └── prisma.ts                  # Prisma client singleton
├── prisma/
│   └── schema.prisma
├── devpost/                       # Devpost learning workspace
├── .env.local                     # GEMINI_API_KEY, DATABASE_URL (gitignored)
├── package.json
└── README.md
```

## External Services and Dependencies

### Gemini API
- Endpoint: via `@google/generative-ai` SDK (not a raw HTTP call) — https://ai.google.dev/gemini-api/docs
- Auth: API key from https://aistudio.google.com/apikey, stored as `GEMINI_API_KEY` env var, used server-side only (never sent to the browser).
- Payload: a prompt instructing Gemini to return a specific JSON shape (UMPIRE text, complexity text, concepts list, `steps` array with a `type` + structure-specific fields per step) for full-framework calls; for guided-mode calls, the running message history plus a system instruction describing the UMPIRE-tutor behavior.
- Response: JSON matching the requested shape (use the SDK's JSON-mode/structured-output feature; verify exact syntax against current docs before building).
- Rate limits/cost: free tier as of this writing; exact current limits should be checked on the pricing page at build time, since free-tier terms change.

### Neon (Postgres)
- Connection via `DATABASE_URL` env var (connection string from the Neon dashboard or Vercel's Neon integration).
- Auth: the connection string itself carries the credential — no end-user login involved.
- Accessed only through Prisma from API routes.
- Cost: free tier sufficient for PoC volume; verify current free-tier storage/compute limits at https://neon.tech/docs/introduction before relying on them past the PoC.

### Vercel (deployment)
- Connects directly to the GitHub repo; auto-deploys on push.
- Env vars (`GEMINI_API_KEY`, `DATABASE_URL`) set in the Vercel project settings.

## Important Failure Modes

- **Non-coding input** → Gemini is asked to classify the input first (or the route catches an empty/malformed response) and the UI shows an error message prompting the user to enter a valid coding problem (`prd.md > States and Boundaries`).
- **Unrecognized/invalid problem number** → prompt instructs Gemini to respond with at least the general concepts it can infer, rather than failing outright (`prd.md > States and Boundaries`).
- **Gemini response doesn't match the expected JSON shape** (slow, malformed, or rate-limited) → API route catches the parse failure and the UI shows a plain "couldn't generate a response, try again" message rather than crashing mid-render.

## What Was Simplified and Why

- **Visualization as stepped JSON + fixed React components** instead of AI-generated images or freeform diagrams — Gemini is reliable at filling in a known data shape but not at drawing visuals; a handful of hand-built renderers (array/list/tree/recursion) cover the generality the kernel needs without image generation. The fuller version (true generative visuals) would need an image/diagram-generation model and far less predictable output.
- **One Next.js project instead of a separate frontend + backend service** — removes an entire layer of wiring (CORS, two deploys, two local processes) while still giving the learner real backend code to write (the API routes). The fuller version (standalone Express API + separate frontend) would make the frontend/backend boundary more explicit but cost real setup time without serving the kernel.
- **Guided-mode stage tracking via a single `stage` field inferred by Gemini per turn**, not a separate state machine — keeps the "AI judges progress" behavior PRD asks for without building custom logic to detect stage completion.

## Decisions and Open Issues

- **Stack:** Next.js + TypeScript, chosen so the learner gets real backend practice (API routes) without standing up a second service. Tradeoff accepted: less explicit "frontend calls a separate backend" separation than a two-service setup.
- **AI provider:** Gemini API, learner's existing choice, confirmed workable on its free tier (avoids the cost concern that drove the original choice).
- **Database:** Neon Postgres + Prisma, needed because Vercel's filesystem doesn't persist between requests — a local file wouldn't survive deployment. Learner wanted database reps regardless, so this serves both the technical requirement and the learning goal.
- **Database auth clarification:** the Neon connection requires a credential (connection string), but this is server-to-database, not user-facing login — the app itself has no accounts or sign-in.
- **Saved conversations are resumable, not just read-only** — learner's choice; guided-mode saves include full message history and current stage so Gemini can pick the conversation back up with full context.
- **Save remains a per-conversation button**, not a global settings toggle — learner considered a settings-level toggle but decided the existing opt-in Save action (per `prd.md > Saved conversations`) already covers the need.
- **One genuine uncertainty, clarified during this conversation:** the learner wasn't sure how an AI could generate a visualization that works for *any* data structure without image generation. This was resolved by separating "what to show" (Gemini fills a structured steps list) from "how to draw it" (a small fixed set of hand-built React components per data-structure type) — the learner's own instinct (table/box layout over images) was the right direction, and this spec gives it a concrete data shape (`steps` array with a `type` field) to build against.
- **Carried over from `prd.md > Open Questions`:** none remain — the storage mechanism question is resolved above (Neon + Prisma).
- **To verify early in the build:** current Gemini SDK package/version and its structured-output syntax (see `Stack` above) — reason from current knowledge during build, but confirm against live docs before the API routes are finalized.
</content>

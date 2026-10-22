---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. You can submit a problem and get back a real UMPIRE breakdown**
  Becomes usable: A running app with the sidebar shell (modes list, placeholder saved-conversations list, light/dark toggle) and the LeetCode Mode form. Submitting a problem number or pasted statement, with full-framework selected, calls Gemini and renders the UMPIRE breakdown, complexity reasoning, and concepts as text. No visualization yet.
  Why now: Proves the single biggest risk first — that Gemini's structured JSON output actually works through this SDK — and gives a real, usable path end to end on slice one, per `spec.md > Stack` ("To verify early in the build"). Bootstrapping (scaffold, dependencies, env vars) lives inside this slice rather than as its own step.
  PRD ref: `prd.md > The Core Journey` (steps 1-4, text portions), `prd.md > Look and Feel`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components` (Sidebar, LeetCodeForm, FullFrameworkView), `spec.md > External Services and Dependencies > Gemini API`
  Build: Scaffold the Next.js + TypeScript project per the file structure; add `.env.local` (gitignored) for `GEMINI_API_KEY`; build the Sidebar (mode list, static placeholder saved-list text, light/dark toggle) and LeetCodeForm; build `POST /api/leetcode` calling Gemini for UMPIRE + complexity + concepts (no `steps` yet); render the response as formatted text in FullFrameworkView; apply dark/light styling (Source Code Pro, bold headings, black/green and white/dark-green themes).
  Verify (mechanical): Run `npm run dev`, confirm it starts with no errors; submit a real problem (e.g. "Two Sum") with full-framework selected and confirm a UMPIRE breakdown, complexity reasoning, and concepts list render from a live Gemini response.
  Learner check: Open the app, submit a LeetCode problem you know, and say whether the breakdown looks right and whether the dark/light toggle and layout feel like what you pictured.
  Commit: `Scaffold app shell and wire full-framework Gemini response`

- [x] **2. The visualization steps render and you can step through them**
  Becomes usable: The full-framework response now also includes a generated, steppable visualization of the relevant data structure's behavior for that specific problem.
  Why now: This is the unique kernel (`scope.md > The Unique Kernel`) — it has to prove out early, not arrive after everything else is built around it.
  PRD ref: `prd.md > Full framework response`
  Spec ref: `spec.md > Components` (VisualizationStepper, ArrayView, LinkedListView, TreeView, RecursionView), `spec.md > How This Works, In Plain Language`
  Build: Extend the Gemini prompt/response shape to include a `steps` array with a `type` field; build VisualizationStepper with Previous/Next controls and the four sub-renderers; wire it into FullFrameworkView.
  Verify (mechanical): Submit an array problem (e.g. "Two Sum") and a recursive/tree problem (e.g. "Binary Tree Inorder Traversal"), confirm each returns a `steps` array matching its structure type, and confirm Previous/Next moves through the steps correctly for both.
  Learner check: Submit a problem and step through the visualization with Previous/Next — does it actually show the data structure changing the way you'd expect for that problem?
  Commit: `Add generated visualization stepper to full-framework response`

- [x] **3. Guided mode runs as a back-and-forth UMPIRE conversation**
  Becomes usable: Choosing "guided" opens a chat where the AI asks what you understand, responds, asks UMPIRE-aligned follow-ups, offers hints, advances stages, and generates a visualization only on request.
  Why now: Completes the second core response style in the Core Journey before adding persistence on top of either.
  PRD ref: `prd.md > Guided response`
  Spec ref: `spec.md > Components` (GuidedChat), `spec.md > External Services and Dependencies > Gemini API`
  Build: Build `POST /api/leetcode/chat` sending full message history + a system instruction describing UMPIRE-tutor behavior, returning the next reply, inferred stage, and optional `steps`; build GuidedChat (message thread, stage indicator, input box); reuse VisualizationStepper when `steps` is present in a reply.
  Verify (mechanical): Start a guided conversation on a real problem, answer a couple of turns, confirm the AI asks follow-ups and the shown stage advances; ask for a visualization mid-chat and confirm it renders.
  Learner check: Work through a problem in guided mode as if practicing for an interview — does the questioning feel like it's actually walking you through UMPIRE, with hints when you're stuck?
  Commit: `Add guided-mode UMPIRE chat`

- [x] **4. You can save a conversation and see it in the sidebar**
  Becomes usable: Hitting Save writes the current conversation to a real database, and it appears in the sidebar's saved-conversations list.
  Why now: Introduces the database layer behind one concrete, already-working behavior (save a finished conversation) before resuming is layered on top — the learner's chosen backend/database learning rep (`prd.md > Product Decisions`).
  PRD ref: `prd.md > Saved conversations`
  Spec ref: `spec.md > Data Model`, `spec.md > Components > API routes` (`POST /api/conversations`, `GET /api/conversations`)
  Build: Add `prisma/schema.prisma` with the `Conversation` model; provision Neon and set `DATABASE_URL`; run `npx prisma migrate dev`; build `lib/prisma.ts`; build `POST /api/conversations` (create) and `GET /api/conversations` (list); add the Save button to both response views; wire the sidebar's saved-list to the real query, replacing the placeholder text.
  Verify (mechanical): Save a full-framework conversation and a guided conversation, confirm both rows exist via `npx prisma studio` or a direct query, and confirm both appear in the sidebar list after a page reload.
  Learner check: Save a conversation, refresh the page, and confirm it's still listed in the sidebar.
  Commit: `Persist saved conversations to Neon via Prisma`

- [x] **5. Reopening a saved conversation resumes it, and you can rename or delete it**
  Becomes usable: Clicking a saved guided conversation in the sidebar loads its full message history back into the chat, and you can keep sending messages from where you left off. Reopening a saved full-framework conversation shows the same rendered read-only page. Each saved conversation also has an editable title and can be deleted, so it's easier to manage over time.
  Why now: Closes out the Core Journey's last step; needs slice 4's storage in place first. Editable titles folded in here at the learner's request (raised during slice 4's check); delete added the same way during this slice's check, since both are "do more with a saved conversation in the sidebar."
  PRD ref: `prd.md > Saved conversations`, `prd.md > The Core Journey` (step 6)
  Spec ref: `spec.md > Components > API routes` (`GET /api/conversations/:id`), `spec.md > Data Model` ("On leave and return")
  Build: Add a `title` column to the `Conversation` model (migration) and default it to a short truncation of the problem text on save; build `GET /api/conversations/:id`, `PATCH /api/conversations/:id` (updates `title`, and `messages`/`stage`/`updatedAt` for a resumed guided save), and `DELETE /api/conversations/:id`; on sidebar click, load the record and either re-render FullFrameworkView (full mode) or restore GuidedChat's message history and stage and continue sending to `/api/leetcode/chat` (guided mode); add rename and delete affordances to each sidebar entry; the reopened page shows the saved title instead of the generic heading.
  Verify (mechanical): Save a guided conversation, reload the app, click it in the sidebar, confirm the full history loads, send one more message, confirm the AI replies with context from the restored history, then save again and confirm it updates the same row rather than creating a new one; rename a saved conversation and confirm the new title persists after a reload; delete a saved conversation via curl and confirm it disappears from `GET /api/conversations`.
  Learner check: Reopen a saved guided conversation and send another message — does it pick up where you left off? Rename a saved conversation and confirm the new name sticks around. Delete a saved conversation and confirm it's gone.
  Commit: `Resume, rename, and delete saved conversations from the sidebar`

- [x] **6. Invalid problem numbers and non-coding input are handled gracefully**
  Becomes usable: An unrecognized problem number still returns a useful concepts-only response instead of failing; pasted text that isn't a coding problem shows a clear error message instead of a broken or nonsensical response.
  Why now: These are the two explicit failure-mode behaviors in the PRD/spec; testing them now, against a fully working app, is the cheapest point to confirm the prompt and route actually behave this way.
  PRD ref: `prd.md > States and Boundaries`
  Spec ref: `spec.md > Important Failure Modes`
  Build: Adjust the Gemini prompt(s) to classify non-coding input and to respond with at-minimum-concepts for unrecognized problem numbers; have `/api/leetcode` and `/api/leetcode/chat` catch a classified "not a coding problem" response (or a malformed/parse-failed response) and return an error the UI renders as a plain message instead of a broken view.
  Verify (mechanical): Submit a made-up problem number and confirm a concepts-level response still renders; submit clearly non-coding text (e.g. a recipe) and confirm the UI shows the "enter a valid coding problem" error instead of crashing or rendering nonsense.
  Learner check: Try an invalid problem number and then some non-coding text — do both behave the way the spec describes, instead of breaking?
  Commit: `Handle invalid problem numbers and non-coding input`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 2 (full-framework response with the generated visualization, the "oh, that's cool" kernel moment); learner confirmed stepping through Previous/Next worked correctly for the array visualization.
- [x] Final kick-the-tires exploration and feedback completed — learner explored the full running app freely (core journey, saved/resumed/renamed/deleted conversations, edge-case inputs) and confirmed everything works. One idea raised (building out Syntax Mode and Guided Mode) was explicitly deferred rather than added — see Final Review.

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship. During final kick-the-tires exploration, the learner proposed building out Syntax Mode and Guided (concept-tutor) Mode using the same patterns as LeetCode Mode's full-framework/guided flows. Discussed as a real scope expansion (both were explicitly cut in `2-scope`/`3-prd` to fit the hackathon's time budget) rather than a small addition — learner chose to ship the current PoC as-is and treat both modes as future work, not a revision to make now. No changes needed; nothing else came up during exploration.

## Code Tour and App Map

- [x] Learning activity complete — guided route, connected to the learner's stated backend-learning goal
- [x] Optional edit and transfer reflection addressed — edit kept and verified; reflection answered (recorded in the ignored learner profile)
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Traced the Save flow backend-to-front: `components/SaveButton.tsx` (`handleSave`'s `fetch`) → `app/api/conversations/route.ts` (`POST`, `prisma.conversation.create`) → `lib/prisma.ts` (shared client) + `prisma/schema.prisma` (the `Conversation` model, compiled into `prisma/migrations/20261022151110_init/migration.sql`). Learner opted for a full explanation over live click-through; explanation given directly rather than a static fallback (app was running throughout).
Route and stops: `components/SaveButton.tsx` → `app/api/conversations/route.ts` → `lib/prisma.ts`/`prisma/schema.prisma`. Explained, not live-clicked by the learner.
Edit outcome: kept — learner changed `components/SaveButton.tsx`'s button label from "Save conversation" to "Save Chat" (and the error label text) directly in their editor; verified via `npm run lint` (clean), committed as `Rename save button label to "Save Chat"`.
Reflection: answered — personal response recorded in the ignored learner profile (`Learning Moments`), not here.
Activity mode: live app and editor (explanation-led, not click-through)

## Revisions

- Gemini SDK package: used `@google/genai` instead of the spec's `@google/generative-ai` — the latter is Google's older, maintenance-mode package; `@google/genai` is the current actively-maintained unified SDK and exposes the same `responseMimeType`/`responseSchema` JSON-mode config the spec called for.
- Gemini model name: used the concrete `gemini-2.5-flash` instead of a `-latest` alias — the alias (`gemini-flash-latest`) returned a transient 503 "high demand" error during testing; the stable named model worked immediately. Confirmed via `GET /v1beta/models` that `gemini-2.5-flash` is available on this API key.
- Visual direction refined mid-slice-1, from a reference image the learner provided: dark mode flips to white primary text with green as the secondary/accent color (was all-green); sidebar is now a floating rounded card with rounded, animated (hover + press) interactive elements instead of flat text links; a subtle animated background glow was added. `prd.md` and `spec.md > Look and Feel` updated to match.
- Typography changed at the learner's request: Roboto is now the default UI typeface everywhere except the sidebar logo (kept in Source Code Pro) and displayed code (rendered in Source Code Pro, Black/900 weight) — supersedes the originally-approved single-monospace-typeface-everywhere direction. `prd.md`/`spec.md > Look and Feel` updated.
- Scope addition at the learner's request: the full-framework response now also includes the actual solution `code` in the chosen language (new Gemini response field + a Code section in `FullFrameworkView`), alongside the UMPIRE breakdown. `prd.md > Full framework response` and `spec.md > Components > FullFrameworkView` updated to include it.
- Bug fix during slice 3's learner check: the guided-mode system instruction never told Gemini the input might be a bare LeetCode problem number to recognize — only the full-framework prompt had that instruction. Fixed by mirroring the same "recognize the number, infer concepts if unfamiliar" guidance into `generateGuidedReply`'s system instruction.
- Prompt refinement at the learner's request: the tutor now explicitly asks "are you ready to move on to [stage]?" and keeps `stage` unchanged until the student confirms, rather than silently advancing once it judges the stage understood.
- Discovered during testing: `gemini-2.5-flash`'s free tier caps at 20 requests/day. Worth pacing live testing against this limit, and relevant to `6-ship`'s demo recording (don't waste quota on retakes right before recording).
- Prisma version pinned: `npm install prisma` resolved to an unstable 8.0 release candidate with a completely different, more complex API (`prisma.config.ts`, a compiled "contract," `db.orm.public.Model.where()`). Pinned to the latest stable release (7.10.1) instead, which uses the classic schema + generated-client workflow the spec assumed.
- Neon connection: using the direct (unpooled) connection string for both migrations and the app's own runtime queries, not the pooled one — the app runs as one long-lived Next.js process (even in production, not deployed as per-request serverless functions for this PoC), so PgBouncer's transaction-mode restrictions don't help here and would only add risk (prepared-statement errors, etc.).
- Gotcha discovered mid-build: a running dev server keeps its in-memory Prisma Client even after `prisma generate` regenerates it on disk — Turbopack's hot-reload doesn't notice. A schema change always needs a full dev-server restart, not just a save.
- CSS bug fixed at the learner's request: `body { overflow-x: hidden; }` in `globals.css` was silently breaking the sidebar's `position: sticky` (any non-`visible` overflow on an ancestor, even on an unrelated axis, disables sticky for descendants in some browsers). Removed; the animated background already clips its own overflow independently.
- Scope additions at the learner's request, both folded into slice 5: an editable `title` per saved conversation (new column + rename UI), and a delete option per saved conversation (`DELETE /api/conversations/:id` + an ✕ button). `prd.md > Saved conversations` and `spec.md` updated for both.
- Bug fixed during slice 6: the first version of the `isCodingProblem` classification instruction was too strict — Gemini rejected an unrecognized bare problem number (e.g. "99999") as non-coding, contradicting the PRD's "still respond with concepts, don't fail outright" requirement for unrecognized numbers. Tightened the prompt so any bare number is always treated as a coding problem (best-effort inference), reserving the non-coding rejection for clearly non-technical text.

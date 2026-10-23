# 🧠 Syntactics

Syntactics is an AI-powered interview-prep and coding-analysis platform built with Next.js, Prisma, and Google Gemini. It helps students and developers break down coding problems using the UMPIRE framework, generate full solution explanations, and work through guided practice conversations in a focused, structured learning environment.

The application is designed around one core workflow: a user enters a LeetCode-style problem or problem number, selects a programming language, and receives either:

- a full analytical breakdown with complexity, concepts, and implementation guidance, or
- a guided tutoring experience that walks through the problem step-by-step with conversational follow-up.

This project blends AI reasoning, code visualization, and persistent chat history into a single learning interface.

## ✨ Features

### 🧩 Full Framework Mode
The Full Framework mode provides a complete analysis of a coding problem based on the UMPIRE approach:

- Understand: Restates the problem and constraints in plain language
- Match: Identifies the problem type and relevant data structures/techniques
- Plan: Outlines the solution strategy in a structured way
- Implement: Describes the project approach in the requested language
- Review: Explains correctness checks and edge cases
- Evaluate: Summarizes trade-offs and complexity trade-offs

In this mode, the app also returns:

- Time and space complexity with reasoning
- Key problem concepts and algorithmic ideas
- A complete code solution in the user-selected language
- Visualization steps for problem execution flow

### 🗣️ Guided Mode
The Guided Mode acts like an interview coach rather than a direct answer generator.

It allows the learner to:

- Start a conversation with the AI tutor about a coding problem
- Receive stage-specific follow-up prompts using the UMPIRE framework
- Ask for clarifying guidance without getting the full solution immediately
- Continue iterating through the problem slowly and intentionally
- Receive visualization content when they ask for it

This keeps the experience interactive and educational rather than simply dumping a final solution.

### 💾 Conversation Persistence
The platform stores saved conversations in a PostgreSQL database using Prisma.

Users can:

- save full-framework and guided conversations
- revisit prior problem analysis later
- rename saved sessions
- delete sessions from the sidebar

### 📊 Problem Visualization
Some problems can be visualized using step-by-step execution representations, including:

- array walkthroughs
- linked-list traversal
- tree traversal
- recursion call stack display

These visual components make abstract algorithmic steps easier to understand.

### 💻 Language Selection
Users can submit coding problems in a variety of languages, including Python, JavaScript, TypeScript, Java, C, C++, Go, Rust, Ruby, and more.

### 🎨 Theme Support
The UI includes a dark/light theme toggle and a polished sidebar-based layout for a focused coding-practice experience.

## 🏗️ Architecture

Syntactics is built as a Next.js application with an App Router architecture.

### 🗺️ High-Level Architecture

- Frontend: Next.js App Router pages and interactive React components
- Backend API: Route handlers under `app/api`
- AI Layer: Google Gemini via `@google/genai`
- Data Layer: Prisma ORM connected to PostgreSQL
- Persistence: conversation metadata, stage tracking, and saved history
- Visualization Layer: custom UI for algorithm walkthrough steps

### 🔄 Request Flow

1. User enters a prompt or LeetCode problem on the frontend
2. Frontend sends the request to an API route
3. The server calls Gemini with a strict JSON schema
4. Gemini returns structured output:
   - UMPIRE stages
   - complexity explanations
   - concepts
   - code
   - execution steps
5. The frontend renders the result and optionally saves it to the database

### 🛠️ Core Technologies

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL (via Neon/Postgres-compatible database)
- Google Gemini
- CSS Modules for component styling

## 📁 Project Structure

```text
Syntactics/
├── app/
│   ├── api/
│   │   ├── conversations/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── leetcode/
│   │       ├── route.ts
│   │       └── chat/
│   │           └── route.ts
│   ├── leetcode/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── FullFrameworkView.tsx
│   ├── GuidedChat.tsx
│   ├── InlineCode.tsx
│   ├── LeetCodeForm.tsx
│   ├── SaveButton.tsx
│   ├── Sidebar.tsx
│   └── visualization/
│       ├── ArrayView.tsx
│       ├── LinkedListView.tsx
│       ├── RecursionView.tsx
│       ├── TreeView.tsx
│       └── VisualizationStepper.tsx
├── lib/
│   ├── gemini.ts
│   ├── prisma.ts
│   ├── theme-context.tsx
│   ├── umpire.ts
│   └── visualization.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── logo.png
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── prisma7.config.ts
├── tsconfig.json
├── README.md
└── Features.md
```

## 🚀 Setup Instructions

### 📋 Prerequisites

Before running the application, ensure you have:

- Node.js 18+ recommended
- npm or another package manager
- A PostgreSQL-compatible database (Neon is supported)
- A Google Gemini API key

### 1. 📥 Clone the Repository

```bash
git clone <repository-url>
cd Syntactics
```

### 2. 📦 Install Dependencies

```bash
npm install
```

### 3. 🔐 Configure Environment Variables

Copy the example environment file and fill in your secrets:

```bash
cp .env.example .env.local
```

Then configure the following values:

```env
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=your_database_connection_string
DATABASE_URL_UNPOOLED=your_unpooled_database_connection_string
```

Notes:

- `GEMINI_API_KEY` is required for AI generation
- `DATABASE_URL` and `DATABASE_URL_UNPOOLED` are required for Prisma-backed conversation persistence

### 4. ⚙️ Generate Prisma Client

```bash
npx prisma generate
```

### 5. 🗃️ Sync the Database Schema

If you are setting up a fresh database instance, push the schema:

```bash
npx prisma db push
```

If you prefer migrations, use the Prisma migration flow appropriate for your environment.

### 6. ▶️ Start the Frontend and Backend

Run the application in development mode:

```bash
npm run dev
```

The app will be available at:

```text
http://localhost:3000
```

### 🏭 Production Build

```bash
npm run build
npm run start
```

## 🧰 Frontend and Backend Setup Details

### 🖥️ Frontend Setup

The frontend is built with Next.js App Router and uses React, CSS Modules, and a custom theme context.

Main frontend responsibilities:

- problem input form
- language selector
- response style toggle
- full framework rendering
- guided tutor chat
- saved conversation sidebar
- theme toggling

### ⚡ Backend Setup

The backend is implemented through Next.js route handlers and the Prisma client.

Main backend responsibilities:

- validate request payloads
- call the Gemini API with structured schemas
- store or retrieve conversation records
- persist guided chat state and stage data
- return JSON responses for the frontend

## 🔌 API Endpoints

### 🧠 POST /api/leetcode
Generates a full UMPIRE-based breakdown for a problem.

Request body:

```json
{
  "problem": "Two Sum",
  "language": "Python"
}
```

Response:

```json
{
  "isCodingProblem": true,
  "umpire": {
    "understand": "...",
    "match": "...",
    "plan": "...",
    "implement": "...",
    "review": "...",
    "evaluate": "..."
  },
  "complexity": {
    "time": "O(n)",
    "timeReasoning": "...",
    "space": "O(n)",
    "spaceReasoning": "..."
  },
  "concepts": ["Hash Map", "Two Pointers"],
  "code": "...",
  "steps": []
}
```

### 💬 POST /api/leetcode/chat
Generates the next guided response in a conversational tutor flow.

Request body:

```json
{
  "problem": "Two Sum",
  "language": "Python",
  "messages": [
    { "role": "user", "content": "I think this uses hashing." },
    { "role": "model", "content": "Good start..." }
  ]
}
```

This route returns a response object containing:

- `reply`
- `stage`
- `isCodingProblem`
- optional `steps` when visualization is requested

### 📚 GET /api/conversations
Returns all saved conversations sorted by most recently updated.

### ➕ POST /api/conversations
Creates a new saved conversation record.

Request body:

```json
{
  "mode": "full",
  "problem": "Two Sum",
  "language": "Python",
  "response": { "...": "..." }
}
```

### 🔎 GET /api/conversations/[id]
Fetches one saved conversation by ID.

### ✏️ PATCH /api/conversations/[id]
Updates conversation metadata such as the title or staged chat progression.

### 🗑️ DELETE /api/conversations/[id]
Deletes a saved conversation.

## 🎛️ Frontend Features

### 🏠 Landing Experience
The app redirects the root route to the LeetCode practice page, keeping the flow focused on interview-prep usage.

### 📝 Practice Form
The form supports:

- typing or pasting a problem statement
- entering a problem number
- choosing a language
- toggling between Full Framework and Guided modes

### 📄 Result Rendering
The frontend renders algorithm explanations with clear sectioning:

- UMPIRE breakdown
- complexity analysis
- concepts list
- code snippet panel
- visualization area

### 🤝 Guided Tutor Chat
The guided interface includes:

- conversation thread
- stage pills for UMPIRE progression
- input box for follow-up responses
- loading states and error handling
- delete message actions
- saved conversation support

### 🕘 Saved History Sidebar
The sidebar includes:

- saved conversation list
- rename action
- delete action
- dark/light mode toggle

## 🛡️ Security Features

This project includes several important safeguards and best practices:

- Environment variables store sensitive values such as API keys outside the source tree
- API routes validate required input before calling Gemini
- Invalid or non-coding submissions are rejected with structured errors
- Prisma is used to interact with the database through strict schema-driven models
- The database layer avoids ad-hoc SQL by default, reducing query error risk
- Conversation records are managed through server-side route handlers rather than direct client-side DB access

It is important to note that this project currently focuses on route validation and safe configuration patterns. For production-grade deployments, additional security measures should be added, including:

- authentication/authorization for user-specific conversation access
- rate limiting and abuse protection
- sanitization of user-generated problem statements before persistence
- secure deployment environment configuration for production

## 🚢 Deployment

### 💻 Local Deployment
Use the standard Next.js development workflow:

```bash
npm install
cp .env.example .env.local
npm run dev
```

### ☁️ Production Deployment
The app is compatible with standard Next.js deployment targets such as:

- Vercel
- self-hosted Node.js hosting
- containerized deployment environments

For Vercel deployment, set these environment variables in the project settings:

- `GEMINI_API_KEY`
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`

Then deploy the project with the standard Next.js build pipeline.

### 🗄️ Database Deployment Notes
Because the app relies on PostgreSQL and Prisma, the database must be available and reachable before the app can persist saved conversations.

If you are using Neon, ensure the connection strings and database privileges are correctly configured.

## 🧯 Troubleshooting

### 🤖 Gemini API Not Working
Symptoms:

- `GEMINI_API_KEY is not set`
- 502 errors returned from API routes

Fix:

- ensure `.env.local` is populated properly
- verify the Gemini API key is valid
- check internet access and API limits

### 🔌 Database Connection Errors
Symptoms:

- Prisma client initialization errors
- failed database queries
- connection refused errors

Fix:

- confirm `DATABASE_URL` and `DATABASE_URL_UNPOOLED` are valid
- ensure the Postgres database is running
- regenerate the Prisma client after schema changes

### 🔄 Prisma Schema Sync Issues
If you change the schema and encounter Prisma issues:

```bash
npx prisma generate
npx prisma db push
```

### 🖼️ App Is Not Loading UI
Check:

- whether `npm install` completed successfully
- whether the app is running on the correct port
- whether the Next.js dev server has no compile-time errors

### 💾 Persistence Not Showing Up
Possible causes:

- the database is not connected
- the conversation save action failed
- the browser is not making the API call correctly

## 🔮 Future Enhancements

The current implementation provides a solid foundation for a broader AI coding tutor platform. Potential improvements include:

- user authentication and personalized profiles
- support for additional problem repositories and difficulty filters
- tracking progress over time
- code execution or test-case validation
- session analytics and learner insights
- multi-page curriculum and concept modules
- more advanced data structure animations
- export/share of interview prep notes
- support for larger AI prompt customization and tutor personas

## 📜 Licensing

This repository does not currently include a formal license file in the project root, so the project is not explicitly licensed for public reuse as-is.

If you plan to distribute or commercialize this project, verify the intended license terms with the repository owner before doing so.

## 📝 Summary

Syntactics is a focused AI learning platform for coding interview preparation. It combines the power of Gemini, structured algorithmic analysis, conversational tutoring, and persistent saved conversations into a single practical tool for students and developers working through coding problems.

Whether used in Full Framework mode for a complete breakdown or Guided mode for a slower coaching experience, the application gives users a stronger path to understanding and solving algorithmic challenges.

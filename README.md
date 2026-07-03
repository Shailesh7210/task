# Task Manager

A full-stack Task Manager web app with authentication, task CRUD, filtering, and an AI-powered task creation assistant.

**Live demo:** https://task-nu-sooty.vercel.app
**Backend API:** https://task-bbae.onrender.com

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-60 seconds to respond while it wakes up.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS | Fast to build with, strong typing, easy Vercel deployment |
| Backend | Node.js + Express + TypeScript | Familiar, flexible REST API framework with full type safety |
| Database | MongoDB (Atlas) via Mongoose | Simple schema-flexible data model, well suited for a small relational-lite app like this |
| Auth | JWT stored in an httpOnly cookie | Avoids exposing the token to JavaScript (XSS-safe), unlike storing JWT in localStorage |
| AI | Google Gemini API (`gemini-2.0-flash`) | Free tier, fast responses, supports structured JSON output which made parsing reliable |
| Validation | Zod (both frontend and backend) | Shared validation patterns, clear error messages, type inference |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) | Free tiers, straightforward CI from GitHub |

---

## Features

- Full CRUD for tasks (title, description, due date, priority, status)
- Filter tasks by status and/or priority
- Signup / Login / Logout with secure, httpOnly JWT cookie sessions
- **AI Suggest**: type a rough task title, and Gemini generates a description + priority suggestion, editable before saving
- Responsive UI (mobile and desktop)
- Dark mode toggle, persisted across sessions

---

## Project Structure

```
task-manager/
├── backend/           Express + TypeScript API
│   └── src/
│       ├── config/       DB connection
│       ├── controllers/  Route handlers
│       ├── middleware/   Auth guard, error handler
│       ├── models/       Mongoose schemas
│       ├── routes/       Express routers
│       ├── services/     Gemini AI integration
│       └── utils/        JWT helpers, Zod schemas, async wrapper
└── frontend/           Next.js App Router + TypeScript
    └── src/
        ├── app/           Pages (login, signup, tasks)
        ├── components/    Reusable UI components
        ├── context/       Auth + Theme React contexts
        ├── lib/           API client
        └── types/         Shared TypeScript types
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (free tier) or local MongoDB instance
- A free Gemini API key from https://aistudio.google.com/apikey

### 1. Clone the repo
```bash
git clone https://github.com/Shailesh7210/task.git
cd task
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
```
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=<your Gemini API key>
GEMINI_MODEL=gemini-2.0-flash
```
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

### 3. Frontend setup
Open a new terminal:
```bash
cd frontend
npm install
cp .env.example .env.local
```
Fill in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
```bash
npm run dev
```
Frontend runs at `http://localhost:3000`.

### 4. Try it out
Visit `http://localhost:3000`, sign up, create a task, and try the AI Suggest button on the task creation form.

---

## API Reference

```
POST   /api/auth/signup       { name, email, password }
POST   /api/auth/login        { email, password }
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/tasks             ?status=&priority=
GET    /api/tasks/:id
POST   /api/tasks             { title, description, dueDate, priority, status }
PUT    /api/tasks/:id
DELETE /api/tasks/:id

POST   /api/ai/suggest        { title }  ->  { suggestion: { description, priority } }
```

All `/api/tasks` and `/api/ai/*` routes require an authenticated session (cookie).

---

## AI Tools & Resources Used

- **Gemini API** (`gemini-2.0-flash`) for the AI Suggest feature — prompted to return strict JSON (`{ description, priority }`) so the response could be parsed reliably rather than free-text.
- **Claude** (Anthropic) was used as a pair-programming assistant throughout — for architecture planning, writing backend/frontend code, debugging deployment issues (CORS, cross-domain cookies, TypeScript config, Render build configuration), and this README.

---

## What I'd Improve With More Time

- Add automated tests (Jest for backend routes, React Testing Library for frontend components) — the project currently relies on manual testing.
- Add drag-and-drop status changes (Kanban-style board) instead of only the dropdown/form-based status update.
- Add pagination or infinite scroll for the task list once it grows large — currently all tasks load at once.
- Add refresh tokens with shorter-lived access tokens instead of a single 7-day JWT, for better security hygiene.
- Add rate limiting on the AI Suggest endpoint to prevent quota exhaustion from repeated calls.

---

## Notable Debugging Lessons (from building this)

- **Cross-domain cookies**: deploying frontend and backend on different domains (Vercel + Render) requires `sameSite: "none"` and `secure: true` on the auth cookie — but only in production, since these break `http://localhost` in development. Also required `NODE_ENV=production` to actually be set on Render for this logic to activate.
- **Render + NODE_ENV=production**: setting `NODE_ENV=production` on Render causes `npm install` to skip `devDependencies` by default — which broke the TypeScript build step, since `typescript` and `@types/node` live there. Fixed with `npm install --include=dev && npm run build` as the build command.

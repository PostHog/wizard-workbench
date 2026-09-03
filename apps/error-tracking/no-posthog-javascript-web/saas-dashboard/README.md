# TrackFlow — SaaS Project Management Dashboard

A production-style vanilla JavaScript SPA built with Vite. Used as a test fixture for the PostHog wizard's general JavaScript skill detection.

## Stack

- **Vanilla JavaScript** (no frameworks)
- **Vite** bundler
- **chart.js** dependency (unused but present for realistic package.json)
- Hash-based SPA router
- localStorage-backed state

## Features

- Login/auth flow with 3 demo accounts
- Dashboard with stats, progress bars, team workload
- Projects list with create/delete
- Kanban board with task management (add, move, assign, delete)
- Settings with theme toggle, notifications, team members
- Responsive sidebar + topbar layout
- Dark mode support

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 and sign in with `alice@trackflow.dev`.

## Demo accounts

| Email                  | Role   |
| ---------------------- | ------ |
| alice@trackflow.dev    | Admin  |
| bob@trackflow.dev      | Member |
| carol@trackflow.dev    | Member |

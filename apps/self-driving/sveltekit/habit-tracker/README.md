# Habit Tracker (SvelteKit 2)

A small habit tracker built with SvelteKit 2 and Svelte 5 runes, backed by an in-memory store.
No analytics — this app is a clean target for the PostHog wizard.

## Features

- Add daily or weekly habits
- Check in and out, which bumps or rolls back the streak
- Delete habits
- JSON API routes (`+server.ts`) with an in-memory store

## Tech stack

- SvelteKit 2 with `adapter-node`
- Svelte 5 (runes)
- TypeScript
- Vite 6

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/habits` | List all habits |
| `POST` | `/api/habits` | Create a habit — `{ "name": "Read", "cadence": "daily" }` |
| `PATCH` | `/api/habits/[id]` | Check in or out — `{ "checkedToday": true }` |
| `DELETE` | `/api/habits/[id]` | Delete a habit |

## Project structure

```
src/
├── lib/
│   ├── types.ts              # Shared Habit type
│   └── server/data.ts        # In-memory habit store
└── routes/
    ├── +layout.svelte
    ├── +page.svelte          # Habit list, check-ins, add form
    ├── about/+page.svelte
    └── api/habits/
        ├── +server.ts        # GET, POST
        └── [id]/+server.ts   # PATCH, DELETE
```

## Notes

- Data lives in memory and resets on every server restart
- Seeded with three sample habits

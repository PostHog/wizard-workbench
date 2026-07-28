# Expense Splitter (React Router v7)

A shared-expense tracker built with React Router v7 in framework mode, using loaders and actions
over an in-memory store. No analytics — this app is a clean target for the PostHog wizard.

## Features

- Add an expense with a description, amount, and who paid
- Settle and reopen expenses
- Delete expenses
- Running balance per person, splitting unsettled expenses evenly
- Server-side data via `loader` / `action`, no client fetch layer

## Tech stack

- React Router v7 (SSR, framework mode)
- React 19
- TypeScript
- Vite 6

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Routes

| Route | Description |
|---|---|
| `/` | Expense list, balances, and the add form (`loader` + `action`) |
| `/about` | Static about page |

The index `action` handles three intents, submitted as hidden `intent` fields: `create`, `settle`,
and `delete`.

## Project structure

```
app/
├── root.tsx                  # Document shell and error boundary
├── routes.ts                 # Route config
├── app.css
├── expenses.server.ts        # In-memory expense store and balance math
└── routes/
    ├── home.tsx              # loader + action, expense UI
    └── about.tsx
```

## Notes

- Data lives in memory and resets on every server restart
- Seeded with three expenses across three people

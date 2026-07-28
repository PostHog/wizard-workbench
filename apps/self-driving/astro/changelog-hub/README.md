# Changelog Hub (Astro 5, SSR)

A server-rendered changelog site built with Astro 5 and the Node adapter. No analytics — this app
is a clean target for the PostHog wizard.

## Features

- Release list rendered on the server, newest first
- Release detail pages at `/releases/:slug`
- 👍 reactions on a release, posted from a small inline client script
- Email subscribe form backed by an API endpoint

## Tech stack

- Astro 5 (`output: 'server'`)
- `@astrojs/node` standalone adapter
- TypeScript
- No UI framework — plain Astro components and inline scripts

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321.

## Routes

| Route | Description |
|---|---|
| `/` | Release list, reactions, subscribe form |
| `/releases/[slug]` | Release detail with full notes |
| `/about` | Static about page |
| `POST /api/subscribe` | Subscribe an email — `{ "email": "you@example.com" }` |
| `POST /api/releases/[slug]/react` | Add a reaction, returns the updated release |

## Project structure

```
src/
├── layouts/Layout.astro      # Document shell and global styles
├── lib/releases.ts           # In-memory releases and subscribers
└── pages/
    ├── index.astro           # Release list + client script
    ├── about.astro
    ├── releases/[slug].astro
    └── api/
        ├── subscribe.ts
        └── releases/[slug]/react.ts
```

## Notes

- Releases, reactions, and subscribers live in memory and reset on every server restart
- Seeded with three releases

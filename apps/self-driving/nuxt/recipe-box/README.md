# Recipe Box (Nuxt 4)

A small recipe keeper built with Nuxt 4 and Nitro server routes, backed by an in-memory store.
No analytics — this app is a clean target for the PostHog wizard.

## Features

- Add recipes with a cook time and tags
- Mark a recipe as cooked, which bumps its cook count
- Favorite and unfavorite recipes
- Delete recipes
- Nitro API routes over an in-memory store

## Tech stack

- Nuxt 4 (`app/` source directory)
- Vue 3 with `<script setup>`
- Nitro server routes
- TypeScript

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/recipes` | List all recipes |
| `POST` | `/api/recipes` | Create a recipe — `{ "title": "Ramen", "minutes": 25, "tags": ["dinner"] }` |
| `PATCH` | `/api/recipes/:id` | Update cook count or favorite — `{ "cooked": 7 }` |
| `DELETE` | `/api/recipes/:id` | Delete a recipe |

## Project structure

```
app/
├── app.vue
├── assets/main.css
└── pages/
    ├── index.vue             # Recipe list, add form, cook + favorite actions
    └── about.vue
server/
├── api/recipes/
│   ├── index.get.ts
│   ├── index.post.ts
│   ├── [id].patch.ts
│   └── [id].delete.ts
└── utils/recipes.ts          # In-memory recipe store
```

## Notes

- Data lives in memory and resets on every server restart
- Seeded with three sample recipes

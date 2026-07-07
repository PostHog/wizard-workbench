# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Next.js 15 App Router todo application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ recommended approach, with a reverse proxy configured in `next.config.ts` to route PostHog requests through `/ingest` (avoids ad blockers).
- **Server-side client** in `lib/posthog-server.ts` using `posthog-node` for server-side event capture in API routes.
- **Environment variables** written to `.env.local` (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`).
- **7 events** instrumented across client-side components and server-side API routes.

| Event name | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item from the form. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks an active todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item back to active. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server confirms a new todo was successfully persisted via the POST API route. | `app/api/todos/route.ts` |
| `server_todo_updated` | Server confirms a todo was successfully updated via the PATCH API route. | `app/api/todos/[id]/route.ts` |
| `server_todo_deleted` | Server confirms a todo was successfully deleted via the DELETE API route. | `app/api/todos/[id]/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812144)
- [Todo actions over time (wizard)](https://us.posthog.com/project/483112/insights/UePBhnrz) — Line chart of created, completed, and deleted todos over 30 days
- [Todo completion funnel (wizard)](https://us.posthog.com/project/483112/insights/5ZMczZmz) — Funnel from `todo_created` → `todo_completed`
- [Total todos created (wizard)](https://us.posthog.com/project/483112/insights/XOFw5oLx) — Bold number showing total todos created in 30 days
- [Todos with descriptions vs without (wizard)](https://us.posthog.com/project/483112/insights/fUnrPNWw) — Bar chart broken down by `has_description` property
- [Todo churn: deleted before completion (wizard)](https://us.posthog.com/project/483112/insights/RHWlnXp7) — Stacked weekly bar comparing deleted vs completed todos

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

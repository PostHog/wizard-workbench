<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router todo application. The integration covers client-side event tracking for all core todo interactions, server-side tracking for every mutating API route, a reverse proxy to avoid ad blockers, and error capture throughout the mutation handlers.

**Files created:**
- `instrumentation-client.ts` — PostHog browser SDK initialisation (uses Next.js 15.3+ instrumentation-client hook)
- `lib/posthog-server.ts` — Singleton `posthog-node` client for server-side API routes
- `.env.local` — `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`

**Files modified:**
- `next.config.ts` — Added `/ingest` reverse proxy rewrites for `/static/*`, `/array/*`, and `/:path*`
- `components/todos/todo-list.tsx` — Added `posthog.capture()` for `todo_created`, `todo_completed`, `todo_reopened`, `todo_deleted`; passes `x-posthog-distinct-id` header to API routes; added `posthog.captureException()` in catch blocks
- `pages/api/todos/index.ts` — Added `server_todo_created` capture on POST; reads distinct ID from `x-posthog-distinct-id` header; `await posthog.flush()` before returning
- `pages/api/todos/[id].ts` — Added `server_todo_updated` capture on PATCH and `server_todo_deleted` on DELETE; reads distinct ID from header; `await posthog.flush()` before returning

| Event name | Description | File |
|---|---|---|
| `todo_created` | User submits the form to add a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_reopened` | User unchecks a completed todo, marking it active again. | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item from the list. | `components/todos/todo-list.tsx` |
| `server_todo_created` | Server-side confirmation that a new todo was successfully persisted. | `pages/api/todos/index.ts` |
| `server_todo_updated` | Server-side confirmation that a todo was updated (completion status or content). | `pages/api/todos/[id].ts` |
| `server_todo_deleted` | Server-side confirmation that a todo was successfully deleted. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1901925)
- [Todo actions over time (wizard)](https://us.posthog.com/project/483112/insights/VWRm4i5O)
- [Todo completion funnel (wizard)](https://us.posthog.com/project/483112/insights/fUHAORmY)
- [Total todos created (wizard)](https://us.posthog.com/project/483112/insights/HwU4iuhz)
- [Todo deletion rate (wizard)](https://us.posthog.com/project/483112/insights/QSjNLJ4V)
- [Todo engagement stickiness (wizard)](https://us.posthog.com/project/483112/insights/mzEs7Wh7)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

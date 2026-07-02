<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Here is a summary of every change made:

- **`instrumentation-client.ts`** (new) — Initializes PostHog client-side via the Next.js 15.3+ instrumentation hook. Uses the `/ingest` reverse proxy, enables exception capture, and turns on debug mode in development.
- **`next.config.ts`** (updated) — Added reverse-proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog traffic through the Next.js server, reducing ad-blocker impact. Added `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new) — Singleton PostHog Node.js client for server-side event capture, shared across API route handlers.
- **`components/todos/todo-list.tsx`** (updated) — Added client-side `posthog.capture()` calls for `todo_created`, `todo_completed`, `todo_uncompleted`, and `todo_deleted` events; added `posthog.captureException()` in each catch block for error tracking.
- **`pages/api/todos/index.ts`** (updated) — Added server-side `todo_created` event capture after successful POST, respecting the `x-posthog-distinct-id` header for user correlation.
- **`pages/api/todos/[id].ts`** (updated) — Added server-side `todo_updated` event capture after successful PATCH, and `todo_deleted` after successful DELETE, both using `x-posthog-distinct-id` for correlation.
- **`.env.local`** (created/updated) — PostHog public token and host set via environment variables.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | Fires on the client when a user successfully adds a new todo item. | `components/todos/todo-list.tsx` |
| `todo_completed` | Fires on the client when a user marks a todo item as completed. | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fires on the client when a user marks a completed todo item as incomplete. | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fires on the client when a user successfully deletes a todo item. | `components/todos/todo-list.tsx` |
| `todo_created` | Fires server-side when the POST /api/todos handler successfully creates a new todo. | `pages/api/todos/index.ts` |
| `todo_updated` | Fires server-side when the PATCH /api/todos/[id] handler successfully updates a todo. | `pages/api/todos/[id].ts` |
| `todo_deleted` | Fires server-side when the DELETE /api/todos/[id] handler successfully removes a todo. | `pages/api/todos/[id].ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1792911)
- [Todo Actions Over Time (wizard)](https://us.posthog.com/project/483112/insights/Wrdu3WZm)
- [Todos Created (wizard)](https://us.posthog.com/project/483112/insights/qWZHOtUE)
- [Todo Completion Rate (wizard)](https://us.posthog.com/project/483112/insights/lURbh4QU)
- [Todo Deletions Over Time (wizard)](https://us.posthog.com/project/483112/insights/n3BbzPIz)
- [Unique Active Users (wizard)](https://us.posthog.com/project/483112/insights/HteMJHFX)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

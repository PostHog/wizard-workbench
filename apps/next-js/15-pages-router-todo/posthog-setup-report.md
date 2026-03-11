<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

**New files created:**
- `instrumentation-client.ts` — Client-side PostHog initialization using the Next.js 15.3+ instrumentation hook. Initializes `posthog-js` with the reverse proxy host, error tracking enabled, and debug mode in development.
- `lib/posthog-server.ts` — Singleton server-side PostHog client using `posthog-node` for API route event capture.
- `.env.local` — Environment variables `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set securely.

**Modified files:**
- `next.config.ts` — Added reverse proxy rewrites for `/ingest/*` → PostHog ingestion and `/ingest/static/*` → PostHog assets. Added `skipTrailingSlashRedirect: true`.
- `components/todos/todo-list.tsx` — Added client-side PostHog capture for todo lifecycle events and exception capture on fetch errors.
- `pages/api/todos/index.ts` — Added server-side `todo_created_server` event capture on successful POST.
- `pages/api/todos/[id].ts` — Added server-side `todo_updated_server` and `todo_deleted_server` event capture on successful PATCH/DELETE.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | A user creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | A user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | A user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | A user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created_server` | Server-side: a new todo was successfully created via the API | `pages/api/todos/index.ts` |
| `todo_updated_server` | Server-side: a todo was updated via the API | `pages/api/todos/[id].ts` |
| `todo_deleted_server` | Server-side: a todo was successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To start analyzing user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Todo Creation Trend** — Trend chart of `todo_created` over time to see daily/weekly task creation volume.
2. **Completion Funnel** — Funnel: `todo_created` → `todo_completed` to measure how many todos are finished.
3. **Deletion Rate** — Trend chart of `todo_deleted` to track churn (todos removed before completion).
4. **Completion vs Deletion** — Bar chart comparing `todo_completed` and `todo_deleted` event counts.
5. **Server vs Client Consistency** — Compare `todo_created` and `todo_created_server` counts to verify client/server tracking alignment.

Visit your PostHog project at [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

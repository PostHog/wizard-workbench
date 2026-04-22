<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 App Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Client-side PostHog initialization using `posthog-js`. Configured with a reverse proxy (`/ingest`), exception capture for error tracking, and debug mode in development.
- **`next.config.ts`**: Added reverse proxy rewrites so all PostHog traffic routes through `/ingest` on the same domain (avoids ad blockers), plus `skipTrailingSlashRedirect: true`.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, used by API routes for server-side event capture.
- **`components/todos/todo-list.tsx`**: Added four client-side `posthog.capture()` calls in event handlers after successful API responses.
- **`app/api/todos/route.ts`**: Added server-side `todo_created` capture after a new todo is created via the POST endpoint.
- **`app/api/todos/[id]/route.ts`**: Added server-side `todo_updated` and `todo_deleted` captures in the PATCH and DELETE endpoints.
- **`.env.local`**: Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo created via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated via API (title, description, or completion status) | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

Visit your PostHog project to explore the data once users start interacting with the app. Suggested insights to build in PostHog:

- **Todo creation trend** — Trend chart for `todo_created` over time to track engagement
- **Completion funnel** — Funnel from `todo_created` → `todo_completed` to measure follow-through rate
- **Deletion rate** — Trend of `todo_deleted` vs `todo_created` to monitor churn signals
- **Completion vs uncompleted toggle ratio** — `todo_completed` vs `todo_uncompleted` event counts
- **Active users** — Unique users who fired any todo event (DAU/WAU)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

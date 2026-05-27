<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 App Router todo application. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+) and a server-side singleton client is available via `lib/posthog-server.ts`. All todo CRUD operations are tracked from both the client and the API layer. A reverse proxy via Next.js rewrites routes PostHog traffic through `/ingest`, improving ad-blocker resilience and keeping all network traffic under your own domain.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired on the client when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired on the client when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired on the client when a user marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired on the client when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side event fired when a new todo is successfully persisted via the API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side event fired when a todo is updated via the API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side event fired when a todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Todo creation trend** — Trend of `todo_created` events over time. Reveals how active users are in adding new tasks.
2. **Todo completion rate** — Trend comparing `todo_completed` vs `todo_created`. A conversion-style view of how many created todos get completed.
3. **Task deletion trend** — Trend of `todo_deleted` events broken down by `was_completed`. Shows whether users tend to delete finished or unfinished todos.
4. **Todo completion funnel** — Funnel from `todo_created` → `todo_completed`. Measures what fraction of created todos are ever marked done.
5. **Daily active task management** — Combined trend of all todo events (`todo_created`, `todo_completed`, `todo_deleted`) to measure overall app engagement.

You can build these insights in [PostHog Insights](/insights) and pin them to a new [Dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

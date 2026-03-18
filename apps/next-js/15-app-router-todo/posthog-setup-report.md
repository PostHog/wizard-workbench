<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application.

## Summary of changes

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using `posthog-js` via Next.js 15.3+ instrumentation. Configures reverse proxy ingestion, automatic exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites routing `/ingest/*` to PostHog and set `skipTrailingSlashRedirect: true` to support PostHog trailing slash requests.
- **`lib/posthog-server.ts`** (new): Singleton PostHog server-side client using `posthog-node` for tracking events in API routes.
- **`components/todos/todo-list.tsx`** (updated): Added client-side event capture for todo creation, completion, un-completion, and deletion. Added `captureException` in error catch blocks.
- **`app/api/todos/route.ts`** (updated): Added server-side `todo_created` event on successful POST.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side `todo_updated` and `todo_deleted` events on successful PATCH and DELETE.
- **`.env.local`** (created): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | User successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | User marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | User unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo_deleted` | User deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: new todo persisted via API | `app/api/todos/route.ts` |
| `todo_updated` | Server-side: todo updated (toggle/edit) via API | `app/api/todos/[id]/route.ts` |
| `todo_deleted` | Server-side: todo deleted via API | `app/api/todos/[id]/route.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Todo creation trend** – Trend chart of `todo_created` over time to track growth in usage
2. **Todo completion funnel** – Funnel from `todo_created` → `todo_completed` to measure completion rate
3. **Todo deletion rate** – Trend of `todo_deleted` to understand churn/disengagement
4. **Completion vs. uncomplete ratio** – Stacked bar of `todo_completed` vs `todo_uncompleted` to see user habits
5. **Active user engagement** – Unique users per day creating or completing todos

Create the dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

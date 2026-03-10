<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the Next.js 15.3+ `instrumentation-client` pattern. Configured with reverse proxy host (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for PostHog ingestion endpoints (`/ingest/static/*` and `/ingest/*`) and set `skipTrailingSlashRedirect: true` to support PostHog trailing slash API requests.
- **`components/todos/todo-list.tsx`** (updated): Added `posthog` import and capture calls for all four todo action events. Added `posthog.captureException()` in all three error handlers for automatic error tracking.
- **`.env.local`** (new): Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`package.json`** (updated): Added `posthog-js@1.360.0` dependency.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog with these suggested insights:

1. **Todo creation trend** – Trend chart for `todo_created` over time
2. **Todo completion rate** – Funnel: `todo_created` → `todo_completed`
3. **Todo deletion trend** – Trend chart for `todo_deleted` over time
4. **Todo action breakdown** – Bar chart comparing `todo_created`, `todo_completed`, `todo_uncompleted`, `todo_deleted`
5. **Active users creating todos** – Unique users who triggered `todo_created`

Visit your PostHog project to create these insights: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

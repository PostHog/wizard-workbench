<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Next.js 15 Pages Router todo application. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side SDK on startup using Next.js's instrumentation-client convention. Configures a reverse proxy via `/ingest`, enables exception capture, and sets debug mode in development.
- **`next.config.ts`** (updated): Adds PostHog reverse proxy rewrites (`/ingest/*` → `https://us.i.posthog.com/*`) and enables `skipTrailingSlashRedirect` for correct API routing.
- **`lib/posthog-server.ts`** (new): Singleton server-side PostHog client using `posthog-node`, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery from short-lived API handlers.
- **`components/todos/todo-list.tsx`** (updated): Added client-side `posthog.capture()` calls and `posthog.captureException()` error tracking for all core todo interactions.
- **`pages/api/todos/index.ts`** (updated): Added server-side `todo_created` event capture on successful todo creation.
- **`pages/api/todos/[id].ts`** (updated): Added server-side `todo_updated` and `todo_deleted` event capture on successful update and delete operations.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when a user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_uncompleted` | Fired when a user marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a new todo is successfully persisted via the API | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: fired when a todo is updated (e.g. completion toggled) via the API | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: fired when a todo is successfully deleted via the API | `pages/api/todos/[id].ts` |

## Next steps

To explore your analytics, visit your PostHog project and create a dashboard with these suggested insights:

- **Todo creation trend**: Trends chart for `todo_created` over time — tracks product growth and daily active usage
- **Completion funnel**: Funnel from `todo_created` → `todo_completed` — shows how many tasks users finish vs abandon
- **Deletion rate**: Trends chart for `todo_deleted` — indicates tasks users regret or no longer need
- **Todo activity overview**: Breakdown stacked bar of all events (`todo_created`, `todo_completed`, `todo_uncompleted`, `todo_deleted`) — gives a full picture of engagement
- **Completion vs deletion**: Comparison chart of `todo_completed` vs `todo_deleted` — reveals whether users finish more than they discard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

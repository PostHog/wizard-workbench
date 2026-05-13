<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 App Router todo application. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes the PostHog client-side SDK using Next.js 15.3+ instrumentation. Configured with a reverse proxy via `/ingest`, error tracking (`capture_exceptions`), and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton PostHog Node.js client for server-side event capture in API routes.
- **`next.config.ts`** (updated): Added reverse proxy rewrites so PostHog requests are routed through the app's own domain (`/ingest/*`), improving ad-blocker resilience.
- **`.env.local`** (updated): Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`components/todos/todo-list.tsx`** (updated): Added client-side capture for todo lifecycle events and exception capture on errors.
- **`app/api/todos/route.ts`** (updated): Added server-side capture for `todo created` on the POST endpoint.
- **`app/api/todos/[id]/route.ts`** (updated): Added server-side capture for `todo updated` and `todo deleted` on the PATCH and DELETE endpoints.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `todo created` | Fired client-side when a user successfully adds a new todo item | `components/todos/todo-list.tsx` |
| `todo completed` | Fired client-side when a user marks a todo as completed | `components/todos/todo-list.tsx` |
| `todo uncompleted` | Fired client-side when a user unchecks a completed todo | `components/todos/todo-list.tsx` |
| `todo deleted` | Fired client-side when a user deletes a todo item | `components/todos/todo-list.tsx` |
| `todo created` | Fired server-side when a new todo is successfully persisted via the API | `app/api/todos/route.ts` |
| `todo updated` | Fired server-side when a todo is successfully updated via the API | `app/api/todos/[id]/route.ts` |
| `todo deleted` | Fired server-side when a todo is successfully deleted via the API | `app/api/todos/[id]/route.ts` |

## Next steps

Here are some suggested insights to build in PostHog for an "Analytics basics" dashboard:

- **Todo creation trend** – Trend of `todo created` events over time to see how actively users are adding tasks
- **Completion funnel** – Funnel from `todo created` → `todo completed` to measure task completion rates
- **Deletion rate** – Trend of `todo deleted` events; high deletion without completion may indicate churn or UX issues
- **Completed vs uncompleted toggles** – `todo completed` vs `todo uncompleted` side-by-side to understand toggle behavior
- **API vs client parity** – Compare server-side and client-side `todo created` event counts to verify tracking consistency

You can create these insights and a dashboard here:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create insights in the Insight builder](https://us.posthog.com/project/2/insights/new)
- [View all captured events](https://us.posthog.com/project/2/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 Pages Router todo application. PostHog is now initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), which provides automatic pageview tracking, session replay, and exception capture. A reverse proxy is configured in `next.config.ts` to route PostHog requests through `/ingest`, reducing the chance of ad blockers interfering with event capture. A server-side PostHog client (`lib/posthog-server.ts`) enables tracking critical business operations directly from API routes.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | Fired when the user successfully creates a new todo item | `components/todos/todo-list.tsx` |
| `todo_completed` | Fired when the user marks a todo item as completed | `components/todos/todo-list.tsx` |
| `todo_reopened` | Fired when the user marks a completed todo item as incomplete | `components/todos/todo-list.tsx` |
| `todo_deleted` | Fired when the user successfully deletes a todo item | `components/todos/todo-list.tsx` |
| `todo_created` | Server-side: fired when a new todo is persisted via the POST API route | `pages/api/todos/index.ts` |
| `todo_updated` | Server-side: fired when a todo is updated via the PATCH API route | `pages/api/todos/[id].ts` |
| `todo_deleted` | Server-side: fired when a todo is removed via the DELETE API route | `pages/api/todos/[id].ts` |

## Next steps

Visit your PostHog project to explore the data once events start flowing. Here are some useful insights to create:

- **Todo creation trend** — Trends chart for `todo_created` over time to see how many todos users create daily
- **Todo completion rate** — Formula insight: `todo_completed / (todo_completed + todo_created)` to measure what fraction of todos get completed
- **Completion funnel** — Funnel from `todo_created` → `todo_completed` to track conversion from creation to completion
- **Deletion rate** — Trends chart for `todo_deleted` compared to `todo_created` to spot churn signals
- **Active vs completed tasks** — Trends comparing `todo_completed` and `todo_reopened` to understand task lifecycle

Navigate to [Insights](/insights) in your PostHog project to build these charts.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

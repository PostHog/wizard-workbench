<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router todo application. Client-side tracking was initialized via `instrumentation-client.ts`, and a reverse proxy was configured in `next.config.ts` to route PostHog requests through `/ingest`. A server-side PostHog client (`lib/posthog-server.ts`) was created for API route tracking. All four core todo actions are tracked client-side in `components/todos/todo-list.tsx`, and the corresponding server-side API routes also fire events with the user's distinct ID passed via the `x-posthog-distinct-id` request header so client and server events are correlated to the same person.

| Event | Description | File |
|---|---|---|
| `todo created` | Fired client-side when a new todo is successfully created | `components/todos/todo-list.tsx` |
| `todo completed` | Fired client-side when a todo is marked as completed | `components/todos/todo-list.tsx` |
| `todo reopened` | Fired client-side when a completed todo is marked active again | `components/todos/todo-list.tsx` |
| `todo deleted` | Fired client-side when a todo is deleted | `components/todos/todo-list.tsx` |
| `todo created` | Server-side: fired on POST /api/todos success | `pages/api/todos/index.ts` |
| `todo updated` | Server-side: fired on PATCH /api/todos/[id] success | `pages/api/todos/[id].ts` |
| `todo deleted` | Server-side: fired on DELETE /api/todos/[id] success | `pages/api/todos/[id].ts` |

## Next steps

To visualize your data, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Todo creation rate** — Trends chart for `todo created` over time. Shows how frequently users create new tasks.
2. **Todo completion rate** — Trends chart for `todo completed` vs `todo created` over time. Key engagement and productivity metric.
3. **Todo churn (deletions)** — Trends chart for `todo deleted` over time. High deletion rates may indicate users are abandoning tasks.
4. **Completion funnel** — Funnel from `todo created` → `todo completed`. Shows what percentage of created todos get finished.
5. **Reopen rate** — Trends chart for `todo reopened`. Indicates users who revisit completed tasks.

Visit [https://us.posthog.com](https://us.posthog.com) to create these insights and add them to a new dashboard named "Analytics basics".

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

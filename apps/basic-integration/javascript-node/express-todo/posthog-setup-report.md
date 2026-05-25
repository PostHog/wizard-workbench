<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Express todo API. The `posthog-node` SDK was installed and initialized in `index.js`, with event capture added to every route that creates, updates, or deletes data. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (so API callers can pass their PostHog distinct ID for cross-client correlation), falling back to `req.ip`. Error tracking via `captureException` was added to an Express error handler middleware. A graceful shutdown hook ensures all queued events are flushed when the server stops.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fires when a user creates a new todo item via `POST /api/todos`. Properties: `todo_id`, `title`. | `index.js` |
| `todo_updated` | Fires when a user updates a todo's title or completion status via `PATCH /api/todos/:id`. Properties: `todo_id`, `updated_fields`. | `index.js` |
| `todo_completed` | Fires when a user marks a todo as completed (completed transitions to `true`) via `PATCH /api/todos/:id`. Properties: `todo_id`, `title`. | `index.js` |
| `todo_deleted` | Fires when a user deletes a todo item via `DELETE /api/todos/:id`. Properties: `todo_id`, `title`. | `index.js` |

## Next steps

Once your app is running and events are flowing, head to PostHog to build insights. Suggested dashboard: **"Analytics basics"** with these five insights:

1. **Todos created over time** — Trends chart for `todo_created` (daily/weekly volume).
2. **Todos completed over time** — Trends chart for `todo_completed`.
3. **Completion rate** — Formula insight: `todo_completed / todo_created * 100` to track what fraction of created todos get finished.
4. **Todos deleted over time** — Trends chart for `todo_deleted` to watch for churn signals.
5. **Create → Complete funnel** — Funnel from `todo_created` → `todo_completed` to measure how often new todos get finished.

Create the dashboard at [/dashboard](/dashboard) and add insights from [/insights](/insights).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

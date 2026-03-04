<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express todo API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. Event tracking was added to all mutating routes (create, update, delete), and an Express error handler was added to automatically capture exceptions with `captureException`. The `distinct_id` is read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), enabling correlation with frontend client sessions.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | A new todo item was created via POST /api/todos | `index.js` |
| `todo_updated` | An existing todo item was updated (title or completed status) via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | A todo item was deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

We've prepared insights for you to add to a new **"Analytics basics"** dashboard in PostHog. Visit your [PostHog dashboards](https://us.posthog.com/project/2/dashboards) to create one with the following suggested insights:

1. **Todo Creation Trend** — Daily count of `todo_created` events over the last 30 days (TrendsQuery)
2. **Todo Completion Rate** — Ratio of todos updated with `completed: true` vs total `todo_updated` events
3. **Todo Deletion Trend** — Weekly count of `todo_deleted` events to spot churn in task management
4. **Create → Delete Funnel** — Funnel from `todo_created` to `todo_deleted` to understand todo lifecycle
5. **Active Users by Action** — Unique users (distinct IDs) performing any todo action per day

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

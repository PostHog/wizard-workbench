<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express.js todo API. The `posthog-node` SDK was added as a dependency and initialized in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event capture calls were added to all three mutation route handlers, an Express error-handling middleware was added to capture exceptions automatically, and graceful shutdown handlers ensure queued events are flushed before the process exits. The `.env` file was created with the PostHog project token and host.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via POST /api/todos | `index.js` |
| `todo_updated` | Fired when an existing todo item is updated (title or completed status) via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | Fired when a todo item is deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

To monitor user behavior with these events, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Todo creation trend** — Line chart of `todo_created` over time, to track usage growth.
2. **Todo completion rate** — Funnel from `todo_created` → `todo_updated` (where `completed = true`), showing how many created todos are actually completed.
3. **Todo deletion rate** — Bar chart comparing `todo_created` vs `todo_deleted` per day, to understand churn of tasks.
4. **Active users** — Unique users (distinct IDs) performing any todo action per day.
5. **Error rate** — Trend of `$exception` events over time to monitor application stability.

You can create this dashboard at: https://us.posthog.com/project/238460/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

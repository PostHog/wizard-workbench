<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the Express Todo API (`index.js`). The `posthog-node` SDK is initialized with your project API key and host from environment variables. Three business-critical events are now tracked across all data-mutating routes: todo creation, updates, and deletions. An Express error handler middleware captures unhandled exceptions via `posthog.captureException()`. Graceful shutdown on `SIGINT`/`SIGTERM` ensures all queued events are flushed before the process exits.

The `distinctId` for each event is resolved from the `X-POSTHOG-DISTINCT-ID` request header (enabling correlation with a frontend PostHog session) or falls back to the client IP address.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created via POST /api/todos | `index.js` |
| `todo_updated` | An existing todo item was updated via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | A todo item was deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

We've instrumented the key user actions in your todo API. To explore your analytics, visit your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

1. **Todo Creation Rate** — Trends of `todo_created` over time (daily/weekly)
2. **Todo Update Rate** — Trends of `todo_updated` over time, with breakdown by `todo_completed`
3. **Todo Deletion Rate** — Trends of `todo_deleted` over time (churn indicator)
4. **Todo CRUD Activity** — Bar chart comparing volume of all three events side-by-side
5. **Todo Lifecycle Funnel** — Funnel from `todo_created` → `todo_updated` → `todo_deleted`

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Insights Explorer](https://us.posthog.com/project/2/insights)
- [Event Explorer — todo_created](https://us.posthog.com/project/2/events?event=todo_created)
- [Event Explorer — todo_updated](https://us.posthog.com/project/2/events?event=todo_updated)
- [Event Explorer — todo_deleted](https://us.posthog.com/project/2/events?event=todo_deleted)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

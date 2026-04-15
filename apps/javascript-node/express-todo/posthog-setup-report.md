<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the Express Todo API (`index.js`) using the `posthog-node` SDK. The integration tracks all mutating todo operations, captures unhandled errors via Express error middleware, and shuts down gracefully on process exit.

Changes made:
- `posthog-node` installed as a dependency
- PostHog client initialized with `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables, with `enableExceptionAutocapture: true`
- Graceful shutdown added via `process.on('SIGINT', ...)`
- Three `posthog.capture()` calls added — one per mutating route
- Express error middleware added to call `posthog.captureException()` on unhandled errors
- `.env` file created with `POSTHOG_API_KEY` and `POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via POST /api/todos | `index.js` |
| `todo_updated` | Fired when a todo item is successfully updated via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | Fired when a todo item is successfully deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor these events. Here are direct links to create each recommended insight:

- **Todo creation volume** (trend of `todo_created` over time): https://us.i.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_created"}]
- **Todo completion rate** (trend of `todo_updated` where `completed=true`): https://us.i.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_updated"}]
- **Todo deletion volume** (trend of `todo_deleted` over time): https://us.i.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"todo_deleted"}]
- **Create → Update → Delete funnel** (conversion funnel across the todo lifecycle): https://us.i.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"todo_created"},{"id":"todo_updated"},{"id":"todo_deleted"}]
- **All dashboards**: https://us.i.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

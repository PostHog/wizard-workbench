<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express Todo API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Event tracking was added to all data-mutating route handlers (POST, PATCH, DELETE). An Express error middleware was added to capture unhandled errors with `captureException`. Graceful shutdown handlers ensure all queued events are flushed before the process exits. The `X-POSTHOG-DISTINCT-ID` request header is used to correlate server-side events with client-side user identity.

| Event Name | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo item is successfully created via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when an existing todo item is updated via `PATCH /api/todos/:id` | `index.js` |
| `todo deleted` | Fired when a todo item is deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

To view analytics for these events, visit your PostHog project and create a dashboard with insights such as:

- **Todo creation trend** – Track how many todos are created over time using a Trends insight on `todo created`
- **Todo completion rate** – Filter `todo updated` events where `completed = true` vs total todos created
- **Todo deletion rate** – Compare `todo deleted` events to `todo created` to understand churn
- **Active users** – Count unique users (by `distinct_id`) across all todo events

You can explore your events at: [https://us.posthog.com/project/238460/events](https://us.posthog.com/project/238460/events)

To identify users, send the `X-POSTHOG-DISTINCT-ID` header with requests from your client application. This will link server-side events to the correct user profile.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

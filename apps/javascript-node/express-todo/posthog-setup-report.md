<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the express-todo Node.js application. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to every route handler that creates, updates, or deletes data. A global Express error handler was added with `posthog.captureException()` for automatic error tracking. Distinct IDs are read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), and session IDs are forwarded from `X-POSTHOG-SESSION-ID`, enabling correlation with client-side PostHog sessions.

| Event | Description | File |
|---|---|---|
| `todo created` | Fired when a user creates a new todo item via `POST /api/todos` | `index.js` |
| `todo updated` | Fired when a user updates a todo item's title or completion status via `PATCH /api/todos/:id` | `index.js` |
| `todo completed` | Fired when a todo item is marked as completed via `PATCH /api/todos/:id` with `completed=true` | `index.js` |
| `todo deleted` | Fired when a user deletes a todo item via `DELETE /api/todos/:id` | `index.js` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog and add the following insights:

- **Todo creation trend** — Trend of `todo created` events over time
- **Todo completion rate** — Funnel: `todo created` → `todo completed`
- **Todo deletion rate** — Trend of `todo deleted` events over time
- **Most active users** — Breakdown of `todo created` by `distinct_id`
- **Todo update activity** — Trend of `todo updated` events over time

Create a new dashboard at: [https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

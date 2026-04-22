<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK was added to this Express.js todo API. A singleton PostHog client is initialized at startup using environment variables, and `posthog.capture()` calls have been added to every route that creates, updates, or deletes data. A dedicated `todo_completed` event fires when a todo transitions from incomplete to complete — useful for funnel analysis. An Express error-handler middleware uses `posthog.captureException()` for automatic error tracking, and the server shuts down the PostHog client gracefully on `SIGTERM`.

User correlation is supported via the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers, which clients can set to link server-side events to front-end sessions and replays.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo is successfully created via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when a todo's title or completed status is changed via `PATCH /api/todos/:id` | `index.js` |
| `todo_completed` | Fired when a todo transitions from incomplete to complete via `PATCH /api/todos/:id` | `index.js` |
| `todo_deleted` | Fired when a todo is deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

Visit your PostHog project to explore the events being captured and build insights:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Events Explorer](https://us.posthog.com/project/2/events)
- Suggested insights to create:
  - **Todo creation rate** — trend of `todo_created` over time
  - **Completion funnel** — `todo_created` → `todo_completed`
  - **Deletion rate** — trend of `todo_deleted` over time
  - **Update activity** — trend of `todo_updated` over time
  - **Error rate** — trend of `$exception` events from `captureException`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Express Todo API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture was added to all write routes (create, update, delete), an Express error-handler middleware was added to capture exceptions via `posthog.captureException`, and a graceful shutdown handler ensures all queued events are flushed when the server stops. PostHog credentials are stored in `.env` and referenced via environment variables — no keys are hardcoded.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when a user successfully updates a todo item (title or completed status) via `PATCH /api/todos/:id` | `index.js` |
| `todo_deleted` | Fired when a user successfully deletes a todo item via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've linked an existing analytics dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1195065) — overview of core todo app analytics including todo creation, completion funnel, and deletion trends
  - [Todo Activity Overview](https://us.posthog.com/project/2/insights/X1GrGf0U) — daily trend of todos created, completed, and deleted
  - [Todo Completion Funnel](https://us.posthog.com/project/2/insights/wQrzcm5m) — funnel from creating a todo to completing it
  - [Server-Side Events](https://us.posthog.com/project/2/insights/zM32JSUp) — trend of server-side todo operations
  - [API Errors](https://us.posthog.com/project/2/insights/jwfkweV1) — track server-side API errors

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

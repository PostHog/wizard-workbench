<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into your Express Todo API. The `posthog-node` SDK was installed, environment variables were configured, and event tracking was added across all mutating API routes in `index.js`.

## Changes made

### `index.js`
- Imported `PostHog` from `posthog-node`
- Added `initializePosthog()` factory function that reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables, with a graceful no-op if the key is absent
- Enabled `enableExceptionAutocapture: true` on the PostHog client
- Added a `trackEvent(distinctId, event, properties)` helper used by all routes
- Added `posthog.capture()` calls in `POST /api/todos`, `PATCH /api/todos/:id`, and `DELETE /api/todos/:id`
- Added a global Express error handler middleware that calls `posthog.captureException(err, userId)` to track unhandled errors
- Added graceful shutdown (`SIGINT`/`SIGTERM`) that calls `await posthog.shutdown()` to flush pending events before exit
- Distinct IDs are resolved from `req.body.user_id`, `req.query.user_id`, or the `X-POSTHOG-DISTINCT-ID` header, falling back to `'anonymous'`

### `.env`
- `POSTHOG_API_KEY` and `POSTHOG_HOST` written via wizard-tools (`.gitignore` coverage ensured)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via `POST /api/todos`. Properties: `todo_id`, `title_length`, `total_todos` | `index.js` |
| `todo_updated` | Fired when a todo item is updated (title or completed status) via `PATCH /api/todos/:id`. Properties: `todo_id`, `completed` | `index.js` |
| `todo_deleted` | Fired when a todo item is deleted via `DELETE /api/todos/:id`. Properties: `todo_id`, `was_completed` | `index.js` |

## Next steps

To view your analytics, create an "Analytics basics" dashboard in PostHog with insights such as:

- **Todos created over time** — trend of `todo_created` events
- **Todo completion rate** — `todo_updated` events filtered by `completed = true`
- **Todos deleted over time** — trend of `todo_deleted` events
- **Deleted: completed vs incomplete** — breakdown of `todo_deleted` by `was_completed`
- **Overall event volume** — combined trend of all three events

You can create this dashboard at: https://us.posthog.com/project/238460/dashboard/new

> **Note:** Dashboard creation requires a PostHog Personal API Key with `dashboard:write` scope. The project ingestion key (`phc_...`) used here is write-only for event capture and cannot authenticate the management API.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

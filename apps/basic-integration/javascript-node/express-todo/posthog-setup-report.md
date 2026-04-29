<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Express Todo API. Here's a summary of the changes made:

- Installed `posthog-node` as a dependency
- Initialized a `PostHog` client in `index.js` using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, with `enableExceptionAutocapture: true`
- Added a per-request middleware that reads `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers (sent by a PostHog-instrumented frontend) to set context for all downstream capture calls, falling back to `req.ip`
- Added `posthog.capture()` calls in the POST, PATCH, and DELETE route handlers for all meaningful data-mutating actions
- Added an Express error handler middleware that calls `posthog.captureException(err)` so all unhandled server errors are sent to PostHog error tracking
- Added a `SIGTERM` handler that calls `posthog.shutdown()` for a clean process exit
- Created a `.env` file with `POSTHOG_API_KEY` and `POSTHOG_HOST` (added to `.gitignore`)

| Event name | Description | File |
|---|---|---|
| `todo created` | Fired when a new todo item is successfully created via POST /api/todos | `index.js` |
| `todo updated` | Fired when a todo item's title or completion status is updated via PATCH /api/todos/:id | `index.js` |
| `todo completed` | Fired when a todo item is marked as completed (completed=true) via PATCH /api/todos/:id | `index.js` |
| `todo deleted` | Fired when a todo item is successfully deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog using the links below:

1. **[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)** — Create a new dashboard, then add the insights below.
2. **[Todo creation trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","type":"events","name":"todo created"}],"date_from":"-30d"})** — Daily count of todos created over the last 30 days.
3. **[Todo completion trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo completed","type":"events","name":"todo completed"}],"date_from":"-30d"})** — Daily count of todos marked as completed over the last 30 days.
4. **[Todo deletion trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo deleted","type":"events","name":"todo deleted"}],"date_from":"-30d"})** — Daily count of todos deleted over the last 30 days.
5. **[Create-to-complete funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"todo created","type":"events","name":"todo created"},{"id":"todo completed","type":"events","name":"todo completed"}],"date_from":"-30d"})** — Funnel showing how many created todos get completed.
6. **[All todo actions breakdown](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"todo created","type":"events","name":"todo created"},{"id":"todo updated","type":"events","name":"todo updated"},{"id":"todo completed","type":"events","name":"todo completed"},{"id":"todo deleted","type":"events","name":"todo deleted"}],"date_from":"-30d"})** — Side-by-side trend of all four todo actions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

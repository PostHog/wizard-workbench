<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express todo API with PostHog analytics. The `posthog-node` SDK was installed and a singleton client was initialized in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event capture calls were added to every mutating route handler, a `todo_completed` conversion event fires specifically when a todo transitions from incomplete to complete, and an Express error-handling middleware captures uncaught exceptions via `posthog.captureException`. Graceful shutdown handlers for `SIGINT` and `SIGTERM` ensure queued events are flushed before the process exits. User identity is resolved per-request from the `X-POSTHOG-DISTINCT-ID` header (falling back to the client IP), so callers can correlate server-side events with their client-side PostHog session.

| Event | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created | index.js |
| `todo_updated` | A todo item's title or completion status was updated | index.js |
| `todo_completed` | A todo item was marked as completed | index.js |
| `todo_deleted` | A todo item was deleted | index.js |

## Next steps

Dashboard and insight creation via the PostHog MCP requires `dashboard:write`, `insight:write`, and `query:read` scopes that were not available on the current API key. To create an "Analytics basics" dashboard manually, go to [PostHog Dashboards](/dashboards) and add insights for:

- **Todo creation trend** — trends chart of `todo_created` over time
- **Todo completion trend** — trends chart of `todo_completed` over time
- **Todo deletion trend** — trends chart of `todo_deleted` over time
- **Completion funnel** — funnel from `todo_created` → `todo_completed`
- **Active users** — unique users capturing any todo event per day

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

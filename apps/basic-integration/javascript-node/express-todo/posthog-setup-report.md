<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into this Express todo API. The `posthog-node` SDK (v5.38.x) was installed and configured in `index.js`. The PostHog client is initialized with environment variables, and the `setupExpressRequestContext` middleware is registered before routes so that any `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers forwarded from a client-side PostHog integration are automatically used as the event's distinct ID and session ID. The `setupExpressErrorHandler` middleware is registered after all routes to send unhandled Express errors to PostHog Error Tracking. Capture calls were added in the POST, PATCH, and DELETE route handlers. A graceful shutdown hook ensures all queued events are flushed when the process receives `SIGINT`.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo is successfully created via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when a todo is updated (title or completed status) via `PATCH /api/todos/:id` | `index.js` |
| `todo_completed` | Fired specifically when a todo's `completed` field is set to `true` via `PATCH /api/todos/:id` | `index.js` |
| `todo_deleted` | Fired when a todo is deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

Dashboard creation requires `dashboard:write` and `insight:write` MCP scopes that were not available in this session. You can create the dashboard manually in PostHog using the events above:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named **"Analytics basics (wizard)"**
- [PostHog Insights](https://us.posthog.com/project/2/insights) — suggested insights to add:
  1. **Todo creation trend** — Trends chart of `todo_created` over time
  2. **Todo completion trend** — Trends chart of `todo_completed` over time
  3. **Todo deletion trend** — Trends chart of `todo_deleted` over time
  4. **Creation → Completion funnel** — Funnel from `todo_created` → `todo_completed`
  5. **All todo events** — Stacked trends chart showing all four events side-by-side

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

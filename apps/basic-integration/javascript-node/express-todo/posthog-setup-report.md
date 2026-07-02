<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express.js todo API. The `posthog-node` package was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. The `setupExpressRequestContext` middleware was registered before all routes so that any `X-POSTHOG-SESSION-ID` or `X-POSTHOG-DISTINCT-ID` headers sent by a frontend client are automatically picked up. The `setupExpressErrorHandler` was registered after all routes to capture unhandled Express errors into PostHog Error Tracking. `posthog.capture()` calls were added to every mutating route (create, update, delete), and graceful shutdown hooks (`SIGINT`/`SIGTERM`) ensure queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user creates a new todo item via POST /api/todos | `index.js` |
| `todo_updated` | Fired when a user updates an existing todo item (title or completed status) via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | Fired when a user deletes a todo item via DELETE /api/todos/:id | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1792344)
- [Todo creations over time](https://us.i.posthog.com/project/483112/insights/itmEpslu)
- [Todo updates over time](https://us.i.posthog.com/project/483112/insights/7GLgiBm1)
- [Todo deletions over time](https://us.i.posthog.com/project/483112/insights/AYBZ36aZ)
- [Todo actions breakdown](https://us.i.posthog.com/project/483112/insights/A2jXj69I)
- [Todo completion funnel](https://us.i.posthog.com/project/483112/insights/mlUsI4Ay)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

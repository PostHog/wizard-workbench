<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express.js Todo API. The `posthog-node` SDK (v5.40.0) was installed and wired into `index.js`. PostHog is initialised once at startup using environment variables and the Express middleware helpers `setupExpressRequestContext` and `setupExpressErrorHandler` are registered to automatically correlate server events with any frontend PostHog session and to forward unhandled Express errors to PostHog Error Tracking. Capture calls were added to every mutating route handler (`POST`, `PATCH`, `DELETE`). A `getDistinctId` helper reads the `x-posthog-distinct-id` header (set automatically by posthog-js when `tracing_headers` is configured on the frontend) and falls back to the request IP for API-only clients. Graceful shutdown via `posthog.shutdown()` is wired to the `SIGTERM` signal so no buffered events are dropped on process exit.

| Event | Description | File |
|-------|-------------|------|
| `todo_created` | A user creates a new todo item via the API. | `index.js` |
| `todo_updated` | A user updates an existing todo item's title or completion status. | `index.js` |
| `todo_completed` | A user marks a todo item as completed. | `index.js` |
| `todo_deleted` | A user deletes a todo item. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812919)
- [Todo creations over time](https://us.posthog.com/project/483112/insights/OCoaF4aR) — daily trend of `todo_created`
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/DEkjBgRK) — conversion from `todo_created` → `todo_completed`
- [Todo deletions over time](https://us.posthog.com/project/483112/insights/ixyNbVOm) — daily trend of `todo_deleted`
- [Todo actions overview](https://us.posthog.com/project/483112/insights/LuMl5V9K) — all three action series side-by-side
- [Daily active todo users](https://us.posthog.com/project/483112/insights/9Ri8bXPl) — DAU based on `todo_created`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

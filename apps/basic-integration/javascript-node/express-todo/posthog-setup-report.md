<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Express.js todo API. The `posthog-node` SDK was installed and configured in `index.js` using environment variables. The `setupExpressRequestContext` middleware was registered before all routes to automatically attach request metadata (`$current_url`, `$request_method`, `$request_path`, `$user_agent`, `$ip`) and to read `x-posthog-distinct-id` / `x-posthog-session-id` headers from clients. The `setupExpressErrorHandler` middleware was registered after all routes to capture unhandled Express errors via PostHog error tracking. A graceful `SIGTERM` handler calls `posthog.shutdown()` to flush all queued events before the process exits.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created via POST /api/todos | `index.js` |
| `todo_updated` | An existing todo item's title or completed status was updated via PATCH /api/todos/:id | `index.js` |
| `todo_completed` | A todo item was marked as completed via PATCH /api/todos/:id | `index.js` |
| `todo_deleted` | A todo item was deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/482900/dashboard/1750459)
- [Total todos created](https://us.posthog.com/project/482900/insights/9527094)
- [Todo completion rate](https://us.posthog.com/project/482900/insights/9527097)
- [Todo deletion rate](https://us.posthog.com/project/482900/insights/9527113)
- [All todo actions over time](https://us.posthog.com/project/482900/insights/9527116)
- [Todo actions breakdown: update vs complete vs delete](https://us.posthog.com/project/482900/insights/9527158)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

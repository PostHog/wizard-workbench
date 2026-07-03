<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration of this Express.js todo API. The `posthog-node` SDK was installed and initialized with `enableExceptionAutocapture: true`. The Express request-context middleware (`setupExpressRequestContext`) was registered before all routes so that every captured event automatically carries request metadata (`$current_url`, `$request_method`, `$request_path`, `$user_agent`, `$ip`). The Express error handler (`setupExpressErrorHandler`) was registered after all routes to forward unhandled errors to PostHog Error Tracking. A `distinctId` is resolved per request from the `x-posthog-distinct-id` header (passed by a PostHog JS frontend if present) or falls back to `req.ip`. Graceful shutdown via `SIGINT` flushes any queued events before the process exits. Environment variables are loaded via the `--env-file=.env` flag added to the `start` and `dev` npm scripts.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via POST /api/todos. | `index.js` |
| `todo_completed` | Fired when a todo item is marked as completed via PATCH /api/todos/:id. | `index.js` |
| `todo_updated` | Fired when a todo item's title is changed via PATCH /api/todos/:id. | `index.js` |
| `todo_deleted` | Fired when a todo item is deleted via DELETE /api/todos/:id. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793462)
- [Todo actions over time (wizard)](https://us.posthog.com/project/483112/insights/D4RzpW2w)
- [Todos created (wizard)](https://us.posthog.com/project/483112/insights/YYMzQbyt)
- [Todo completion rate (wizard)](https://us.posthog.com/project/483112/insights/NBozWWB6)
- [Todo deletions (wizard)](https://us.posthog.com/project/483112/insights/xTFFhLfs)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

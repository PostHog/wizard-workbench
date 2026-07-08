<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express todo API. The `posthog-node` SDK was installed and wired into `index.js` using the built-in Express helpers: `setupExpressRequestContext` registers request-scoped context (reading `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers automatically) before the routes, and `setupExpressErrorHandler` captures unhandled Express errors after the routes. Four action events are captured across the todo lifecycle, and a graceful shutdown handler flushes all queued events on `SIGINT`.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fires when a new todo item is successfully created via POST /api/todos | `index.js` |
| `todo updated` | Fires when an existing todo item's title is updated via PATCH /api/todos/:id | `index.js` |
| `todo completed` | Fires when a todo item is marked as completed via PATCH /api/todos/:id | `index.js` |
| `todo deleted` | Fires when a todo item is permanently deleted via DELETE /api/todos/:id | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816734)
- [Todo creations over time (wizard)](https://us.posthog.com/project/483112/insights/pRXVaJsZ)
- [Todo actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/gqndcf29)
- [Todo completion funnel (wizard)](https://us.posthog.com/project/483112/insights/sWG3ciTE)
- [Todo deletion rate (wizard)](https://us.posthog.com/project/483112/insights/MtRnBZGk)
- [Total todos completed (wizard)](https://us.posthog.com/project/483112/insights/g7P1XKgH)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

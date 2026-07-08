# PostHog post-wizard report

The wizard has completed a full integration of PostHog into this Express todo API. The `posthog-node` SDK is initialized in `index.js` with `setupExpressRequestContext` (reads `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers from requests so server events correlate with any frontend session) and `setupExpressErrorHandler` (automatically captures unhandled Express errors to PostHog Error Tracking). Capture calls were added to every mutation route — create, update, and delete — with contextual properties on each event. The server shuts down cleanly via a `SIGINT` handler that flushes pending events before exiting.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created via POST /api/todos. | `index.js` |
| `todo_updated` | An existing todo item was updated (title or completion status) via PATCH /api/todos/:id. | `index.js` |
| `todo_deleted` | A todo item was deleted via DELETE /api/todos/:id. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818032)
- [Todos created over time](https://us.posthog.com/project/483112/insights/IM9v7yl8)
- [Todo activity comparison](https://us.posthog.com/project/483112/insights/gRE0lwst)
- [Total todos created](https://us.posthog.com/project/483112/insights/xuehqZX8)
- [Todos deleted over time](https://us.posthog.com/project/483112/insights/48aJPXKi)
- [Todo creation to deletion funnel](https://us.posthog.com/project/483112/insights/mpEtl0lu)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

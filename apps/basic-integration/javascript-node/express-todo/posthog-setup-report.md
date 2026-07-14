# PostHog post-wizard report

The wizard has completed a server-side PostHog integration for this Express todo API. It installed `posthog-node`, added environment-based PostHog initialization, wired Express request and error context helpers, captured analytics events for todo create/update/delete API operations, and added error capture plus graceful shutdown flushing.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Captures when a new todo is successfully created through the API. | `index.js` |
| `todo_updated` | Captures when an existing todo is updated through the API. | `index.js` |
| `todo_deleted` | Captures when an existing todo is deleted through the API. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846651)
- [Todos created over time (wizard)](https://us.posthog.com/project/483112/insights/Yhrb2eEv)
- [Todo lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/UhNEPuqI)
- [Todo updates by completion change (wizard)](https://us.posthog.com/project/483112/insights/rYb1I2rt)
- [Todos deleted over time (wizard)](https://us.posthog.com/project/483112/insights/eB9Fn6xM)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

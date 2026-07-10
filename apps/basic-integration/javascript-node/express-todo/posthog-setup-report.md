<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Express todo API with PostHog. It installed the `posthog-node` SDK, initialized a shared server-side PostHog client using environment variables, enabled Express request context plus exception autocapture, added lifecycle event capture for listing, creating, updating, and deleting todos, and created a dashboard with saved insights for the instrumented events.

| Event name | Description | File |
| --- | --- | --- |
| `todos_listed` | Tracks when the todo list API is requested to view current items. | `index.js` |
| `todo_created` | Tracks when a new todo is successfully created through the API. | `index.js` |
| `todo_updated` | Tracks when an existing todo is modified through the API. | `index.js` |
| `todo_deleted` | Tracks when a todo is successfully deleted through the API. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1830994)
- [Todo creations over time (wizard)](https://us.posthog.com/project/483112/insights/PEXcmdPt)
- [Todo lifecycle volume (wizard)](https://us.posthog.com/project/483112/insights/tJ8FI0vu)
- [Todo listing requests (wizard)](https://us.posthog.com/project/483112/insights/jQ2FfFPJ)
- [Todo creation funnel (wizard)](https://us.posthog.com/project/483112/insights/7ZmIIFzZ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

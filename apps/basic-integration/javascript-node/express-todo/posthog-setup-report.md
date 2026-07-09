<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express todo API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. The Express middleware helpers `setupExpressRequestContext` and `setupExpressErrorHandler` were added to automatically attach request context to all events and capture Express errors in PostHog Error Tracking. Capture calls were added to each mutating route handler to track business-critical todo actions, with a special `todo_completed` event that fires only when a todo transitions from incomplete to complete.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created via the API. | `index.js` |
| `todo_updated` | An existing todo item's title or completion status was updated. | `index.js` |
| `todo_completed` | A todo item was marked as completed. | `index.js` |
| `todo_deleted` | A todo item was deleted from the list. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1824422)
- [Todo creations over time](https://us.posthog.com/project/483112/insights/43Z65Wo7)
- [Todo completion funnel](https://us.posthog.com/project/483112/insights/w1ummGNL)
- [Todo deletions over time](https://us.posthog.com/project/483112/insights/itob9Is8)
- [All todo actions breakdown](https://us.posthog.com/project/483112/insights/t6O1X8lx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

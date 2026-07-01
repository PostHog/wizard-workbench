<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Express Todo API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Capture calls were added to every mutating route (create, update, delete), a dedicated `todo_completed` event is fired when a todo transitions from incomplete to complete, and an Express error-handling middleware captures uncaught exceptions via `captureException`. Graceful shutdown hooks ensure all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `todo_created` | Fired when a user successfully creates a new todo item. | `index.js` |
| `todo_updated` | Fired when a user updates an existing todo item's title or completion status. | `index.js` |
| `todo_completed` | Fired when a user marks a todo item as completed. | `index.js` |
| `todo_deleted` | Fired when a user deletes a todo item. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787310)
- [Todos Created](https://us.posthog.com/project/483112/insights/9742816)
- [Todo Completion Funnel](https://us.posthog.com/project/483112/insights/9742852)
- [Todos Deleted](https://us.posthog.com/project/483112/insights/9742842)
- [Todos Updated](https://us.posthog.com/project/483112/insights/9742843)
- [Todo Activity Overview](https://us.posthog.com/project/483112/insights/9742846)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

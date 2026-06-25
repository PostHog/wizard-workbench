<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Express Todo API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Capture calls were added to the POST, PATCH, and DELETE route handlers to track todo lifecycle events. A dedicated `todo_completed` event fires when a todo transitions from incomplete to complete. An Express error middleware was added to capture unhandled server errors via `posthog.captureException()`. A `SIGINT` handler ensures the SDK flushes all buffered events cleanly on process exit. The distinct ID is read from the `X-PostHog-Distinct-Id` request header (defaulting to `'anonymous'`), enabling correlation with client-side sessions.

| Event Name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was created via the API. | index.js |
| `todo_updated` | An existing todo item's title or completion status was updated. | index.js |
| `todo_completed` | A todo item was marked as completed. | index.js |
| `todo_deleted` | A todo item was permanently deleted. | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1761038)
  - Todos Created Over Time
  - Todos Completed Over Time
  - Todo Deletion Rate
  - Todo Completion Funnel
  - Todo Actions Breakdown

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

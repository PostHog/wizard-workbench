<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express todo API. The `posthog-node` SDK was installed and a PostHog client was initialized in `index.js` using environment variables. Event capture calls were added to all three data-mutating route handlers (create, update, delete), an Express error-handling middleware was added to capture unhandled exceptions via `captureException`, and graceful shutdown hooks ensure buffered events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fired when a user successfully creates a new todo item. | `index.js` |
| `todo updated` | Fired when a user updates a todo's title or completion status. | `index.js` |
| `todo deleted` | Fired when a user deletes a todo item. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1777402)
  - Total todos created over time
  - Todo completion rate
  - Todo deletion rate
  - Most active users by todos created
  - Funnel: todo created → todo completed

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

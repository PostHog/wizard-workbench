# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog's `posthog-node` SDK has been installed and wired into `index.js`. The client is initialized using environment variables, with exception autocapture enabled. Capture calls are placed in every mutating route handler (create, update, delete for contacts and groups), and `captureException` is called in the top-level error handler. Graceful shutdown is handled on `SIGINT` and `SIGTERM` so all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via the API. | `index.js` |
| `contact updated` | Fired when an existing contact's details are patched. | `index.js` |
| `contact deleted` | Fired when a contact is removed from the system. | `index.js` |
| `group created` | Fired when a new contact group is created. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1831036)
- [Contacts created over time (wizard)](https://us.posthog.com/project/483112/insights/nUX8UU31)
- [Contact event volume (wizard)](https://us.posthog.com/project/483112/insights/7xtCu8vC)
- [Contact lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/jIevsfM7)
- [Contact deletions over time (wizard)](https://us.posthog.com/project/483112/insights/BfIfSfOC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

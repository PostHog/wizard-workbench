# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the koa-notes Koa.js API. The `posthog-node` SDK was installed and a shared client instance was added to `index.js`. Six events are now captured across all CRUD routes for folders and notes, with contextual properties on each. Koa's `app.on('error')` handler forwards unhandled errors to PostHog Exception Autocapture. Graceful shutdown via `SIGINT`/`SIGTERM` ensures queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `folder created` | Tracks when a user successfully creates a new folder. | `index.js` |
| `folder deleted` | Tracks when a user successfully deletes a folder. | `index.js` |
| `note created` | Tracks when a user successfully creates a new note. | `index.js` |
| `note updated` | Tracks when a user successfully updates an existing note. | `index.js` |
| `note deleted` | Tracks when a user successfully deletes a note. | `index.js` |
| `notes searched` | Tracks when a user searches notes by keyword. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818129)
- [Note creations over time (wizard)](https://us.posthog.com/project/483112/insights/H53MIt1M)
- [Note engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/X6VbAuOw)
- [Search usage over time (wizard)](https://us.posthog.com/project/483112/insights/0HKxxW2c)
- [Folder activity (wizard)](https://us.posthog.com/project/483112/insights/KO84wkzM)
- [Note deletion (churn) over time (wizard)](https://us.posthog.com/project/483112/insights/y4kpSXB3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

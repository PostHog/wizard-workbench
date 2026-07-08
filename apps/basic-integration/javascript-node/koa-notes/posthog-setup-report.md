# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Koa Notes API. `posthog-node` was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Six events are captured across all mutating route handlers (folder and note CRUD plus note search). A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` header for frontend correlation, falling back to the client IP. Koa's `app.on('error')` handler forwards uncaught errors to PostHog via `captureException`. A graceful `SIGINT` shutdown flushes any queued events before the process exits. Credentials are stored in `.env` and referenced via `process.env`.

| Event | Description | File |
|---|---|---|
| `note_created` | A new note was successfully created in a folder. | `index.js` |
| `note_updated` | An existing note's title, content, or folder was updated. | `index.js` |
| `note_deleted` | A note was deleted. | `index.js` |
| `note_searched` | A user searched for notes by keyword. | `index.js` |
| `folder_created` | A new folder was successfully created. | `index.js` |
| `folder_deleted` | A folder was deleted and its notes were moved to General. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816735)
- [Note activity over time](https://us.posthog.com/project/483112/insights/md59eWvr)
- [Note creation funnel](https://us.posthog.com/project/483112/insights/PpOR78CA)
- [Folder management over time](https://us.posthog.com/project/483112/insights/C8CTITNU)
- [Note search usage](https://us.posthog.com/project/483112/insights/754ElpG3)
- [Note lifecycle: created vs deleted](https://us.posthog.com/project/483112/insights/seO9hW0I)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

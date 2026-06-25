<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa.js notes API with PostHog analytics. A PostHog client is initialized in `index.js` using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. Capture calls were added to every route that creates, updates, or deletes data (folders and notes), plus the notes search endpoint. An application-level error handler (`app.on('error')`) captures unhandled exceptions via `posthog.captureException()`. Graceful shutdown handlers for `SIGINT` and `SIGTERM` flush any queued events before the process exits. The `package.json` start scripts were updated to load `.env` automatically via Node.js's built-in `--env-file` flag.

| Event name | Description | File |
|---|---|---|
| `folder_created` | A user created a new folder via the API. | `index.js` |
| `folder_deleted` | A user deleted a folder, moving its notes to the General folder. | `index.js` |
| `note_created` | A user created a new note in a folder. | `index.js` |
| `note_updated` | A user edited an existing note's title, content, or folder. | `index.js` |
| `note_deleted` | A user deleted a note from the application. | `index.js` |
| `notes_searched` | A user searched notes by keyword query. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761150)
- [Note Creation Trend](https://us.i.posthog.com/project/483112/insights/gufstUe2)
- [Note Actions Breakdown](https://us.i.posthog.com/project/483112/insights/Wv5hYLCu)
- [Folder Management Activity](https://us.i.posthog.com/project/483112/insights/9Y8yuK64)
- [Search Usage Trend](https://us.i.posthog.com/project/483112/insights/FmH1HMUh)
- [Note Lifecycle Funnel](https://us.i.posthog.com/project/483112/insights/IFoksMiC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

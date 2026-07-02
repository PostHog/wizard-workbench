<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Koa notes API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Six events are now captured across all meaningful CRUD routes (notes and folders), with contextual properties on each event. The Koa application error handler (`app.on('error')`) sends exceptions to PostHog via `posthog.captureException()`. A graceful shutdown handler ensures all queued events are flushed when the server stops. Environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`) are loaded from `.env` via Node's built-in `--env-file` flag, which has been added to both the `start` and `dev` scripts in `package.json`.

| Event name | Description | File |
|---|---|---|
| `note created` | A new note is successfully created via POST /api/notes. | `index.js` |
| `note updated` | An existing note is successfully updated via PATCH /api/notes/:id. | `index.js` |
| `note deleted` | A note is successfully deleted via DELETE /api/notes/:id. | `index.js` |
| `folder created` | A new folder is successfully created via POST /api/folders. | `index.js` |
| `folder deleted` | A folder is successfully deleted via DELETE /api/folders/:id. | `index.js` |
| `notes searched` | A user searches notes by keyword via GET /api/notes with a search query. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1792433)
- [Notes created over time](https://us.posthog.com/project/483112/insights/l9IzE32y)
- [Notes deleted over time](https://us.posthog.com/project/483112/insights/yeWgLaVo)
- [Folders created over time](https://us.posthog.com/project/483112/insights/NTRBR4Dt)
- [Notes searched over time](https://us.posthog.com/project/483112/insights/Kwvfvplv)
- [Note lifecycle funnel](https://us.posthog.com/project/483112/insights/fGMRSR2Z)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

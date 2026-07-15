<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Koa Notes API. The `posthog-node` SDK was installed and a singleton client was initialised at startup using environment variables. Six meaningful business events were instrumented across all mutating route handlers in `index.js`. An `app.on('error')` handler now forwards every unhandled Koa error to PostHog exception tracking. Graceful shutdown on `SIGINT`/`SIGTERM` flushes all pending events before the process exits.

| Event name | Description | File |
|------------|-------------|------|
| `note created` | Fired when a new note is successfully created via POST /api/notes. | index.js |
| `note updated` | Fired when an existing note is successfully updated via PATCH /api/notes/:id. | index.js |
| `note deleted` | Fired when a note is successfully deleted via DELETE /api/notes/:id. | index.js |
| `folder created` | Fired when a new folder is successfully created via POST /api/folders. | index.js |
| `folder deleted` | Fired when a folder is successfully deleted via DELETE /api/folders/:id. | index.js |
| `notes searched` | Fired when a user searches notes via GET /api/notes with a search query parameter. | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1853501)
- [Notes created over time (wizard)](https://us.i.posthog.com/project/483112/insights/9GJGsHaY)
- [Note lifecycle funnel (wizard)](https://us.i.posthog.com/project/483112/insights/gnSjD8Rt)
- [Folder activity (wizard)](https://us.i.posthog.com/project/483112/insights/jNABy5x5)
- [Notes searched over time (wizard)](https://us.i.posthog.com/project/483112/insights/OEkUz8ql)
- [All notes events (wizard)](https://us.i.posthog.com/project/483112/insights/r8CizztY)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set (`POSTHOG_API_KEY`, `POSTHOG_HOST`).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

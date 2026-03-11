<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Koa notes API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Capture calls were added to all mutating API routes (create/update/delete for both notes and folders). The `X-POSTHOG-DISTINCT-ID` request header is used to correlate server-side events with client-side users. A Koa `app.on('error')` handler captures unhandled exceptions via `captureException`, and a `SIGINT` handler ensures a graceful shutdown with event flushing.

| Event | Description | File |
|---|---|---|
| `folder_created` | A new folder is created via POST /api/folders | index.js |
| `folder_deleted` | A folder is deleted via DELETE /api/folders/:id | index.js |
| `note_created` | A new note is created via POST /api/notes | index.js |
| `note_updated` | A note is updated via PATCH /api/notes/:id | index.js |
| `note_deleted` | A note is deleted via DELETE /api/notes/:id | index.js |

## Next steps

To monitor user behavior with the events now instrumented, create an **Analytics basics** dashboard in PostHog at https://us.posthog.com/project/2/dashboard with the following insights:

1. **Notes created over time** — Trends chart on `note_created` to track content creation velocity
2. **Note lifecycle funnel** — Funnel: `note_created` → `note_updated` → `note_deleted` to see content churn
3. **Folder management** — Trends chart comparing `folder_created` vs `folder_deleted` to watch organization behavior
4. **Active note creators** — Unique users performing `note_created` per week (DAU/WAU proxy)
5. **Note deletion rate** — Ratio of `note_deleted` to `note_created` as a churn signal

To correlate server-side events with a frontend user session, pass the PostHog `distinct_id` and session ID from the client in the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers on every API request.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

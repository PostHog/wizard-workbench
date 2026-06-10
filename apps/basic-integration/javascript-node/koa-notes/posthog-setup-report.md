<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa notes API. The `posthog-node` SDK was installed and a `PostHog` client was initialized in `index.js` using environment variables for the API key and host. Event capture calls were added to every route that creates, updates, or deletes data. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` header (for frontend correlation) and falls back to the client IP. An error handler on `app.on('error', ...)` captures all unhandled Koa errors via `captureException`. Graceful shutdown via `posthog.shutdown()` is wired to `SIGINT` and `SIGTERM` so no events are lost when the server stops.

| Event | Description | File |
|---|---|---|
| `folder created` | A new folder is created via POST /api/folders | index.js |
| `folder deleted` | A folder is deleted via DELETE /api/folders/:id | index.js |
| `note created` | A new note is created via POST /api/notes | index.js |
| `note updated` | A note is updated via PATCH /api/notes/:id | index.js |
| `note deleted` | A note is deleted via DELETE /api/notes/:id | index.js |
| `note searched` | A user searches notes via GET /api/notes with a search query | index.js |

## Next steps

We've prepared the following insights for an "Analytics basics (wizard)" dashboard. You can create them in PostHog using the links below:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"**
- [Note creation trend](https://us.posthog.com/project/2/insights/new) — Trends insight for `note created` over time
- [Note activity breakdown](https://us.posthog.com/project/2/insights/new) — Trends insight comparing `note created`, `note updated`, and `note deleted`
- [Note creation to deletion funnel](https://us.posthog.com/project/2/insights/new) — Funnel insight with steps: `note created` → `note updated` → `note deleted`
- [Search usage trend](https://us.posthog.com/project/2/insights/new) — Trends insight for `note searched` over time
- [Folder management](https://us.posthog.com/project/2/insights/new) — Trends insight comparing `folder created` and `folder deleted`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

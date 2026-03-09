<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa.js notes API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to all mutating route handlers (create, update, delete) for both notes and folders. Each event includes contextual properties to support downstream analytics. A Koa `app.on('error')` handler captures uncaught server errors via `posthog.captureException()`. Graceful shutdown on `SIGINT`/`SIGTERM` ensures all queued events are flushed before the process exits. The `X-POSTHOG-DISTINCT-ID` request header is used to correlate server-side events with client-side identities.

| Event name | Description | File |
|---|---|---|
| `note_created` | Fired when a new note is created via POST /api/notes | index.js |
| `note_updated` | Fired when a note is updated via PATCH /api/notes/:id | index.js |
| `note_deleted` | Fired when a note is deleted via DELETE /api/notes/:id | index.js |
| `folder_created` | Fired when a new folder is created via POST /api/folders | index.js |
| `folder_deleted` | Fired when a folder is deleted via DELETE /api/folders/:id | index.js |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

- **Notes Created Over Time** – Trend of `note_created` events to track content creation activity
- **Notes Deleted Over Time** – Trend of `note_deleted` events as a churn signal
- **Note Create → Delete Funnel** – Funnel from `note_created` to `note_deleted` to identify drop-off
- **Folder Created vs Deleted** – Side-by-side trend of `folder_created` and `folder_deleted` for folder lifecycle
- **Notes with Content at Creation** – Breakdown of `note_created` by `has_content` property to measure engagement depth

You can build these at: https://us.posthog.com/project/2/insights/new

To correlate server-side events with a specific user, pass an `X-POSTHOG-DISTINCT-ID` header in your API requests matching the distinct ID set by your frontend PostHog instance.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

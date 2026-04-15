<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the koa-notes Koa.js API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables. Six events are now tracked across all mutating and search routes, error tracking is wired into Koa's `app.on('error')` handler, and the process shuts down cleanly via `posthog.shutdown()` on SIGINT.

A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` header (for client-side correlation) and falls back to the request IP, so server-side events can be correlated with front-end sessions when the header is forwarded.

| Event | Description | File |
|---|---|---|
| `folder_created` | Fired when a user creates a new folder | `index.js` |
| `folder_deleted` | Fired when a user deletes a folder (notes moved to General) | `index.js` |
| `note_created` | Fired when a user creates a new note | `index.js` |
| `note_updated` | Fired when a user updates an existing note | `index.js` |
| `note_deleted` | Fired when a user deletes a note | `index.js` |
| `notes_searched` | Fired when a user searches notes by keyword | `index.js` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following five insights to monitor user behavior:

1. **Note creation over time** — Trends chart for `note_created` — tracks writing activity
2. **Search-to-create funnel** — Funnel from `notes_searched` → `note_created` — measures content discovery conversion
3. **Note deletion rate** — Trends chart for `note_deleted` — tracks churn/content removal
4. **Folder management** — Trends chart comparing `folder_created` vs `folder_deleted` — tracks organizational behavior
5. **Notes updated over time** — Trends chart for `note_updated` — tracks engagement depth

You can create this dashboard at: https://us.i.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

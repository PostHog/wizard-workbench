<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa notes API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Seven events are now captured across all meaningful route handlers. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header so client-side sessions can be correlated with server-side events. Exception autocapture is enabled, errors are forwarded to PostHog via `app.on('error')`, and graceful shutdown is wired up on `SIGINT`/`SIGTERM`.

| Event | Description | File |
|-------|-------------|------|
| `note_created` | Fired when a user successfully creates a new note | `index.js` |
| `note_viewed` | Fired when a user retrieves a specific note by ID — top of the reading conversion funnel | `index.js` |
| `note_updated` | Fired when a user successfully updates a note's title, content, or folder | `index.js` |
| `note_deleted` | Fired when a user successfully deletes a note | `index.js` |
| `folder_created` | Fired when a user successfully creates a new folder | `index.js` |
| `folder_deleted` | Fired when a user successfully deletes a folder (notes are moved to General) | `index.js` |
| `notes_searched` | Fired when a user searches notes by keyword — indicates active engagement | `index.js` |

## Next steps

The PostHog API token in this environment lacks the `query:read`, `dashboard:write`, and `insight:write` scopes needed to create the dashboard automatically. Once your token has those scopes (or you log in at [posthog.com](https://posthog.com)), you can build the recommended "Analytics basics" dashboard using these insights:

- **Notes created over time** — Trends chart on `note_created` to track creation volume
- **Note lifecycle funnel** — Funnel from `note_created` → `note_viewed` → `note_updated` to see note engagement drop-off
- **Notes deleted over time** — Trends chart on `note_deleted` (churn signal)
- **Search usage** — Trends chart on `notes_searched` with `results_count` average to measure search engagement
- **Folder management** — Trends chart combining `folder_created` and `folder_deleted` to track organisational behaviour

You can create these at [/insights](/insights) and group them into a new dashboard at [/dashboards](/dashboards).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

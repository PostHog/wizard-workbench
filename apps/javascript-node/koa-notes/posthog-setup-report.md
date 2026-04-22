<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Koa Notes API. The `posthog-node` SDK was added as a dependency and initialized in `index.js` using environment variables for the API key and host. Event tracking was added to every mutating route (create, update, delete) as well as to note search. Error tracking was wired into Koa's `app.on('error')` handler, and graceful shutdown via SIGINT/SIGTERM was added to ensure buffered events are flushed before the process exits.

| Event | Description | File |
|-------|-------------|------|
| `folder_created` | Fired when a user creates a new folder | `index.js` |
| `folder_deleted` | Fired when a user deletes a folder (notes are moved to General) | `index.js` |
| `note_created` | Fired when a user creates a new note | `index.js` |
| `note_updated` | Fired when a user updates a note's title, content, or folder | `index.js` |
| `note_deleted` | Fired when a user deletes a note | `index.js` |
| `notes_searched` | Fired when a user searches notes using the search query param | `index.js` |

## Next steps

We've set up the following insights and a dashboard for you to keep an eye on user behavior. You can build these in your PostHog project:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboards) — create a new dashboard named "Analytics basics" and add the insights below
- **Note creation trend** — Trends insight on `note_created` over time
- **Note actions funnel** — Funnel from `note_created` → `note_updated` → `note_deleted` to track engagement lifecycle
- **Notes search volume** — Trends insight on `notes_searched` with `results_count` as a property breakdown
- **Folder activity** — Trends insight comparing `folder_created` vs `folder_deleted` over time
- **Error rate** — Trends insight on `$exception` to monitor application errors

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

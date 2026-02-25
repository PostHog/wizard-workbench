<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa.js notes API. The `posthog-node` SDK was installed and initialised in `index.js` using environment variables for the API key and host. A `trackEvent` helper and `initializePosthog` factory function were added following the reference example patterns. Six meaningful business events are now captured across every mutating route, a Koa `app.on('error')` handler captures all unhandled exceptions via `posthog.captureException()`, and a graceful shutdown routine flushes pending events before the process exits.

| Event | Description | File |
|---|---|---|
| `note_created` | Fired when a user successfully creates a new note | `index.js` |
| `note_updated` | Fired when a user updates an existing note's title, content, or folder | `index.js` |
| `note_deleted` | Fired when a user deletes a note | `index.js` |
| `folder_created` | Fired when a user creates a new folder | `index.js` |
| `folder_deleted` | Fired when a user deletes a folder (notes are moved to General) | `index.js` |
| `notes_searched` | Fired when a user searches notes by keyword, capturing search engagement | `index.js` |

## Next steps

To monitor user behaviour based on these events, head to your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Note creation trend** — `note_created` over time (line graph, daily) — spot growth and engagement
- **Note lifecycle funnel** — `note_created` → `note_updated` → `note_deleted` — understand content churn
- **Folder management activity** — `folder_created` vs `folder_deleted` over time — track organisational behaviour
- **Search engagement** — `notes_searched` with `results_count` breakdown — identify zero-result searches
- **Content deletion rate** — `note_deleted` with `note_age_hours` property — detect early-churn patterns

You can build these at: https://us.posthog.com/project/238460/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

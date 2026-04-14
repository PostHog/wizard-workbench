<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Koa notes API. The `posthog-node` SDK was added to `index.js` with a singleton client using environment variables for the API key and host. Event capture calls were added to every mutating route handler (create, update, delete for both notes and folders), plus a search event at the top of the notes search funnel. Error tracking was wired into Koa's `app.on('error')` handler via `posthog.captureException()`, and graceful shutdown was added so buffered events are flushed before the process exits. The `X-POSTHOG-DISTINCT-ID` request header is used to correlate server-side events with client-side sessions.

| Event name | Description | File |
|---|---|---|
| `folder created` | Fired when a user creates a new folder | `index.js` |
| `folder deleted` | Fired when a user deletes a folder (notes moved to General) | `index.js` |
| `note created` | Fired when a user creates a new note | `index.js` |
| `note updated` | Fired when a user updates a note's title, content, or folder | `index.js` |
| `note deleted` | Fired when a user deletes a note | `index.js` |
| `notes searched` | Fired when a user searches notes by keyword (top of funnel) | `index.js` |

## Next steps

To build insights on these events, visit your PostHog project and create a dashboard named **"Analytics basics"** with the following suggested insights:

1. **Note creation trend** — Line chart of `note created` over time, to track growth in content creation.
2. **Notes search → note created funnel** — Funnel from `notes searched` → `note created`, to measure search-to-create conversion.
3. **Note deletion rate** — Bar chart of `note deleted` grouped by day, to monitor churn signals.
4. **Folder activity** — Stacked bar of `folder created` and `folder deleted` over time.
5. **Most-searched queries** — Table insight on `notes searched` broken down by the `query` property.

Dashboard: [Create in PostHog](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

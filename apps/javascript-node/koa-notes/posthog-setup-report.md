<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Koa notes API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header to correlate events with users (falling back to `'anonymous'`). Event capture calls were added to all mutating routes and to the two read routes that carry meaningful user intent (search and folder filtering). An application-level error handler captures exceptions via `posthog.captureException`, and graceful shutdown hooks ensure all queued events are flushed on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `note created` | A new note was successfully created | `index.js` |
| `note updated` | An existing note was successfully updated | `index.js` |
| `note deleted` | A note was successfully deleted | `index.js` |
| `folder created` | A new folder was successfully created | `index.js` |
| `folder deleted` | A folder was successfully deleted (notes moved to General) | `index.js` |
| `notes searched` | User performed a text search across notes | `index.js` |
| `notes filtered by folder` | User filtered notes by folder | `index.js` |

## Next steps

To build the "Analytics basics" dashboard with insights based on these events, open your PostHog project and create a new dashboard. Suggested insights:

1. **Note creation trend** — Total count of `note created` over time (line chart) — tracks writing activity growth.
2. **Note engagement funnel** — Funnel from `note created` → `note updated` → `note deleted` — reveals how notes are used over their lifetime.
3. **Search usage** — Total count of `notes searched` over time — shows how often users rely on search.
4. **Content organisation** — Breakdown of `notes filtered by folder` by `folder_id` property — identifies most-used folders.
5. **Folder churn** — Total count of `folder deleted` over time — flags reorganisation or abandonment patterns.

Navigate to: **https://us.posthog.com/project/2/dashboard**

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

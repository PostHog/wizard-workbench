<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Koa Notes API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (for frontend correlation) and falls back to the client IP. Six business events are now captured across all mutating routes. Errors surfaced via Koa's `app.on('error')` handler are forwarded to `posthog.captureException`. The PostHog client is shut down cleanly on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `folder created` | A new folder is created by a user | `index.js` |
| `folder deleted` | A folder is deleted; notes are moved to General | `index.js` |
| `note created` | A new note is created in a folder | `index.js` |
| `note updated` | An existing note's title, content, or folder is updated | `index.js` |
| `note deleted` | A note is deleted | `index.js` |
| `notes searched` | A user searches notes by keyword | `index.js` |

## Next steps

To explore these events, visit your PostHog project and build insights using the event names above:

- [PostHog Project — Events](https://us.posthog.com/project/238460/events)
- [PostHog Project — Insights](https://us.posthog.com/project/238460/insights)
- [PostHog Project — Dashboards](https://us.posthog.com/project/238460/dashboard)

Suggested insights to create:
1. **Note creation trend** — `note created` over time (line chart)
2. **Note management funnel** — `note created` → `note updated` → `note deleted` (funnel)
3. **Search engagement** — `notes searched` over time with `result_count` breakdown
4. **Folder lifecycle** — `folder created` vs `folder deleted` over time (bar chart)
5. **Active users** — unique users per day across all events (line chart)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

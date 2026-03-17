<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK (v5.28.2) was added to this Hono bookmark API. A PostHog client is initialized at startup using environment variables, and `posthog.capture()` calls were added to all mutating and filtering routes. Error tracking via `posthog.captureException()` was wired into Hono's `onError` handler. Graceful shutdown on `SIGINT`/`SIGTERM` ensures queued events are flushed before the process exits.

Callers can pass `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` request headers to correlate server-side events with client-side sessions.

| Event | Description | File |
|---|---|---|
| `link_saved` | User saves a new bookmark link | `index.js` |
| `link_updated` | User updates an existing bookmark link | `index.js` |
| `link_deleted` | User deletes a bookmark link | `index.js` |
| `link_favorited` | User marks a link as a favorite | `index.js` |
| `links_searched` | User searches or filters their links list | `index.js` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to set up in PostHog. Navigate to your project and create the following insights:

- **Links saved over time** — Trend of `link_saved` events to track growth in saved bookmarks
- **Links deleted over time** — Trend of `link_deleted` events to monitor churn/cleanup
- **Search activity** — Trend of `links_searched` events showing how often users filter their list
- **Link save → favorite funnel** — Funnel from `link_saved` → `link_favorited` to measure content value
- **Top search terms** — Table breakdown of the `search` property on `links_searched` events

You can create a new dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog has been added to the Hono links API with full event tracking, error capture, and graceful shutdown. The `posthog-node` SDK is initialized once at startup and shared across all route handlers. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header so that clients can pass a known user identity and correlate server-side events with any client-side PostHog sessions. All six planned events are captured at the correct points in the request lifecycle. Unhandled errors are forwarded to PostHog via `app.onError` using `captureException`. The process exits cleanly on `SIGINT`/`SIGTERM` by calling `posthog.shutdown()`.

| Event | Description | File |
|-------|-------------|------|
| `link_saved` | User saves a new bookmark link | index.js |
| `link_updated` | User updates an existing bookmark link (title, url, description, or tags) | index.js |
| `link_favorited` | User marks a link as a favorite | index.js |
| `link_deleted` | User deletes a bookmark link | index.js |
| `links_searched` | User searches links by keyword | index.js |
| `links_filtered` | User filters links by tag or favorites | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Create an "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard) — suggested insights:
  - **Links saved over time** — Trends chart on `link_saved`
  - **Link deletion rate** — Trends chart on `link_deleted`
  - **Favorite actions** — Trends chart on `link_favorited`
  - **Search activity** — Trends chart on `links_searched`
  - **Save → Delete funnel** — Funnel from `link_saved` → `link_deleted` to measure link churn

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the `hono-links` Hono.js bookmark API. The `posthog-node` SDK (v5.29.5) was installed and initialized in `index.js` using environment variables. Event capture was added to all mutating and search routes. Exception tracking was wired into Hono's global error handler. Graceful shutdown on `SIGINT`/`SIGTERM` ensures events are flushed before the process exits.

The `x-posthog-distinct-id` request header is used to correlate events with a specific user — clients should pass this header with a stable user or session identifier to link server-side events to front-end sessions.

| Event | Description | File |
|---|---|---|
| `link_created` | A new bookmark link was saved via `POST /api/links` | `index.js` |
| `link_updated` | An existing link was modified via `PATCH /api/links/:id` | `index.js` |
| `link_deleted` | A link was removed via `DELETE /api/links/:id` | `index.js` |
| `link_favorited` | A link was marked as a favorite via `PATCH /api/links/:id` | `index.js` |
| `links_searched` | Links were filtered by tag, keyword search, or favorites filter via `GET /api/links` | `index.js` |

## Next steps

To create an "Analytics basics" dashboard in PostHog with insights for these events, visit your PostHog project and create insights such as:

- **Links created over time** — Trend of `link_created` events to track bookmark growth
- **Link deletion rate** — Trend of `link_deleted` vs `link_created` to monitor churn
- **Favoriting funnel** — Funnel from `link_created` → `link_favorited` to see engagement
- **Search usage** — Trend of `links_searched` showing how often users filter their links
- **Top search terms** — Breakdown of `links_searched` by the `search` property

You can create these at: https://us.i.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Hono.js links/bookmark API. The `posthog-node` SDK was added to `index.js`, which is the single application file. PostHog is initialized at startup using environment variables, and event capture calls were added to every mutating route. Error tracking via `captureException` was added through Hono's `app.onError` handler, and graceful shutdown was wired up via `SIGINT`/`SIGTERM` process signals. Since this API has no authentication layer, a `distinctId` is resolved per-request from the `X-POSTHOG-DISTINCT-ID` header (allowing frontend correlation), falling back to the forwarded IP or `'anonymous'`.

| Event name | Description | File |
|---|---|---|
| `link saved` | A new link/bookmark is successfully saved via `POST /api/links` | `index.js` |
| `link updated` | An existing link is updated via `PATCH /api/links/:id` | `index.js` |
| `link deleted` | A link is deleted via `DELETE /api/links/:id` | `index.js` |
| `link favorited` | A link is marked as favorite (favorite toggled to true) via `PATCH /api/links/:id` | `index.js` |
| `links searched` | Links are searched using the `search` query param on `GET /api/links` | `index.js` |
| `links filtered by tag` | Links are filtered by a tag using the `tag` query param on `GET /api/links` | `index.js` |

## Next steps

To explore and analyze these events in PostHog, you can build the following insights manually in your project:

- **Links saved over time** — Trend insight on `link saved`, grouped by day. Shows content creation volume.
- **Link deletions vs. saves funnel** — Funnel from `link saved` → `link deleted`. Helps identify churn/regret rate.
- **Top search queries** — Table insight on `links searched`, breaking down by `query` property.
- **Most used tag filters** — Table insight on `links filtered by tag`, breaking down by `tag` property.
- **Favorite rate** — Trend insight on `link favorited` vs. `link saved` to measure engagement depth.

You can create these at: https://us.posthog.com/project/238460/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hono-links Node.js API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Six events are now captured across the key API routes, and a graceful shutdown handler ensures all queued events are flushed when the server stops.

| Event name | Description | File |
|---|---|---|
| `link saved` | Fired when a new bookmark is created via `POST /api/links` | `index.js` |
| `link updated` | Fired when a bookmark is edited via `PATCH /api/links/:id` | `index.js` |
| `link deleted` | Fired when a bookmark is removed via `DELETE /api/links/:id` | `index.js` |
| `links searched` | Fired when links are searched via `GET /api/links?search=` | `index.js` |
| `links filtered by tag` | Fired when links are filtered by tag via `GET /api/links?tag=` | `index.js` |
| `favorites viewed` | Fired when favorites are listed via `GET /api/links?favorites=true` | `index.js` |

## Next steps

We've set up event tracking across all key routes. To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Links saved over time** — Trend of `link saved` events. Shows growth in bookmark creation.
2. **Link management funnel** — Funnel: `link saved` → `link updated` → `link deleted`. Tracks the full lifecycle.
3. **Link deletions over time** — Trend of `link deleted` events. A churn signal if this spikes.
4. **Search and discovery usage** — Trend of `links searched` + `links filtered by tag`. Shows how users find content.
5. **Favorites engagement** — Trend of `favorites viewed`. Measures engagement with the favorites feature.

Create your dashboard here: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

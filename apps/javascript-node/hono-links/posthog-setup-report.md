<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hono-links Hono/Node.js application. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to five route handlers covering the core user actions: saving, updating, favoriting, deleting, and searching links. Each capture call includes contextual properties (IDs, titles, field lists, etc.) and reads `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` headers to correlate server-side events with client-side sessions. Graceful shutdown handlers flush any pending events on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `link saved` | Fired when a user saves a new link via POST /api/links | `index.js` |
| `link updated` | Fired when a user updates an existing link's fields via PATCH /api/links/:id | `index.js` |
| `link favorited` | Fired when a user toggles the favorite status of a link via PATCH /api/links/:id | `index.js` |
| `link deleted` | Fired when a user deletes a link via DELETE /api/links/:id | `index.js` |
| `links searched` | Fired when a user searches or filters links via GET /api/links with a query | `index.js` |

## Next steps

To explore your analytics, head to PostHog and create an "Analytics basics" dashboard with these suggested insights:

- **Links saved over time** — Trends chart for `link saved` to track growth in bookmarks
- **Deletion rate** — Trends chart comparing `link saved` vs `link deleted` to track churn
- **Save → Search funnel** — Funnel from `link saved` → `links searched` to see engagement after saving
- **Most-favorited sessions** — Breakdown of `link favorited` by `favorited` property (true/false)
- **Top search queries** — Property breakdown of `links searched` by `search_query`

[Open PostHog dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hono-links Node.js API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Five meaningful business events are now tracked across the route handlers, with properties providing context for each action. Exception capture is wired into the mutating routes, and graceful shutdown ensures queued events are flushed on `SIGINT`/`SIGTERM`. The `X-POSTHOG-DISTINCT-ID` request header is read on every request so that callers can pass their client-side distinct ID and correlate server-side events with frontend behavior.

| Event | Description | File |
|---|---|---|
| `link saved` | Fired when a user saves a new bookmark link via POST /api/links | index.js |
| `link updated` | Fired when a user updates an existing link's properties via PATCH /api/links/:id | index.js |
| `link deleted` | Fired when a user deletes a link via DELETE /api/links/:id | index.js |
| `link favorited` | Fired when a user marks a link as favorite or unfavorites it via PATCH /api/links/:id | index.js |
| `links searched` | Fired when a user searches or filters the links list via GET /api/links with search/tag params | index.js |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)) with the following suggested insights:

1. **Link saves over time** — Trend of `link saved` events to track bookmark creation activity
2. **Link management funnel** — Funnel from `link saved` → `link updated` → `link deleted` to understand retention vs churn of saved links
3. **Search & discovery usage** — Trend of `links searched` to understand how often users explore their library
4. **Favorites adoption** — Trend of `link favorited` (filter `favorited = true`) to see how many users use the favorites feature
5. **Top link actions by user** — Breakdown of `link saved`, `link updated`, `link deleted` by `distinct_id` to identify power users

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

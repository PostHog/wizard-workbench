# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hono Links API. The `posthog-node` package (v5.26.0) was installed and the `index.js` file was updated to initialize a PostHog client from environment variables, capture six custom events across all mutating and search routes, capture unhandled exceptions via `app.onError()`, and perform a graceful shutdown (flushing queued events) on SIGINT/SIGTERM. A `.env` file was created with `POSTHOG_API_KEY` and `POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `link_saved` | Fired when a user saves a new bookmark link via `POST /api/links` | index.js |
| `link_updated` | Fired when a user updates an existing link's properties via `PATCH /api/links/:id` | index.js |
| `link_favorited` | Fired when a user marks a link as favorite (favorite toggled to true) via `PATCH /api/links/:id` | index.js |
| `link_deleted` | Fired when a user deletes a link via `DELETE /api/links/:id` | index.js |
| `links_searched` | Fired when a user searches links using the `search` query param on `GET /api/links` | index.js |
| `links_filtered_by_tag` | Fired when a user filters links by tag on `GET /api/links` | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/238460/dashboards) — visit your dashboards to create an "Analytics basics" dashboard with insights for link saves over time, search usage, tag filter activity, link deletions, and the link save → favorite conversion funnel.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

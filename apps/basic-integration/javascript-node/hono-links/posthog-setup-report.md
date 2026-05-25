<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the `hono-links` Hono Node.js API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event tracking was added to all link mutation routes — save, update, favorite, and delete — each with contextual properties. Exception capture was added around async route handlers to track server errors. Graceful shutdown hooks (`SIGINT`/`SIGTERM`) ensure all queued events are flushed before the process exits.

| Event | Description | File |
|-------|-------------|------|
| `link saved` | A new bookmark link is successfully created | `index.js` |
| `link updated` | An existing bookmark link is successfully updated | `index.js` |
| `link favorited` | A bookmark link is marked as a favorite | `index.js` |
| `link deleted` | A bookmark link is permanently deleted | `index.js` |

## Next steps

Build insights and a dashboard to monitor user behavior in your PostHog project:

- [Create a new "Analytics basics" dashboard](/dashboard)
- [Trends: Link saves over time](/insights/new#insight=TRENDS) — track `link saved` to see link creation volume
- [Trends: Link deletions over time](/insights/new#insight=TRENDS) — track `link deleted` to spot churn signals
- [Trends: Favorite rate](/insights/new#insight=TRENDS) — compare `link favorited` vs `link saved` to see engagement depth
- [Trends: Links updated over time](/insights/new#insight=TRENDS) — track `link updated` to measure ongoing engagement
- [Error tracking](/error_tracking) — view captured exceptions from API route handlers

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

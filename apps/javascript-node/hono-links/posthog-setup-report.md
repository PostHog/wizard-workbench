<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the hono-links Hono Node.js bookmark API. The `posthog-node` SDK (v5.28.0) was installed and the `index.js` file was instrumented with event tracking for all data-mutating API routes, exception capture on the global error handler, and graceful shutdown on process exit. Environment variables `POSTHOG_KEY` and `POSTHOG_HOST` were written to `.env` and are referenced in code instead of hardcoded values.

The integration reads the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers on each write route so that events can be correlated with client-side PostHog sessions when a frontend is present.

| Event name | Description | File |
|---|---|---|
| `link_saved` | User saved a new bookmark link | `index.js` |
| `link_updated` | User updated an existing bookmark link (url, title, tags, favorite, etc.) | `index.js` |
| `link_deleted` | User deleted a bookmark link | `index.js` |
| `link_favorited` | User marked or unmarked a link as favorite (fires alongside `link_updated` when the `favorite` field changes) | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics — create in PostHog](https://us.posthog.com/project/2/dashboards)
  - Suggested insights to add:
    1. **Link saves over time** — Trends chart on `link_saved` (daily, last 30 days)
    2. **Link lifecycle funnel** — Funnel: `link_saved` → `link_updated` → `link_deleted` (measures churn of bookmarks)
    3. **Favorite engagement** — Trends: `link_favorited` filtered to `favorited = true` vs `false` (shows toggle behavior)
    4. **Link management activity** — Stacked trends: `link_saved`, `link_updated`, `link_deleted` side-by-side
    5. **Most active users** — Breakdown of `link_saved` by `distinct_id` (identifies power users)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

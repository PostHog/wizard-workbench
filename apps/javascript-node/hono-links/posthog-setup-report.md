<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog's `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Five business events are now tracked across all mutating route handlers, a search event fires when filters are applied, and a global Hono error handler calls `captureException` for uncaught errors. Graceful shutdown on `SIGINT`/`SIGTERM` flushes any queued events before the process exits. A distinct ID helper reads the `X-PostHog-Distinct-ID` header (for client-correlation) and falls back to the forwarded IP, keeping frontend and backend events linkable.

| Event | Description | File |
|---|---|---|
| `link saved` | A new link/bookmark was saved (includes url, title, tags, has_description) | `index.js` |
| `link updated` | An existing link was modified (includes link_id, fields_updated) | `index.js` |
| `link favorited` | A link's favorite status was toggled (includes link_id, favorited boolean) | `index.js` |
| `link deleted` | A link was permanently deleted (includes link_id, url, title, tags) | `index.js` |
| `links searched` | Links were filtered by tag, keyword, or favorites (includes filter params, results_count) | `index.js` |

## Next steps

We've outlined key insights to build on PostHog for your link-saver API. Visit the links below to create them:

- **Links saved over time** (Trends) — track growth in bookmark creation:
  [https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"link saved"}]](https://us.posthog.com/project/2/insights/new)

- **Link deletion rate vs. saves** (Trends) — monitor churn against new saves:
  [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

- **Save → Favorite conversion funnel** (Funnels) — see how often saved links get favorited:
  [https://us.posthog.com/project/2/insights/new?insight=FUNNELS](https://us.posthog.com/project/2/insights/new)

- **Most common search filters** (Breakdown) — which tags or queries users search most:
  [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

- **Error rate** (Trends) — track `$exception` events for API health:
  [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

To create the "Analytics basics" dashboard, visit:
[https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

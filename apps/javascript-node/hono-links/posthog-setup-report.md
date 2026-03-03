<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hono links API. The `posthog-node` SDK was installed and configured in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). A `getDistinctId()` helper extracts the user ID from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), enabling correlation with any frontend sessions. Six business events are now captured across the API routes, covering the full link lifecycle. A Hono `onError` handler captures unexpected exceptions via `posthog.captureException()`, and graceful shutdown on `SIGINT`/`SIGTERM` ensures all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `link saved` | A new link is saved to the collection | `index.js` |
| `link updated` | An existing link's properties (url, title, description, tags) are updated | `index.js` |
| `link favorited` | A link is marked as a favorite | `index.js` |
| `link unfavorited` | A link is removed from favorites | `index.js` |
| `link deleted` | A link is permanently removed from the collection | `index.js` |
| `links searched` | A user searches or filters the link list | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog ([https://us.i.posthog.com/project/2/dashboards](https://us.i.posthog.com/project/2/dashboards)) with these recommended insights:

1. **Links saved over time** — Trend of `link saved` events. Tracks growth and engagement.
2. **Links deleted over time** — Trend of `link deleted` events. Measures churn of saved content.
3. **Search & filter activity** — Trend of `links searched` events. Shows how often users search/filter.
4. **Favorite actions** — Stacked trend of `link favorited` vs `link unfavorited`. Tracks engagement depth.
5. **Save-to-delete funnel** — Funnel from `link saved` → `link deleted`. Measures how quickly links are removed.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

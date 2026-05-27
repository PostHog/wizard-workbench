<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Hono.js bookmark/link-saver API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Four events are now tracked across the API's mutation and search routes. A graceful shutdown handler flushes all pending events on `SIGINT`/`SIGTERM`. The `X-POSTHOG-DISTINCT-ID` request header is read on every instrumented route so that callers who include it will have their events attributed to their PostHog identity; unauthenticated requests fall back to `"anonymous"`.

| Event name | Description | File |
|---|---|---|
| `link saved` | A new link is saved to the bookmark list | `index.js` |
| `link updated` | An existing link's properties are modified (url, title, description, tags, or favorite) | `index.js` |
| `link deleted` | A link is removed from the bookmark list | `index.js` |
| `links searched` | A search query is used to filter the links list | `index.js` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to monitor user behavior:

1. **Links saved over time** — Trend of `link saved` events. Tracks growth in bookmark creation.
2. **Links deleted over time** — Trend of `link deleted` events. A churn signal: high deletion relative to saves may indicate poor link quality or user dissatisfaction.
3. **Save vs. delete ratio** — Formula insight comparing `link saved` (A) to `link deleted` (B) as `A/B`. Helps spot periods of net negative engagement.
4. **Search activity** — Trend of `links searched` events with breakdown by `query` property. Shows what users are looking for.
5. **Link update activity** — Trend of `link updated` events, broken down by `updated_fields` to see which properties change most often (e.g., favorites vs. tags).

Create these at: [/insights](/insights) | Dashboard view: [/dashboard](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to the Hono-based bookmark/link saver API (`index.js`) with:

- **SDK initialization** using `posthog-node` with `enableExceptionAutocapture: true`
- **Distinct ID handling** via the `X-PostHog-Distinct-ID` request header (falls back to `'anonymous'`), allowing clients to pass their own PostHog identity for cross-domain correlation
- **Event capture** on all meaningful data-mutation routes
- **Error tracking** via Hono's `app.onError()` middleware using `posthog.captureException()`
- **Graceful shutdown** with `posthog.shutdown()` on `SIGINT` and `SIGTERM` so queued events are always flushed

| Event name | Description | File |
|---|---|---|
| `link saved` | A new link/bookmark was successfully saved | `index.js` |
| `link updated` | An existing link was updated (url, title, description, or tags changed) | `index.js` |
| `link favorited` | A link was marked or unmarked as a favorite | `index.js` |
| `link deleted` | A link was permanently deleted | `index.js` |
| `links searched` | User searched or filtered links by tag, keyword, or favorites flag | `index.js` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog to monitor these events. Here are five insights to create:

1. **Links Saved Over Time** — Trend of `link saved` events by day. Tracks growth in bookmarks being added.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

2. **Link Lifecycle Funnel** — Funnel: `link saved` → `link updated` → `link deleted`. Shows what fraction of saved links get edited vs. deleted.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

3. **Favorites Rate** — Trend of `link favorited` events. Tracks how often users are starring bookmarks.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Search & Filter Usage** — Trend of `links searched` events broken down by `tag`, `search`, or `favorites_only` properties. Shows how actively users navigate their library.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Deletion Rate** — Trend of `link deleted` events. High deletion rates relative to saves can signal churn from the library.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

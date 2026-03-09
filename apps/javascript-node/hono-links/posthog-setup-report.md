<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event tracking was added to all mutating and filtering API routes: saving, updating, and deleting links, and searching/filtering the link list. The PostHog client reads its API key and host from environment variables (`POSTHOG_KEY` and `POSTHOG_HOST`), which have been written to `.env`. Graceful shutdown handlers flush any remaining events on `SIGINT`/`SIGTERM`. The `x-posthog-distinct-id` request header is used to correlate events with a user when provided by the client, falling back to `'anonymous'`.

| Event name | Description | File |
|---|---|---|
| `link saved` | Fired when a user successfully saves a new bookmark/link | `index.js` |
| `link updated` | Fired when a user updates an existing link's details (url, title, description, tags, or favorite status) | `index.js` |
| `link deleted` | Fired when a user deletes a saved link | `index.js` |
| `links searched` | Fired when a user searches or filters links using tag, search query, or favorites filter | `index.js` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog with these suggested insights:

- **Link saves over time** — Trend of `link saved` events (core conversion metric)
- **Link management funnel** — Funnel: `link saved` → `link updated` → `link deleted` (retention/churn signal)
- **Search activity** — Trend of `links searched` events, broken down by `tag`, `search`, and `favorites_only` properties
- **Links saved vs deleted** — Side-by-side trend comparing `link saved` and `link deleted` to spot churn
- **Most used search filters** — Breakdown of `links searched` by property type (tag filter vs text search vs favorites)

Visit [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

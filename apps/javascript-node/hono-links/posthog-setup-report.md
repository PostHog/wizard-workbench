<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hono-links Hono/Node.js bookmark API.

**Changes made to `index.js`:**
- Imported `PostHog` from `posthog-node` and initialized the client using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, with `enableExceptionAutocapture: true`
- Added `posthog.capture()` calls in five route handlers to track meaningful user actions
- Added `app.onError()` middleware calling `posthog.captureException()` for unhandled errors
- Added `SIGINT`/`SIGTERM` signal handlers that call `posthog.shutdown()` before exiting, ensuring all queued events are flushed

The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), so client-side PostHog sessions can be correlated with server-side events.

**Environment variables added to `.env`:**
- `POSTHOG_API_KEY` — your PostHog project token
- `POSTHOG_HOST` — your PostHog instance host

| Event | Description | File |
|---|---|---|
| `link_saved` | Fired when a user successfully saves a new bookmark link | `index.js` |
| `link_updated` | Fired when a user updates an existing link's properties | `index.js` |
| `link_favorited` | Fired when a user marks a link as favorite (toggled to true) | `index.js` |
| `link_deleted` | Fired when a user deletes a bookmark link | `index.js` |
| `links_searched` | Fired when a user searches links by keyword | `index.js` |
| `links_filtered_by_tag` | Fired when a user filters links by a specific tag | `index.js` |

## Next steps

We've designed the following insights for an **"Analytics basics"** dashboard. Create it at https://us.i.posthog.com/project/2/dashboards and add these insights:

1. **Links saved over time** — Trend chart of `link_saved` events. Shows growth in content being bookmarked.
2. **Link deletions over time** — Trend chart of `link_deleted` events. High churn signal if spikes appear.
3. **Save → Update → Delete funnel** — Funnel: `link_saved` → `link_updated` → `link_deleted`. Shows the lifecycle of a bookmark.
4. **Search activity over time** — Trend chart of `links_searched` with `query` as a breakdown property.
5. **Tag filter usage** — Trend chart of `links_filtered_by_tag` broken down by `tag` property. Shows which tags are most active.

To view your events in PostHog:
- **Events explorer:** https://us.i.posthog.com/project/2/events
- **Insights:** https://us.i.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

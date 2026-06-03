<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Hono links bookmark API. The `posthog-node` SDK (v5.35.13) was installed and a PostHog client is initialized in `index.js` with `enableExceptionAutocapture: true`. Five events are now captured across all mutating and search routes, using the `x-user-id` request header as the distinct ID (falling back to `'anonymous'`). Graceful shutdown is wired to `SIGINT` and `SIGTERM` so queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `link_saved` | Fired when a user saves a new bookmark link with a URL, title, optional tags, and description | `index.js` |
| `link_updated` | Fired when a user updates an existing bookmark's URL, title, description, or tags | `index.js` |
| `link_favorited` | Fired when a user marks or unmarks a link as a favorite | `index.js` |
| `link_deleted` | Fired when a user permanently deletes a saved link | `index.js` |
| `links_searched` | Fired when a user searches or filters the link list by keyword, tag, or favorites-only filter | `index.js` |

## Next steps

We were unable to automatically create PostHog insights and a dashboard due to API scope limitations on the current key. You can create the "Analytics basics" dashboard manually in PostHog with the following recommended insights:

1. **Links saved over time** — Trends chart for `link_saved`, giving you a pulse on how many bookmarks users are creating day by day.
2. **Link deletion rate** — Trends chart for `link_deleted` alongside `link_saved` to spot churn (users deleting links faster than they add them).
3. **Search usage** — Trends chart for `links_searched` broken down by `tag_filter` to see which tags are most searched.
4. **Favorite toggle funnel** — Funnel from `link_saved` → `link_favorited` to measure what fraction of saved links get favorited.
5. **Content engagement breakdown** — Trends chart for `link_updated` broken down by `updated_fields` to see which fields users edit most often.

Visit [Dashboards](/dashboard) in PostHog to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

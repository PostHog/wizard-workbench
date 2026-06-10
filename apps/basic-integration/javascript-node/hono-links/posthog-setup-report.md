<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hono Links bookmark saver API. The `posthog-node` SDK was installed and a shared client was initialized in `index.js` with exception auto-capture enabled. Four business events are now captured across the API's mutation and search routes, each carrying contextual properties. Session and distinct-ID correlation headers (`x-posthog-distinct-id`, `x-posthog-session-id`) are read from incoming requests so client-side PostHog sessions can be stitched to server-side events. Graceful shutdown ensures all queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `link saved` | A new bookmark link is saved; includes `link_id`, `url`, `title`, `tag_count`, `has_description` | `index.js` |
| `link updated` | An existing link is updated; includes `link_id`, `updated_fields`, `is_favorite` | `index.js` |
| `link deleted` | A bookmark link is permanently deleted; includes `link_id` | `index.js` |
| `links searched` | Links are filtered by tag, keyword, or favorites; includes `tag`, `search`, `favorites_only`, `result_count` | `index.js` |

## Next steps

Create a dashboard and insights in PostHog to monitor the link saver's key metrics. The five recommended insights are:

1. **Links saved over time** — Trends chart on `link saved` to see bookmark creation volume
2. **Links deleted over time** — Trends chart on `link deleted` to monitor churn/removal behavior
3. **Links searched over time** — Trends chart on `links searched` to gauge discovery usage
4. **Search result counts** — Average of `result_count` property on `links searched` to understand search effectiveness
5. **Favorite links marked** — Trends chart on `link updated` filtered to `updated_fields` containing `favorite`

Use these links to set up your dashboard:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"**
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

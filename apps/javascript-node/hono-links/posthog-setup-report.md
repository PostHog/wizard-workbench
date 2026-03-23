<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **hono-links** Node.js application. The `posthog-node` SDK was installed, initialized with environment variables, and five event capture calls were added to the Hono route handlers covering all meaningful user actions: saving, updating, favoriting, deleting links, and searching/filtering. Exception autocapture is enabled, and graceful shutdown is handled on SIGINT/SIGTERM.

| Event name | Description | File |
|---|---|---|
| `link_saved` | A new link/bookmark was saved by a user | `index.js` |
| `link_updated` | An existing link was updated (URL, title, description, or tags changed) | `index.js` |
| `link_favorited` | A link was marked or unmarked as a favorite | `index.js` |
| `link_deleted` | A link was deleted by a user | `index.js` |
| `links_searched` | User searched or filtered the links list (search query or tag filter applied) | `index.js` |

## Next steps

To create an **Analytics basics** dashboard in PostHog with insights for these events, visit your PostHog project and create the following insights manually (or use a personal API key with the PostHog API):

- **Links saved over time** — Trend of `link_saved` events to track growth
- **Link saves → favorites funnel** — Funnel from `link_saved` → `link_favorited` to measure engagement
- **Link deletions over time** — Trend of `link_deleted` events to monitor churn
- **Search usage** — Trend of `links_searched` events to measure discoverability
- **Top URLs saved** — Breakdown of `link_saved` by `url` property

Visit your PostHog project at: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

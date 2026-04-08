<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Five business-critical events are now captured across all mutating API routes, and a Fastify `setErrorHandler` sends unhandled exceptions to PostHog. Graceful shutdown (`SIGINT`/`SIGTERM`) ensures no events are lost when the server stops.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a new blog post is successfully created | `index.js` |
| `post_updated` | Fired when an existing blog post is updated (title, body, or published status) | `index.js` |
| `post_published` | Fired when a blog post's `published` flag is set to `true` | `index.js` |
| `post_deleted` | Fired when a blog post and its associated comments are deleted | `index.js` |
| `comment_added` | Fired when a comment is successfully added to a blog post | `index.js` |

## Next steps

We recommend building an **Analytics basics** dashboard in PostHog with the following five insights to monitor user behaviour and content health:

1. **Posts created over time** — Trends chart for `post_created`, grouped by day/week
2. **Comments added over time** — Trends chart for `comment_added`, grouped by day/week
3. **Post publish funnel** — Funnel from `post_created` → `post_published` to measure conversion rate
4. **Post deletion rate** — Trends chart for `post_deleted` to watch churn/content removal
5. **Top authors by posts** — Breakdown of `post_created` by the `author` property

You can create this dashboard at:
https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

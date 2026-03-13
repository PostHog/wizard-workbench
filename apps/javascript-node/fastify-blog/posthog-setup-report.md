<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Four business-critical events are now tracked across all mutating routes, a Fastify `setErrorHandler` captures all unhandled exceptions via `captureException`, and graceful shutdown handlers ensure queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a new blog post is successfully created | `index.js` |
| `post_updated` | Fired when an existing blog post is updated (title, body, or published status) | `index.js` |
| `post_deleted` | Fired when a blog post and its associated comments are deleted | `index.js` |
| `comment_created` | Fired when a new comment is successfully added to a post | `index.js` |

## Next steps

To explore these events in PostHog, create an **"Analytics basics"** dashboard and add insights such as:

- **Posts created over time** — Trend for `post_created` to track content creation velocity
- **Comments created over time** — Trend for `comment_created` to measure engagement
- **Content lifecycle funnel** — Funnel from `post_created` → `post_updated` → `post_deleted`
- **Top authors** — Breakdown of `post_created` by `distinctId` to identify most active authors
- **Errors over time** — Trend for `$exception` events to monitor application health

You can create dashboards and insights in your [PostHog project](https://us.posthog.com/project/2/dashboards).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

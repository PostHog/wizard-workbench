# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fastify blog API. The `posthog-node` SDK was installed and configured in `index.js` with environment variable–based credentials. Event capture calls were added to all mutating route handlers (create post, publish post, delete post, add comment), an error handler was wired up to forward exceptions to PostHog, and a graceful shutdown hook ensures all queued events are flushed on SIGTERM.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a new blog post is successfully created | `index.js` |
| `post_published` | Fired when a blog post is published (published field set to true via PATCH) | `index.js` |
| `post_deleted` | Fired when a blog post and its comments are deleted | `index.js` |
| `comment_added` | Fired when a comment is successfully added to a blog post | `index.js` |

## Next steps

To explore your analytics, head to your PostHog project and create insights for:

- **Posts created over time** — trend of `post_created` events to monitor content growth
- **Post-to-publish funnel** — funnel from `post_created` → `post_published` to track author completion rate
- **Post deletions** — trend of `post_deleted` events to spot content churn
- **Comment engagement** — trend of `comment_added` events to measure reader participation
- **Active authors** — unique users (by `distinctId`) firing `post_created` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

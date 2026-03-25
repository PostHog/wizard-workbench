<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Five business-critical events are now tracked across the blog's write operations, a Fastify error handler captures unhandled exceptions, and graceful shutdown handlers ensure all queued events are flushed on process exit.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post updated` | Fired when a user successfully updates an existing blog post (title, body, or published status) | `index.js` |
| `post published` | Fired when a post's published status is set to true — top of the content publishing funnel | `index.js` |
| `post deleted` | Fired when a user deletes a blog post (and its comments) | `index.js` |
| `comment created` | Fired when a user successfully adds a comment to a post | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/238460/dashboards](https://us.posthog.com/project/238460/dashboards)) with the following suggested insights:

1. **Post creation trend** — Trend of `post created` over time to track content production velocity.
2. **Post-to-publish funnel** — Funnel from `post created` → `post published` to measure how many drafts get published.
3. **Engagement: comments per post** — Trend of `comment created` events to track reader engagement.
4. **Post deletion rate** — Trend of `post deleted` to monitor churn of content.
5. **Top authors** — Breakdown of `post created` by `author` property to identify the most active contributors.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

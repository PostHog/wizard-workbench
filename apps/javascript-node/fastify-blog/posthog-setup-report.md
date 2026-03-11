<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fastify blog API. The `posthog-node` SDK (v5.28.1) was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Four business-value events are captured across the API's write routes: post creation, post update, post deletion, and comment submission. Error tracking is wired into Fastify's `setErrorHandler`, capturing all unhandled route errors with full stack traces. Graceful shutdown via `posthog.shutdown()` is registered on `SIGINT` and `SIGTERM` to ensure all queued events are flushed before the process exits. Credentials are stored in `.env` and referenced via `process.env.POSTHOG_KEY` and `process.env.POSTHOG_HOST` — never hardcoded.

| Event Name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post_updated` | Fired when a user successfully updates an existing blog post | `index.js` |
| `post_deleted` | Fired when a user successfully deletes a blog post | `index.js` |
| `comment_added` | Fired when a user successfully adds a comment to a blog post | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboards) — navigate to **Dashboards** and create a new "Analytics basics" dashboard with the insights below
- **Post creation volume** — Trend of `post_created` events over time to track content production rate
- **Content engagement funnel** — Funnel from `post_created` → `comment_added` to measure reader engagement rate
- **Post churn signal** — Trend of `post_deleted` events to identify content removal patterns
- **Publishing activity** — Trend of `post_updated` with `published=true` filter to track go-live rate
- **Active authors** — Unique users (by `distinctId`) triggering `post_created` per week to measure contributor growth

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

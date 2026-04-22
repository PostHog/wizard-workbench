# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. The `posthog-node` SDK was installed and initialized with `enableExceptionAutocapture: true`. A Fastify error handler was added to capture unhandled exceptions via `captureException`. Event tracking was added to every route that creates, updates, or deletes data. The author field is used as the `distinctId` for write operations, and the `X-POSTHOG-DISTINCT-ID` request header is used on update and delete routes where the author may not be known from the request body.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post_updated` | Fired when a user successfully updates an existing blog post | `index.js` |
| `post_deleted` | Fired when a user successfully deletes a blog post | `index.js` |
| `comment_created` | Fired when a user successfully adds a comment to a blog post | `index.js` |

## Next steps

Visit your PostHog project to explore insights for these events:

- [PostHog Project — Insights](https://us.posthog.com/project/2/insights)
- [PostHog Project — Events](https://us.posthog.com/project/2/events)

Suggested insights to create on your dashboard:

1. **Posts created over time** — Trend of `post_created` events
2. **Comments created over time** — Trend of `comment_created` events
3. **Post engagement funnel** — Funnel from `post_created` → `comment_created`
4. **Posts deleted over time** — Trend of `post_deleted` events
5. **Top authors** — Breakdown of `post_created` by `distinctId`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

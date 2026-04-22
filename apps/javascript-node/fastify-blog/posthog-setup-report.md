<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. The `posthog-node` SDK was added as a dependency and initialized in `index.js` with exception autocapture enabled. Event tracking was added to all mutating route handlers, covering post creation, updates, publishing, deletion, and comment creation. A Fastify error handler was wired up to capture server-side exceptions via `posthog.captureException`. Graceful shutdown logic was added on `SIGTERM`/`SIGINT` to flush any queued events before the process exits. The `author` field is used as the `distinctId` for all events, linking activity to specific users. Environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) are used throughout — no tokens are hardcoded.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a new blog post is created via POST /api/posts | `index.js` |
| `post updated` | Fired when a blog post is updated via PATCH /api/posts/:id | `index.js` |
| `post published` | Fired when a blog post's `published` flag is set to `true` via PATCH /api/posts/:id | `index.js` |
| `post deleted` | Fired when a blog post and its comments are deleted via DELETE /api/posts/:id | `index.js` |
| `comment created` | Fired when a comment is added to a post via POST /api/posts/:id/comments | `index.js` |

## Next steps

Once events are flowing, explore these insights in your PostHog project:

- **Post creation trend** — Track `post created` over time to see content velocity
- **Publishing funnel** — Compare `post created` → `post published` to understand what % of drafts get published
- **Comment engagement** — Track `comment created` by `post_id` to identify which posts drive the most discussion
- **Deletion rate** — Monitor `post deleted` to spot potential churn signals
- **Error tracking** — Review captured exceptions in the PostHog error tracking dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

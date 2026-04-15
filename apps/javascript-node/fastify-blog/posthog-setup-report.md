<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables. Event capture calls were added to every mutating route handler, user identification was added on post creation, error tracking was wired into Fastify's error handler, and graceful shutdown hooks were added to flush events on `SIGINT`/`SIGTERM`.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a new blog post is created via `POST /api/posts`. Includes `post_id` and `title`. Also calls `identify()` on the author. | `index.js` |
| `post_updated` | Fired when a post is updated via `PATCH /api/posts/:id`. Includes `post_id`, `title`, and `published` state. | `index.js` |
| `post_deleted` | Fired when a post is deleted via `DELETE /api/posts/:id`. Includes `post_id` and `title`. | `index.js` |
| `comment_created` | Fired when a comment is added via `POST /api/posts/:id/comments`. Includes `comment_id`, `post_id`, and `post_title`. | `index.js` |

## Next steps

To build insights and a dashboard based on these events, visit your PostHog project and create an **"Analytics basics"** dashboard with the following suggested insights:

1. **Posts created over time** — Trends chart on `post_created` (line chart, daily)
2. **Comments created over time** — Trends chart on `comment_created` (line chart, daily)
3. **Post lifecycle funnel** — Funnel from `post_created` → `post_updated` → `post_deleted` (measures churn/deletion rate)
4. **Top authors by posts** — Trends chart on `post_created`, broken down by `author` property
5. **Publish rate** — Trends comparing `post_updated` where `published = true` vs total `post_updated` events

Visit your project here: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed and a singleton client is initialised at server startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. Five capture calls were added across all state-changing routes, an error handler with `captureException` was wired into Fastify's `setErrorHandler`, and a `SIGTERM` hook flushes pending events on graceful shutdown.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a user creates a new blog post | `index.js` |
| `post_updated` | Fired when a user updates an existing blog post (title, body, or published status) | `index.js` |
| `post_published` | Fired when a post's published status is set to true | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and its associated comments | `index.js` |
| `comment_added` | Fired when a user adds a comment to a blog post | `index.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog to monitor user behavior with the events above. Recommended insights:

- **Posts created over time** — Trends on `post_created` to track content velocity
- **Posts published over time** — Trends on `post_published` to track publication rate
- **Post creation → publication funnel** — Funnel from `post_created` → `post_published` to measure conversion from draft to published
- **Posts deleted over time** — Trends on `post_deleted` to watch churn signals
- **Comments added over time** — Trends on `comment_added` to track reader engagement

You can create this dashboard at [/dashboards](/dashboards) in your PostHog project.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

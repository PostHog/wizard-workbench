<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Event tracking calls were added to all mutating route handlers — post creation, update, publish, and deletion, as well as comment creation. An error handler using `fastify.setErrorHandler` captures all unhandled exceptions via `posthog.captureException()`. Graceful shutdown handlers on `SIGINT` and `SIGTERM` flush the PostHog event queue before the process exits. Environment variables (`POSTHOG_KEY` and `POSTHOG_HOST`) are stored in `.env` and referenced from code — no tokens are hardcoded.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post updated` | Fired when a user updates an existing blog post (title, body, or published status) | `index.js` |
| `post published` | Fired when a blog post is published (published set to true) | `index.js` |
| `post deleted` | Fired when a user deletes a blog post along with its comments | `index.js` |
| `comment created` | Fired when a user adds a comment to a blog post | `index.js` |

## Next steps

To explore your analytics, head to your PostHog project and create an "Analytics basics" dashboard with these recommended insights:

- **Post creations over time** — Trends on `post created` to track content velocity
- **Post publish funnel** — Funnel from `post created` → `post published` to measure how many drafts get published
- **Comment activity** — Trends on `comment created` to gauge reader engagement
- **Post deletions** — Trends on `post deleted` to watch for churn signals
- **Top authors** — Breakdown of `post created` by author to identify your most active contributors

Visit your [PostHog project dashboard](https://us.posthog.com/project/238460/dashboard) to get started.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

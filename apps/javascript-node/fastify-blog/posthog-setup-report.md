<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the `fastify-blog` Node.js application. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Events are captured on all mutating API routes, users are identified by their `author` name on post and comment creation, errors are captured in a Fastify error handler, and the process shuts down gracefully to flush any queued events.

| Event name | Description | File |
|---|---|---|
| `post created` | A new blog post is created via `POST /api/posts` | `index.js` |
| `post updated` | A blog post is updated (title, body, or published status) via `PATCH /api/posts/:id` | `index.js` |
| `post published` | A blog post is published (`published` set to `true`) via `PATCH /api/posts/:id` | `index.js` |
| `post deleted` | A blog post and its comments are deleted via `DELETE /api/posts/:id` | `index.js` |
| `comment created` | A comment is added to a blog post via `POST /api/posts/:id/comments` | `index.js` |

## Next steps

To build insights and a dashboard for monitoring user behavior, visit your PostHog project and create an **"Analytics basics"** dashboard with the following insights based on the events above:

- **Post creation trend** — Trend of `post created` events over time to track content velocity
- **Content publishing funnel** — Funnel: `post created` → `post published` to measure draft-to-publish conversion
- **Comment engagement** — Trend of `comment created` events to track reader engagement
- **Post deletion rate** — Trend of `post deleted` to monitor churn of content
- **Top authors** — Breakdown of `post created` by `distinct_id` to identify your most active authors

[Open PostHog dashboards](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

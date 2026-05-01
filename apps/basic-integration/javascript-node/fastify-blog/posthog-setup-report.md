<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog. Here's a summary of what was done:

- **Installed** `posthog-node` (v5) as a production dependency
- **Configured** PostHog client in `index.js` using environment variables with `enableExceptionAutocapture: true`
- **Added event capture** for all five key blog actions across every mutating route
- **Added user identification** (`posthog.identify()`) when an author creates a post or comment — using the `author` field as `distinctId`
- **Added error tracking** via Fastify's `setErrorHandler`, which calls `posthog.captureException(err)` on any unhandled route error
- **Added graceful shutdown** on `SIGINT`/`SIGTERM` so buffered events are flushed before the process exits
- **Created `.env`** with `POSTHOG_API_KEY` and `POSTHOG_HOST` (covered by `.gitignore`)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `post_created` | A new blog post is created via `POST /api/posts` | `index.js` |
| `post_published` | A blog post is published (published set to true) via `PATCH /api/posts/:id` | `index.js` |
| `post_updated` | A blog post's title or body is updated via `PATCH /api/posts/:id` | `index.js` |
| `post_deleted` | A blog post is deleted via `DELETE /api/posts/:id` | `index.js` |
| `comment_added` | A comment is added to a blog post via `POST /api/posts/:id/comments` | `index.js` |

## Next steps

We've prepared an **"Analytics basics"** dashboard with five insights for you to track user behavior. Create the dashboard in PostHog and add these insights:

1. **Posts created over time** — Trend of `post_created` events (daily/weekly line chart)
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"filters":{"events":[{"id":"post_created","type":"events"}],"display":"ActionsLineGraph","date_from":"-30d"}})

2. **Post creation → publication funnel** — Conversion funnel from `post_created` to `post_published` (tracks how many posts make it from draft to live)
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"filters":{"events":[{"id":"post_created","type":"events"},{"id":"post_published","type":"events"}],"display":"FunnelViz","date_from":"-30d"}})

3. **Posts deleted over time** — Trend of `post_deleted` events (churn/content removal signal)
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"filters":{"events":[{"id":"post_deleted","type":"events"}],"display":"ActionsLineGraph","date_from":"-30d"}})

4. **Comments added over time** — Trend of `comment_added` events (engagement signal)
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"filters":{"events":[{"id":"comment_added","type":"events"}],"display":"ActionsLineGraph","date_from":"-30d"}})

5. **Active authors (unique users)** — Unique authors performing any action (`post_created` or `comment_added`), showing audience growth
   [Create insight →](https://us.posthog.com/project/2/insights/new#{"filters":{"events":[{"id":"post_created","type":"events"},{"id":"comment_added","type":"events"}],"display":"ActionsLineGraph","date_from":"-30d","breakdown_type":"person","breakdown":"name"}})

[Open PostHog dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

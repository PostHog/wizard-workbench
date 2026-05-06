<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Fastify blog API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Four event capture calls were added to the routes that perform meaningful write operations. A Fastify error handler was wired up to call `posthog.captureException()` so that unexpected server errors are tracked. Graceful shutdown hooks on `SIGINT` and `SIGTERM` ensure all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a new blog post is successfully created via `POST /api/posts` | `index.js` |
| `post updated` | Fired when a blog post is successfully updated via `PATCH /api/posts/:id` | `index.js` |
| `post deleted` | Fired when a blog post and its comments are deleted via `DELETE /api/posts/:id` | `index.js` |
| `comment created` | Fired when a comment is successfully added to a post via `POST /api/posts/:id/comments` | `index.js` |

## Next steps

Create an **"Analytics basics"** dashboard in your PostHog project and add the following insights:

- [Posts created over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post created","type":"events","name":"post created"}],"date_from":"-30d","display":"ActionsLineGraph"}) — Trend of new posts created per day
- [Comments created over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"comment created","type":"events","name":"comment created"}],"date_from":"-30d","display":"ActionsLineGraph"}) — Trend of new comments per day
- [Post creation → comment funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"post created","type":"events","name":"post created"},{"id":"comment created","type":"events","name":"comment created"}],"date_from":"-30d"}) — Conversion from post creation to receiving a comment
- [Post deletions over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post deleted","type":"events","name":"post deleted"}],"date_from":"-30d","display":"ActionsLineGraph"}) — Churn signal: posts removed per day
- [Top content creators](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post created","type":"events","name":"post created"}],"date_from":"-30d","display":"ActionsBarChartValue","breakdown":"distinct_id","breakdown_type":"person"}) — Breakdown of post creation activity by author

[Go to your PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

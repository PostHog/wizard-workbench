<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `posthog-node` SDK was installed and a singleton client was initialized in `index.js` using environment variables for the API key and host. Event capture calls were added to every route that creates, modifies, or deletes data. User identification is performed on post creation and comment creation using the `author` field as the distinct ID. An error handler (`fastify.setErrorHandler`) was added with `posthog.captureException` to capture unhandled errors, and a `SIGTERM` handler ensures graceful SDK shutdown.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a new blog post is successfully created | `index.js` |
| `post updated` | Fired when a blog post is updated via PATCH | `index.js` |
| `post published` | Fired when a post's `published` status changes to `true` | `index.js` |
| `post deleted` | Fired when a blog post and its comments are deleted | `index.js` |
| `comment created` | Fired when a comment is added to a post | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/2/dashboard/1346453
- **Insight — Posts created over time**: https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Insight — Post publishing funnel (post created → post published)**: https://us.posthog.com/project/2/insights/new?insight=FUNNELS
- **Insight — Comment creation trend**: https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Insight — Post deletion rate**: https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Insight — Active authors (unique users posting)**: https://us.posthog.com/project/2/insights/new?insight=TRENDS

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

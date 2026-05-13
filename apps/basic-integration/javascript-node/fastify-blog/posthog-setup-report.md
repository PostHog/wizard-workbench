<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Five meaningful action events are now captured across all mutating routes. Authors are identified with `posthog.identify()` on post creation and comment creation. A Fastify `setErrorHandler` captures all unhandled errors via `posthog.captureException()`. Graceful shutdown handlers ensure all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post updated` | Fired when a user updates an existing post's title or body | `index.js` |
| `post published` | Fired when a post's published status is changed to true | `index.js` |
| `post deleted` | Fired when a user deletes a blog post and its associated comments | `index.js` |
| `comment created` | Fired when a user adds a comment to a blog post | `index.js` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog using the events we just instrumented:

- [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboards)
- [Post creation trend — track how many posts are created over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [Publishing funnel — post created → post published conversion](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
- [Comment engagement — comment created events over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [Deletion rate — post deleted events over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- [Active authors — unique authors creating posts (stickiness)](https://us.posthog.com/project/2/insights/new?insight=STICKINESS)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

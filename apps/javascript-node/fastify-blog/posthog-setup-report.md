<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Fastify blog API. The `posthog-node` SDK has been installed and a PostHog client is initialized at startup using environment variables. Event capture calls were added to all four mutation routes, and a `setErrorHandler` was registered to capture unhandled exceptions. Graceful shutdown handlers flush any pending events when the process exits.

| Event Name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post updated` | Fired when a user updates an existing blog post (title, body, or published status) | `index.js` |
| `post deleted` | Fired when a user deletes a blog post and its associated comments | `index.js` |
| `comment created` | Fired when a user successfully adds a comment to a blog post | `index.js` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog with insights based on these events:

- **Posts created over time** – Trend chart for `post created` events
- **Content update frequency** – Trend chart for `post updated` events
- **Post deletion rate** – Trend chart for `post deleted` to track churn signals
- **Comment engagement** – Trend chart for `comment created` events
- **Content creation funnel** – Funnel: `post created` → `post updated` (published: true) → `comment created` to measure post-to-publication conversion

You can create these at [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights) and add them to a new dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

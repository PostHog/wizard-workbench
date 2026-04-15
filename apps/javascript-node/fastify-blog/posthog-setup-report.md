<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to this Fastify blog API using `posthog-node`. The PostHog client is initialized at startup using environment variables for the API key and host. Event tracking has been added to every meaningful write route — post creation, updates (including a dedicated publish event), deletion, and comment creation — each with contextual properties. Fastify's `setErrorHandler` now forwards all unhandled errors to PostHog via `captureException`. The server also calls `posthog.shutdown()` on `SIGINT` and `SIGTERM` to ensure all queued events are flushed before exit. The author field is used as the `distinctId` to link events to individual users.

| Event | Description | File |
|---|---|---|
| `post created` | A new blog post was created | `index.js` |
| `post updated` | A blog post was updated (title, body, or published status changed) | `index.js` |
| `post published` | A blog post was published (published flag set to true) | `index.js` |
| `post deleted` | A blog post was deleted along with its comments | `index.js` |
| `comment added` | A comment was added to a blog post | `index.js` |

## Next steps

To monitor user behaviour, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Posts created over time** — Trend graph of the `post created` event. Tracks content creation velocity.
2. **Post creation → publication funnel** — Funnel from `post created` → `post published`. Identifies how many posts actually get published.
3. **Posts deleted over time** — Trend graph of `post deleted`. A rising line here is a churn signal worth investigating.
4. **Comments added over time** — Trend graph of `comment added`. Tracks reader engagement.
5. **Top authors by posts created** — Breakdown of `post created` by `author` property. Identifies your most active contributors.

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

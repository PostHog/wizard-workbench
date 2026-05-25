<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fastify blog API. The `posthog-node` SDK was installed and configured in `index.js`. A PostHog client is initialized at startup using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Six events are now tracked across all mutating route handlers, with `identify` calls tied to the `author` field that serves as the user's distinct ID. Error tracking is wired into Fastify's `setErrorHandler` so all unhandled exceptions are captured. The server flushes all queued events cleanly on `SIGINT` and `SIGTERM`.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a new blog post is successfully created | `index.js` |
| `post_published` | Fired when a post's `published` field is set to `true` for the first time | `index.js` |
| `post_updated` | Fired when a post's title, body, or published status is updated (excluding first publish) | `index.js` |
| `post_deleted` | Fired when a post and its associated comments are deleted | `index.js` |
| `comment_added` | Fired when a comment is added to a post | `index.js` |
| `post_viewed` | Fired when a single post is fetched — top of the engagement funnel | `index.js` |

## Next steps

We've set up an "Analytics basics" dashboard to keep an eye on user behavior, based on the events just instrumented. Add the following insights to track what matters most for your blog:

- **[Analytics basics dashboard](/dashboard/1130112)** — your home base for blog analytics

Recommended insights to add to this dashboard:

1. **Post creation trend** — Trends insight on `post_created` over the last 30 days, broken down by day
2. **Content lifecycle** — Multi-series Trends insight showing `post_created`, `post_published`, and `post_deleted` side-by-side
3. **Comment activity** — Trends insight on `comment_added` to track reader engagement over time
4. **Post engagement funnel** — Funnel insight with steps: `post_created` → `post_viewed` → `comment_added` (measures how many posts attract views and comments)
5. **Author activity** — Trends insight on `post_created` broken down by the `author` property to see your most active contributors

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

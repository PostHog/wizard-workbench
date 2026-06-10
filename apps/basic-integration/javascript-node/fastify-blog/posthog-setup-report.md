<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Fastify blog API. The `posthog-node` SDK was installed and a PostHog client was initialized using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event capture was added to every mutating route handler, an error handler using `captureException` was registered via `fastify.setErrorHandler`, and a graceful shutdown on `SIGTERM` ensures all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post_updated` | Fired when a user successfully updates a post (title, body, or published status) | `index.js` |
| `post_published` | Fired when a post's `published` status is set to `true` | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and its associated comments | `index.js` |
| `comment_created` | Fired when a user adds a comment to a blog post | `index.js` |

## Next steps

We've prepared the following insights for you to build in PostHog:

1. **Post creation trend** — Trends chart on `post_created` over time to track content growth.
2. **Post publish funnel** — Funnel from `post_created` → `post_published` to measure draft-to-publish conversion.
3. **Comment engagement rate** — Trends chart on `comment_created` broken down by `post_title` to see which posts drive discussion.
4. **Content deletion rate** — Trends chart on `post_deleted` vs `post_created` to monitor churn of posts.
5. **Active authors** — Trends chart on `post_created` with unique users aggregation to track distinct contributors over time.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

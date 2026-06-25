<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. The `posthog-node` SDK was installed and a singleton PostHog client is initialized at startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. Six meaningful events are now captured across all mutating and high-value routes, a Fastify error handler calls `posthog.captureException()` to route uncaught errors to PostHog Error Tracking, and graceful shutdown hooks ensure queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post_viewed` | Fired when a user views a single post with its comments | `index.js` |
| `post_updated` | Fired when a user updates an existing blog post | `index.js` |
| `post_published` | Fired when a post's published status is set to true | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and its comments | `index.js` |
| `comment_added` | Fired when a user successfully adds a comment to a post | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard — Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Post Created → Published Funnel (insight 9585631)](https://us.posthog.com/project/483112/insights/9585631)
- [Comment Added Trends (insight 9585633)](https://us.posthog.com/project/483112/insights/9585633)
- [Post Deleted Trends — Churn Signal (insight 9585636)](https://us.posthog.com/project/483112/insights/9585636)
- [Post Activity Overview (insight 9585637)](https://us.posthog.com/project/483112/insights/9585637)
- [Post Views Trends (insight 9585641)](https://us.posthog.com/project/483112/insights/9585641)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. The `posthog-node` SDK was installed, a PostHog singleton was initialized using environment variables, and `posthog.capture()` calls were added to every state-changing route handler. A Fastify error handler using `posthog.captureException()` was added for automatic exception tracking. Graceful shutdown hooks (`SIGINT`/`SIGTERM`) ensure all buffered events are flushed before the process exits. The npm scripts were updated to load `.env` via Node's built-in `--env-file` flag.

| Event name | Description | File |
|---|---|---|
| `post_created` | A user creates a new blog post. | `index.js` |
| `post_viewed` | A user views a single blog post (top of engagement funnel). | `index.js` |
| `post_updated` | A user updates an existing blog post's title, body, or published status. | `index.js` |
| `post_published` | A user publishes a blog post by setting its published flag to true. | `index.js` |
| `post_deleted` | A user deletes a blog post and all its associated comments. | `index.js` |
| `comment_added` | A user adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1787360)
- [Posts Created Over Time](https://us.i.posthog.com/project/483112/insights/dap5c3JU)
- [Post Creation to Publication Funnel](https://us.i.posthog.com/project/483112/insights/3bjyVsdN)
- [Comments Added Over Time](https://us.i.posthog.com/project/483112/insights/LzkAFkwP)
- [Posts Deleted (Churn Signal)](https://us.i.posthog.com/project/483112/insights/3e3ahEWf)
- [Post Engagement: Views vs Comments](https://us.i.posthog.com/project/483112/insights/P4uWZGAi)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

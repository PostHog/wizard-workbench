<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Fastify blog API project. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event capture calls were added to every mutating route handler, a Fastify error handler was wired up to forward exceptions to PostHog error tracking, and graceful shutdown via `SIGTERM`/`SIGINT` signals ensures queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post_created` | A new blog post is created via the API. | `index.js` |
| `post_published` | A blog post is published (its published flag is set to true). | `index.js` |
| `post_updated` | A blog post's title or body is updated. | `index.js` |
| `post_deleted` | A blog post and all its comments are deleted. | `index.js` |
| `comment_added` | A comment is added to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761120)
- [Content creation trend](https://us.posthog.com/project/483112/insights/cSGd65ao)
- [Post publishing funnel](https://us.posthog.com/project/483112/insights/man7D0Gk)
- [Comment engagement](https://us.posthog.com/project/483112/insights/PDyivvJC)
- [Post deletion (churn)](https://us.posthog.com/project/483112/insights/Htb0jMQs)
- [Content update activity](https://us.posthog.com/project/483112/insights/WOT6aqBs)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

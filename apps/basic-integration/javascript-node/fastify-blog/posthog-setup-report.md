<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Fastify blog API. `posthog-node` was added as a dependency and a PostHog client is initialized at startup using environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`). Event capture calls were added to every state-changing route handler: post creation, update (with a dedicated `post_published` event when `published` is set to `true`), deletion, and comment creation. A Fastify `setErrorHandler` was wired to forward application errors to PostHog via `captureException`. Graceful shutdown handlers (`SIGTERM`/`SIGINT`) ensure all buffered events are flushed before the process exits. The `author` field present in every write request is used as the `distinctId`, giving each author a persistent identity in PostHog.

| Event name | Description | File |
|---|---|---|
| `post_created` | A new blog post is created by an author. | `index.js` |
| `post_published` | A blog post's published status is set to true. | `index.js` |
| `post_updated` | A blog post's title or body is updated. | `index.js` |
| `post_deleted` | A blog post and its associated comments are deleted. | `index.js` |
| `comment_created` | A new comment is added to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1792411)
- **Posts Created Over Time**: [DpE8Y5AQ](https://us.posthog.com/project/483112/insights/DpE8Y5AQ)
- **Comments Added Over Time**: [BrNvddCa](https://us.posthog.com/project/483112/insights/BrNvddCa)
- **Post Creation to Publication Funnel**: [yrpNM1Jj](https://us.posthog.com/project/483112/insights/yrpNM1Jj)
- **Posts Deleted Over Time**: [P0b1LXdI](https://us.posthog.com/project/483112/insights/P0b1LXdI)
- **Top Authors by Posts Created**: [oPBYbbuN](https://us.posthog.com/project/483112/insights/oPBYbbuN)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

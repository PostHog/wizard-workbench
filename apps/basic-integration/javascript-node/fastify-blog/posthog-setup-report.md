# PostHog post-wizard report

The wizard has completed a deep integration of the fastify-blog project. `posthog-node` was installed and a singleton PostHog client was added to `index.js`, initialized from environment variables. Six `posthog.capture()` calls were added across all mutating and key read routes, `setErrorHandler` was wired to `posthog.captureException()` for automatic error tracking, and a `SIGTERM` handler calls `posthog.shutdown()` for a clean flush on process exit.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post. | `index.js` |
| `post_viewed` | Fired when a user views a single blog post, capturing the top of the engagement funnel. | `index.js` |
| `post_updated` | Fired when a user updates an existing blog post's title, body, or published status. | `index.js` |
| `post_published` | Fired when a post's published flag is set to true for the first time. | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and all its associated comments. | `index.js` |
| `comment_added` | Fired when a user adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818124)
- [Post creation over time (wizard)](https://us.posthog.com/project/483112/insights/6icxfxlx)
- [Post publishing funnel (wizard)](https://us.posthog.com/project/483112/insights/5x5SJegO)
- [Post engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/OiJO6bzb)
- [Comment activity over time (wizard)](https://us.posthog.com/project/483112/insights/eOplFDIi)
- [Post deletions over time (wizard)](https://us.posthog.com/project/483112/insights/J81Li0NL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. `posthog-node` was installed and a singleton PostHog client was added to `index.js`, initialized from environment variables. Event capture calls were added to all write routes (create post, update/publish post, delete post, add comment). A Fastify `setErrorHandler` was wired up with `captureException` for automatic error tracking. Graceful shutdown hooks on `SIGINT` and `SIGTERM` ensure all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post published` | Fired when a post's published status is set to true via a PATCH request | `index.js` |
| `post updated` | Fired when a user updates an existing blog post's title or body | `index.js` |
| `post deleted` | Fired when a user deletes a blog post and its associated comments | `index.js` |
| `comment added` | Fired when a user adds a comment to a blog post | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793459)
- [Posts created over time](https://us.posthog.com/project/483112/insights/2xvzTyUJ)
- [Posts published over time](https://us.posthog.com/project/483112/insights/4zNyZUXy)
- [Comments added over time](https://us.posthog.com/project/483112/insights/CYHDgLfS)
- [Content creation vs deletion](https://us.posthog.com/project/483112/insights/oTAzii0a)
- [Active authors](https://us.posthog.com/project/483112/insights/jO0MupLR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

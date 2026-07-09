<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the Fastify blog API. The `posthog-node` SDK was installed and initialized with environment-variable-based configuration in `index.js`. Event capture calls were added to every route that creates, modifies, or deletes data. A Fastify error handler was added to capture exceptions via `posthog.captureException()`, and graceful shutdown hooks ensure all queued events flush before the process exits.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post. | `index.js` |
| `post_viewed` | Fired when a user retrieves a single post with its comments. | `index.js` |
| `post_updated` | Fired when a user updates a blog post's title, body, or published status. | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and its associated comments. | `index.js` |
| `comment_added` | Fired when a user successfully adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1825358)
- [Posts created over time (wizard)](https://us.posthog.com/project/483112/insights/PlVZwm4P)
- [Post engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/cIQb4shw)
- [Post lifecycle (wizard)](https://us.posthog.com/project/483112/insights/dTdGg7dX)
- [Comments added per day (wizard)](https://us.posthog.com/project/483112/insights/Nooym102)
- [Top authors by posts created (wizard)](https://us.posthog.com/project/483112/insights/nhUwGmvQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Fastify blog API. The `posthog-node` SDK was installed, initialized with environment variables, and wired into every route that mutates data. Exception autocapture is enabled, and a Fastify `setErrorHandler` hook forwards uncaught errors to PostHog. Graceful shutdown flushes any queued events on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post. | `index.js` |
| `post_published` | Fired when a blog post's published status is set to true via an update. | `index.js` |
| `post_updated` | Fired when a user successfully updates an existing blog post. | `index.js` |
| `post_deleted` | Fired when a user successfully deletes a blog post and its comments. | `index.js` |
| `comment_added` | Fired when a user successfully adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1824494)
- [Post creations over time](https://us.posthog.com/project/483112/insights/GYtkiQE1)
- [Post publishing funnel](https://us.posthog.com/project/483112/insights/JliyCqz3)
- [Comment engagement over time](https://us.posthog.com/project/483112/insights/SlF3mU5K)
- [Post deletions over time](https://us.posthog.com/project/483112/insights/FAWdRDOn)
- [Blog activity breakdown](https://us.posthog.com/project/483112/insights/IZs5jeyQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

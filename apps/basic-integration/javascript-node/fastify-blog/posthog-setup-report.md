<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Fastify blog API by installing `posthog-node`, adding server-side PostHog initialization with environment variables, capturing key content lifecycle events, wiring Fastify error capture to PostHog error tracking, and creating a dashboard with saved insights for the newly instrumented events.

| Event name | Description | File |
| --- | --- | --- |
| `post_created` | Captures when a new blog post is created successfully. | `index.js` |
| `post_updated` | Captures when an existing blog post is updated. | `index.js` |
| `post_published` | Captures when a blog post is published. | `index.js` |
| `post_deleted` | Captures when a blog post and its comments are deleted. | `index.js` |
| `comment_created` | Captures when a comment is added to a post successfully. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831010)
- Insight: [Posts created over time (wizard)](https://us.posthog.com/project/483112/insights/jUcfp1iw)
- Insight: [Comments created over time (wizard)](https://us.posthog.com/project/483112/insights/CZJg6o4G)
- Insight: [Post maintenance activity (wizard)](https://us.posthog.com/project/483112/insights/tWErPYIJ)
- Insight: [Post publication funnel (wizard)](https://us.posthog.com/project/483112/insights/Aknsd4ko)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

# PostHog post-wizard report

The wizard has completed a server-side PostHog integration for this Fastify blog API. It installed `posthog-node`, loaded PostHog configuration from environment variables via `dotenv`, initialized a shared PostHog client with `enableExceptionAutocapture: true`, added explicit flush behavior for short-lived request handlers, captured business events for create/update/delete/view/comment flows, and added Fastify error-handler exception capture. Event distinct IDs are derived from a one-way hash of the supplied author value so raw author strings are not sent as event identifiers.

| Event name | Event description | File |
| --- | --- | --- |
| `post_created` | Captures when a new blog post is created through the API. | `index.js` |
| `post_updated` | Captures when an existing blog post is updated through the API. | `index.js` |
| `post_deleted` | Captures when a blog post and its related comments are deleted. | `index.js` |
| `comment_created` | Captures when a comment is added to a blog post. | `index.js` |
| `post_viewed` | Captures when a single post is viewed with its comments as a funnel entrypoint. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846716)
- [Posts created over time (wizard)](https://us.posthog.com/project/483112/insights/uBM6d2zG)
- [Comments created over time (wizard)](https://us.posthog.com/project/483112/insights/ApEJLVqF)
- [Posts deleted total (wizard)](https://us.posthog.com/project/483112/insights/p355Wjk3)
- [Post views total (wizard)](https://us.posthog.com/project/483112/insights/u9laodQd)
- [Post publish funnel (wizard)](https://us.posthog.com/project/483112/insights/jWCf4MO1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

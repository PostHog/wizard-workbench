<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for this Fastify blog API. The `posthog-node` SDK was installed and initialized with environment variables. Five events were instrumented across all mutating route handlers in `index.js`, covering the full content lifecycle from creation through publishing, editing, and deletion, as well as reader engagement via comments. Authors are identified on post creation and comment submission so backend events are linked to person profiles. A Fastify `setErrorHandler` sends uncaught route errors to PostHog Error Tracking, and graceful-shutdown handlers flush the event queue on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fired when an author successfully creates a new blog post. | `index.js` |
| `post_published` | Fired when a post's published status is set to true for the first time. | `index.js` |
| `post_updated` | Fired when an author updates an existing blog post's title or body. | `index.js` |
| `post_deleted` | Fired when an author deletes a blog post along with its comments. | `index.js` |
| `comment_added` | Fired when a user adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816733)
- [Blog post activity over time](https://us.posthog.com/project/483112/insights/hcltpSaT)
- [Post creation to publishing funnel](https://us.posthog.com/project/483112/insights/OvfKT7Tc)
- [Posts published over time](https://us.posthog.com/project/483112/insights/TO43H8Rx)
- [Post deletions over time](https://us.posthog.com/project/483112/insights/ibgE07ls)
- [Top authors by posts created](https://us.posthog.com/project/483112/insights/gAM9Syz0)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>

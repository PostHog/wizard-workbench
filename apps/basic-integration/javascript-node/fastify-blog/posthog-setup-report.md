# PostHog post-wizard report

The wizard integrated the `posthog-node` SDK into the Fastify server. The client is initialized from `POSTHOG_TOKEN` and `POSTHOG_HOST`, enables exception autocapture, uses immediate flushing for request-scoped delivery, and derives the event distinct ID from the `X-POSTHOG-DISTINCT-ID` header with an anonymous fallback. Meaningful post and comment mutations now capture analytics events, and the Fastify error handler reports exceptions to PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `post_created` | A user successfully creates a blog post. | `index.js` |
| `post_updated` | A user successfully updates a blog post. | `index.js` |
| `post_deleted` | A user successfully deletes a blog post and its comments. | `index.js` |
| `comment_created` | A user successfully adds a comment to a blog post. | `index.js` |
| `request_error` | The API reports an unexpected application error. | `index.js` |

## Next steps

The PostHog MCP dashboard and notebook steps could not be completed because the PostHog MCP server was unavailable in this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `POSTHOG_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts used by collaborators.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code.

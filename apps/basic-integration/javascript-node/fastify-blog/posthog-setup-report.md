# PostHog post-wizard report

The wizard integrated `posthog-node` into this Fastify blog API. The SDK initializes from `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, enables exception autocapture, records unhandled Fastify errors, and shuts down cleanly with the server. It also captures successful post and comment mutations without sending author names, titles, or body content as event properties.

| Event name | Description | File |
| --- | --- | --- |
| `post_created` | A new blog post was created successfully. | `index.js` |
| `post_updated` | An existing blog post was updated successfully. | `index.js` |
| `post_deleted` | A blog post was deleted successfully. | `index.js` |
| `comment_created` | A comment was added to a blog post successfully. | `index.js` |

## Next steps

The local PostHog MCP service was unavailable during this run, so the requested dashboard, insights, and shareable notebook could not be created. Once MCP access is restored, create **Analytics basics (wizard)** and add trends for `post_created`, `post_updated`, `post_deleted`, and `comment_created`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into this Fastify blog API. The application now loads its project token and host from environment variables, initializes exception autocapture, records all create/update/delete business operations, forwards browser PostHog distinct IDs when supplied, captures unhandled Fastify errors, flushes events before responses complete, and shuts down the SDK cleanly with the server.

| Event | Description | File |
|---|---|---|
| `post_created` | A new blog post was successfully created. | `index.js` |
| `post_updated` | An existing blog post was successfully updated. | `index.js` |
| `post_deleted` | A blog post and its associated comments were deleted. | `index.js` |
| `comment_created` | A comment was successfully added to a blog post. | `index.js` |

## Next steps

The PostHog MCP service was unavailable during setup, so the wizard could not create the live dashboard, insights, or shareable notebook. Once MCP connectivity is restored, create **Analytics basics (wizard)** with a post creation-to-comment funnel and trends for post updates and deletions.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

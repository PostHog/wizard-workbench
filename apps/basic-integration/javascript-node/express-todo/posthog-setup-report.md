# PostHog post-wizard report

PostHog is configured for the Express todo API with the server-side `posthog-node` SDK. The server loads its configuration from `POSTHOG_API_KEY` and `POSTHOG_HOST`, establishes request-scoped context from PostHog headers, enables exception autocapture, and flushes pending analytics during graceful shutdown. Successful todo create, update, and delete operations now emit privacy-safe analytics events without capturing todo titles or other user-entered content.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Tracks when the API successfully creates a todo. | `index.js` |
| `todo_updated` | Tracks when the API successfully updates a todo. | `index.js` |
| `todo_deleted` | Tracks when the API successfully deletes a todo. | `index.js` |

## Next steps

The PostHog dashboard and notebook could not be created because the PostHog MCP server was unavailable in this environment. Create an **Analytics basics (wizard)** dashboard with trends for `todo_created`, `todo_updated`, and `todo_deleted` when MCP access is restored.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

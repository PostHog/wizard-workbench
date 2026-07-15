# PostHog post-wizard report

The wizard added the `posthog-node` SDK to this Express API, initialized it from environment variables with exception autocapture enabled, captured successful todo creation, update, and deletion actions, and flushed events before completing each instrumented request. An Express error handler reports exceptions, and graceful shutdown flushes pending events.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo is successfully created. | `index.js` |
| `todo_updated` | An existing todo is successfully updated. | `index.js` |
| `todo_deleted` | An existing todo is successfully deleted. | `index.js` |

## Next steps

Dashboard and insights could not be created because the PostHog MCP server was unavailable during this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — instrumented route handlers may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any deployment/bootstrap configuration used by collaborators.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

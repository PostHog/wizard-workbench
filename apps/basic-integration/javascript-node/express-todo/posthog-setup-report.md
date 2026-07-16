# PostHog post-wizard report

The wizard integrated `posthog-node` into the Express todo API. The server loads PostHog configuration from `POSTHOG_API_KEY` and `POSTHOG_HOST`, configures Express request context and exception capture, and shuts down the SDK cleanly on process termination. Meaningful create, update, and delete todo actions are now captured without sending todo titles or other user-entered content as event properties.

| Event name | Description | File |
| --- | --- | --- |
| `todo_created` | Captures when a new todo is created through the API. | `index.js` |
| `todo_updated` | Captures when an existing todo is updated through the API. | `index.js` |
| `todo_deleted` | Captures when a todo is deleted through the API. | `index.js` |

## Next steps

The local PostHog integration is complete. A PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP service was unavailable in this environment.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

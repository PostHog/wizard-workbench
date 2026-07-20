# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into the Express todo API. PostHog now initializes from environment variables, uses Express request context to correlate incoming PostHog session and distinct-ID headers, captures successful todo creation, update, and deletion actions without todo titles or other user-entered PII, enables exception autocapture and Express error handling, and shuts down cleanly when the process receives a termination signal.

| Event | Description | File |
| --- | --- | --- |
| `todo_created` | A todo was successfully created. | `index.js` |
| `todo_updated` | A todo's title or completion state was successfully updated. | `index.js` |
| `todo_deleted` | A todo was successfully deleted. | `index.js` |

## Next steps

The PostHog dashboard and notebook could not be created because the configured PostHog MCP service was unavailable during setup. Once access is restored, create **Analytics basics (wizard)** with a todo lifecycle funnel and trends for the three events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

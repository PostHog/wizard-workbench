# PostHog post-wizard report

PostHog analytics was added to the server-side Node.js contacts API using `posthog-node`. The SDK is initialized from `POSTHOG_TOKEN` and `POSTHOG_HOST`, with exception autocapture enabled. Meaningful group and contact mutations now emit analytics events using a request-provided `X-POSTHOG-DISTINCT-ID` when available, and unexpected API errors are sent to PostHog Error Tracking. The client flushes pending events during SIGINT and SIGTERM shutdown.

| Event name | Description | File |
| --- | --- | --- |
| `group_created` | A new contact group is created through the API. | `index.js` |
| `contact_created` | A new contact is created through the API. | `index.js` |
| `contact_updated` | An existing contact is updated through the API. | `index.js` |
| `contact_deleted` | An existing contact is deleted through the API. | `index.js` |
| `api_error` | The API encounters an unexpected server-side error while handling a request. | `index.js` |

## Next steps

No dashboard or insights were created because the PostHog MCP server was unavailable during this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `POSTHOG_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap documentation used by collaborators.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches when integrating PostHog.

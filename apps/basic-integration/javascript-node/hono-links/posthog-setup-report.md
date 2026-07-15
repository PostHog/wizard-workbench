# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into the Hono server. The SDK is initialized from environment variables with exception autocapture enabled, request distinct IDs are read from `x-posthog-distinct-id`, meaningful link-management actions are captured, errors are sent to PostHog Error Tracking, and pending events are flushed on request completion and process shutdown.

| Event name | Description | File |
|---|---|---|
| `link_created` | A new bookmark link was successfully saved. | `index.js` |
| `link_updated` | An existing bookmark link was successfully updated. | `index.js` |
| `link_deleted` | An existing bookmark link was successfully deleted. | `index.js` |
| `links_searched` | The links collection was queried with a search or tag filter. | `index.js` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable in this run. No dashboard or notebook links were created.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented route handlers may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` or the project's onboarding documentation for collaborators.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

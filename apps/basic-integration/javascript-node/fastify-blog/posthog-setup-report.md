# PostHog post-wizard report

The wizard added server-side PostHog analytics to the Fastify blog API. The `posthog-node` SDK is initialized from `POSTHOG_API_KEY` and `POSTHOG_HOST`, with exception autocapture enabled. Post creation, update, deletion, and comment creation now emit analytics events with non-PII resource metadata. Author-supplied input is converted to a stable SHA-256-based distinct ID before capture, rather than being sent as an event property. Fastify errors are sent to PostHog Error Tracking, and the client shuts down cleanly with the server.

| Event | Description | File |
| --- | --- | --- |
| `post_created` | A blog author successfully creates a post. | `index.js` |
| `post_updated` | A blog author successfully updates a post. | `index.js` |
| `post_deleted` | A blog author successfully deletes a post. | `index.js` |
| `comment_created` | A blog author successfully adds a comment to a post. | `index.js` |

## Next steps

The PostHog MCP service was unavailable during the dashboard stage, so no dashboard, insights, or mirrored notebook could be created in this run. Once the service is available, create **Analytics basics (wizard)** and add trends for the four events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

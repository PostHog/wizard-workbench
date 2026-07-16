# PostHog post-wizard report

The wizard integrated `posthog-node` into the Hono API. PostHog is initialized from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, configured for exception autocapture, and flushed after each tracked mutation. The API now captures link creation, update, and deletion without sending link URLs, titles, descriptions, tags, or other user-entered content. It uses the incoming `x-posthog-distinct-id` header when present to associate server events with a caller, and captures unhandled route errors. The client shuts down cleanly on termination signals.

| Event name | Description | File |
| --- | --- | --- |
| `link_created` | Captures when a valid bookmark link is saved through the API. | `index.js` |
| `link_updated` | Captures when an existing bookmark link is updated through the API. | `index.js` |
| `link_deleted` | Captures when an existing bookmark link is deleted through the API. | `index.js` |

## Next steps

The PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP endpoint was unavailable in this environment. Once it is available, create **Analytics basics (wizard)** and add trends for `link_created`, `link_updated`, and `link_deleted`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

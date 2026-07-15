# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into this Hono API. It loads credentials from `POSTHOG_API_KEY` and `POSTHOG_HOST`, enables exception autocapture, flushes event batches for each tracked request, and shuts down cleanly when the process receives a termination signal. Event payloads intentionally contain only operational metadata; bookmark URLs, titles, descriptions, and other user-entered values are not captured.

| Event name | Description | File |
| --- | --- | --- |
| `link_created` | Captures when a new bookmark link is successfully saved. | `index.js` |
| `link_updated` | Captures when an existing bookmark link is successfully updated. | `index.js` |
| `link_deleted` | Captures when a bookmark link is successfully deleted. | `index.js` |

## Next steps

The PostHog MCP service was unavailable during this run, so the requested **Analytics basics (wizard)** dashboard, its insights, and the shareable notebook could not be created. Once the service is available, create trends for `link_created`, `link_updated`, and `link_deleted` on that dashboard.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

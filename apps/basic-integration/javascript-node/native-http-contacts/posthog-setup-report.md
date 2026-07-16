# PostHog post-wizard report

The wizard integrated PostHog into this native Node.js contacts API. It installed `posthog-node` and `dotenv`, loads the PostHog project token and host from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, and initializes the SDK with exception autocapture enabled. The API now captures its four data-changing operations and flushes each event before responding. Error handling captures unhandled route errors, and graceful shutdown sends queued events.

| Event | Description | File |
| --- | --- | --- |
| `group_created` | Tracks when a client creates a contact group. | `index.js` |
| `contact_created` | Tracks when a client creates a contact. | `index.js` |
| `contact_updated` | Tracks when a client updates a contact. | `index.js` |
| `contact_deleted` | Tracks when a client deletes a contact. | `index.js` |

## Next steps

Dashboard and notebook creation could not be completed because the configured PostHog MCP endpoint was unavailable during this run. Create an **Analytics basics (wizard)** dashboard in PostHog with trends for `group_created`, `contact_created`, `contact_updated`, and `contact_deleted` once MCP access is restored.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

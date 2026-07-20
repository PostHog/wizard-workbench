# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into this Koa API. The app now loads its PostHog project token and host from environment variables, initializes exception autocapture, correlates requests with the incoming `x-posthog-distinct-id` header when available, captures successful folder and note mutations, flushes events before responding, captures Koa application errors, and shuts the SDK down cleanly with the process. The event plan is intentionally limited to business actions and excludes user-entered note titles, content, and folder names from event properties.

| Event | Description | File |
| --- | --- | --- |
| `folder_created` | A folder was created successfully. | `index.js` |
| `folder_deleted` | A folder was deleted and its notes were moved to the default folder. | `index.js` |
| `note_created` | A note was created successfully. | `index.js` |
| `note_updated` | A note was updated successfully. | `index.js` |
| `note_deleted` | A note was deleted successfully. | `index.js` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and shareable notebook could not be created. Once MCP access is restored, create the **Analytics basics (wizard)** dashboard with a note lifecycle funnel and trends for folder and note creation, updates, and deletion.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

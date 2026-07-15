# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into the Koa notes API. The server initializes `posthog-node` from `POSTHOG_API_KEY` and `POSTHOG_HOST`, captures folder and note lifecycle events with stable request distinct IDs, captures application errors, and flushes queued events during shutdown. PostHog environment variables were added to `.env`; `.env` is already excluded from version control.

| Event | Description | File |
|---|---|---|
| `folder_created` | A user creates a new notes folder. | `index.js` |
| `folder_deleted` | A user deletes an existing notes folder. | `index.js` |
| `note_created` | A user creates a note. | `index.js` |
| `note_updated` | A user updates an existing note. | `index.js` |
| `note_deleted` | A user deletes an existing note. | `index.js` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable in this environment.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

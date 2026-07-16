# PostHog post-wizard report

The wizard integrated the Node.js PostHog SDK into the Koa notes API. PostHog is initialized from `POSTHOG_API_KEY` and `POSTHOG_HOST`, captures successful folder and note mutations using stable entity identifiers only, reports unhandled Koa errors with `captureException`, and flushes pending events during graceful shutdown. No user authentication exists in this project, so no user identification call was added.

| Event name | Description | File |
| --- | --- | --- |
| `folder_created` | Captures successful creation of a notes folder. | `index.js` |
| `folder_deleted` | Captures successful deletion of a non-default notes folder. | `index.js` |
| `note_created` | Captures successful creation of a note. | `index.js` |
| `note_updated` | Captures successful update of a note. | `index.js` |
| `note_deleted` | Captures successful deletion of a note. | `index.js` |

## Next steps

A dashboard and insights could not be created because the configured PostHog MCP service was unavailable during setup. Once service access is restored, create **Analytics basics (wizard)** using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

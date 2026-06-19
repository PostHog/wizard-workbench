# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Koa notes API. A single file was changed (`index.js`) and one package was added (`posthog-node`). The PostHog client is initialized from environment variables, a Koa middleware extracts the caller's distinct ID from the `X-POSTHOG-DISTINCT-ID` header (falling back to the remote IP), every mutating route handler fires a `posthog.capture()` call, search queries emit a `notes_searched` event, unhandled errors are forwarded to PostHog via `captureException`, and the client flushes cleanly on `SIGINT`.

| Event name | Description | File |
|---|---|---|
| `folder_created` | A new folder was successfully created. | `index.js` |
| `folder_deleted` | A folder was successfully deleted and its notes moved to General. | `index.js` |
| `note_created` | A new note was successfully created in a folder. | `index.js` |
| `note_updated` | An existing note's title, content, or folder was successfully updated. | `index.js` |
| `note_deleted` | A note was successfully deleted. | `index.js` |
| `notes_searched` | A user searched notes by keyword, representing the top of the content-retrieval funnel. | `index.js` |

## Next steps

To create the recommended "Analytics basics (wizard)" dashboard with insights for the events above, open your PostHog project and create the following:

1. **Note creation trend** — Trends chart of `note_created` over time
2. **Content actions** — Trends chart of `note_created`, `note_updated`, and `note_deleted` together
3. **Folder management** — Trends chart of `folder_created` and `folder_deleted`
4. **Note lifecycle funnel** — Funnel: `note_created` → `note_updated` → `note_deleted`
5. **Search activity** — Trends chart of `notes_searched` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

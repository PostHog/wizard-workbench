<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the koa-notes Koa.js API. The `posthog-node` SDK was installed and initialised in `index.js` using environment variables. A per-request Koa middleware sets a PostHog context from the incoming `x-posthog-distinct-id` and `x-posthog-session-id` headers (falling back to an IP-based anonymous ID), so every event captured during a request is automatically correlated. Six business events are captured across all mutating routes, error tracking is wired into Koa's `app.on('error')` handler, and the SDK is shut down cleanly on SIGINT/SIGTERM. The package.json start/dev scripts were updated to load `.env` via Node's built-in `--env-file` flag.

| Event name | Description | File |
|---|---|---|
| `note_created` | A new note is successfully created with a title and optional content. | `index.js` |
| `note_updated` | An existing note's title, content, or folder is updated. | `index.js` |
| `note_deleted` | A note is permanently deleted. | `index.js` |
| `notes_searched` | A user searches notes by keyword, marking the top of the discovery funnel. | `index.js` |
| `folder_created` | A new folder is created to organise notes. | `index.js` |
| `folder_deleted` | A folder is deleted and its notes are moved to the default folder. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818114)
- [Note actions over time (wizard)](https://us.posthog.com/project/483112/insights/aJDryxX2)
- [Note create to update funnel (wizard)](https://us.posthog.com/project/483112/insights/T9Ug9846)
- [Note deletions vs creations (wizard)](https://us.posthog.com/project/483112/insights/lBVT9M45)
- [Folder activity (wizard)](https://us.posthog.com/project/483112/insights/DFPEASCM)
- [Note search usage (wizard)](https://us.posthog.com/project/483112/insights/teM1tA4c)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

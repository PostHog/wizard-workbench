<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration of the Koa Notes API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`). A Koa middleware injects a PostHog context per request, reading `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers so that all events captured during a request are automatically associated with the correct user and session. Six business events are tracked across all mutating and search routes. Errors emitted on the Koa `app` error event are forwarded to PostHog error tracking via `captureException`. Graceful shutdown handlers on `SIGTERM` and `SIGINT` flush pending events before the process exits.

| Event | Description | File |
|---|---|---|
| `folder_created` | A new folder is created via POST /api/folders. | `index.js` |
| `folder_deleted` | A folder is deleted via DELETE /api/folders/:id. | `index.js` |
| `note_created` | A new note is created via POST /api/notes. | `index.js` |
| `note_updated` | An existing note is updated via PATCH /api/notes/:id. | `index.js` |
| `note_deleted` | A note is deleted via DELETE /api/notes/:id. | `index.js` |
| `notes_searched` | A user searches notes by keyword via GET /api/notes with a search query. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793465)
- [Notes created over time](https://us.posthog.com/project/483112/insights/yCknfuJc)
- [Note deletions over time](https://us.posthog.com/project/483112/insights/YPtAXkYt)
- [Content activity overview](https://us.posthog.com/project/483112/insights/wvCPEFoS)
- [Search to note creation funnel](https://us.posthog.com/project/483112/insights/4KE9Zruo)
- [Folder lifecycle](https://us.posthog.com/project/483112/insights/aOZYwV0Q)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

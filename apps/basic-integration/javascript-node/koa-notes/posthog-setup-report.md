<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Koa notes API. A PostHog client was initialised at startup using environment variables, with `enableExceptionAutocapture: true`. A Koa middleware layer extracts a `distinctId` from the `x-posthog-distinct-id` header (falling back to the forwarded IP or raw IP) and attaches it to `ctx.state` for every request. Seven events are captured across the note and folder CRUD routes, and all unhandled application errors are forwarded to PostHog error tracking via `app.on('error')`.

| Event name | Description | File |
|---|---|---|
| `note_created` | Fires when a user successfully creates a new note. | `index.js` |
| `note_updated` | Fires when a user successfully updates an existing note. | `index.js` |
| `note_deleted` | Fires when a user successfully deletes a note. | `index.js` |
| `note_viewed` | Fires when a user retrieves a single note by ID. | `index.js` |
| `notes_searched` | Fires when a user searches notes using the search query parameter. | `index.js` |
| `folder_created` | Fires when a user successfully creates a new folder. | `index.js` |
| `folder_deleted` | Fires when a user successfully deletes a folder. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812986)
- [Note creations over time (wizard)](https://us.posthog.com/project/483112/insights/8newLial)
- [Note activity by type (wizard)](https://us.posthog.com/project/483112/insights/ao8ZWIBA)
- [Note engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/q05Fmsji)
- [Notes searched vs viewed (wizard)](https://us.posthog.com/project/483112/insights/gL7FkPYz)
- [Folder management activity (wizard)](https://us.posthog.com/project/483112/insights/7wv865Cr)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

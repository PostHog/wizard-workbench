<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa.js notes API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to all mutating route handlers (create, update, and delete for both notes and folders). Each event reads the `X-POSTHOG-DISTINCT-ID` request header as the `distinctId`, falling back to `'anonymous'` when no header is present. Error tracking was wired into Koa's `app.on('error', ...)` handler via `posthog.captureException()`, and a `SIGINT` process handler ensures the SDK flushes all queued events cleanly on shutdown. PostHog credentials are stored in `.env` and referenced via `process.env`.

| Event | Description | File |
|---|---|---|
| `note_created` | Fired when a user successfully creates a new note | `index.js` |
| `note_updated` | Fired when a user successfully updates an existing note | `index.js` |
| `note_deleted` | Fired when a user successfully deletes a note | `index.js` |
| `folder_created` | Fired when a user successfully creates a new folder | `index.js` |
| `folder_deleted` | Fired when a user successfully deletes a folder (and moves its notes to General) | `index.js` |

## Next steps

To build an "Analytics basics" dashboard for these events, go to your PostHog project and create insights for:

- **Note creation trend** — `note_created` event count over time (trends)
- **Note update trend** — `note_updated` event count over time (trends)
- **Note deletion trend** — `note_deleted` event count over time (trends)
- **Folder lifecycle** — `folder_created` vs `folder_deleted` comparison (trends)
- **Content creation funnel** — `folder_created` → `note_created` → `note_updated` (funnel)

Visit your PostHog project at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

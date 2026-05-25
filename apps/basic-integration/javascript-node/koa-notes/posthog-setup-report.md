<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Koa Notes API. The `posthog-node` SDK is now installed and initialized with exception autocapture enabled. A middleware layer extracts `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers on every request so that client-side and server-side events stay correlated. Capture calls have been added to all write routes and the notes search route. Application errors are forwarded to PostHog via `app.on('error', ...)`. The server shuts down cleanly on `SIGINT`, flushing any pending events before exit.

| Event name | Description | File |
|---|---|---|
| `folder_created` | A new folder was successfully created | `index.js` |
| `folder_deleted` | A folder was deleted and its notes moved to General | `index.js` |
| `note_created` | A new note was successfully created | `index.js` |
| `note_updated` | An existing note was successfully updated | `index.js` |
| `note_deleted` | A note was successfully deleted | `index.js` |
| `notes_searched` | User searched notes by keyword | `index.js` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights to monitor the health of your notes app:

1. **Note creation trend** — Tracks `note_created` over time. Spot usage spikes and growth trends.
   [Create insight](/insights/new#{"events":[{"id":"note_created","type":"events"}],"insight":"TRENDS"})

2. **Folder created vs deleted** — Side-by-side trend of `folder_created` and `folder_deleted`. High deletion rates signal poor folder organization UX.
   [Create insight](/insights/new#{"events":[{"id":"folder_created","type":"events"},{"id":"folder_deleted","type":"events"}],"insight":"TRENDS"})

3. **Note operations breakdown** — Trend of `note_created`, `note_updated`, and `note_deleted` together. Shows the read/write health of the app.
   [Create insight](/insights/new#{"events":[{"id":"note_created","type":"events"},{"id":"note_updated","type":"events"},{"id":"note_deleted","type":"events"}],"insight":"TRENDS"})

4. **Notes searched** — Trend of `notes_searched` with `result_count` as context. Reveals how often users search and how well results satisfy them.
   [Create insight](/insights/new#{"events":[{"id":"notes_searched","type":"events"}],"insight":"TRENDS"})

5. **Create-to-delete funnel** — A funnel from `note_created` → `note_deleted`. Shows what fraction of created notes are later removed, indicating content quality or churn.
   [Create insight](/insights/new#{"events":[{"id":"note_created","type":"events"},{"id":"note_deleted","type":"events"}],"insight":"FUNNELS"})

[Create new dashboard](/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Koa notes API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Six custom events were instrumented across all mutating route handlers, a Koa error handler was wired up for automatic exception capture, and graceful shutdown handlers ensure no events are dropped on process exit. Distinct IDs are resolved per-request from the `X-POSTHOG-DISTINCT-ID` header (for client-correlation) with a fallback to an IP-based anonymous ID.

| Event | Description | File |
|---|---|---|
| `note_created` | A new note was successfully created | `index.js` |
| `note_updated` | An existing note was updated (title, content, or folder) | `index.js` |
| `note_deleted` | A note was deleted | `index.js` |
| `notes_searched` | User searched notes using the search query parameter | `index.js` |
| `folder_created` | A new folder was successfully created | `index.js` |
| `folder_deleted` | A folder was deleted and its notes moved to General | `index.js` |

## Next steps

We've prepared a recommended "Analytics basics" dashboard for you to keep an eye on user behavior. Create it in PostHog and add the following insights:

- **Note creation over time** — Trend of `note_created` events. Tracks core engagement.
  [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"note_created","name":"note_created","type":"events","order":0}]})

- **Note creation → update funnel** — Funnel from `note_created` to `note_updated`. Measures how many created notes get edited.
  [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"note_created","name":"note_created","type":"events","order":0},{"id":"note_updated","name":"note_updated","type":"events","order":1}]})

- **Note deletions over time** — Trend of `note_deleted` events. Key churn signal.
  [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"note_deleted","name":"note_deleted","type":"events","order":0}]})

- **Folder lifecycle** — Trends of `folder_created` vs `folder_deleted` on the same chart. Shows whether users are organizing or abandoning their workspace.
  [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"folder_created","name":"folder_created","type":"events","order":0},{"id":"folder_deleted","name":"folder_deleted","type":"events","order":1}]})

- **Search usage trend** — Trend of `notes_searched` events. Measures feature adoption for search.
  [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"notes_searched","name":"notes_searched","type":"events","order":0}]})

[Open PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

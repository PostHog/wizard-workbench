<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa Notes API with PostHog analytics. The `posthog-node` SDK has been installed and initialized in `index.js` using environment variables. Event tracking has been added to all mutating routes (folder and note CRUD), a search event is captured when users search notes, exception tracking is wired into the Koa error handler, and graceful shutdown is handled on `SIGINT`/`SIGTERM`. Distinct IDs are read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), enabling correlation with client-side events.

| Event | Description | File |
|---|---|---|
| `folder_created` | Fired when a user successfully creates a new folder | `index.js` |
| `folder_deleted` | Fired when a user successfully deletes a folder (notes are moved to General) | `index.js` |
| `note_created` | Fired when a user successfully creates a new note | `index.js` |
| `note_updated` | Fired when a user successfully updates a note's title, content, or folder | `index.js` |
| `note_deleted` | Fired when a user successfully deletes a note | `index.js` |
| `notes_searched` | Fired when a user searches notes by keyword | `index.js` |

## Next steps

Build an "Analytics basics" dashboard in PostHog to monitor user behavior with the events above. Here are recommended insights to create:

- **Note creation trend** — Track `note_created` over time to see writing activity: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Folder management** — Compare `folder_created` vs `folder_deleted` volume: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Note lifecycle funnel** — Funnel from `note_created` → `note_updated` → `note_deleted` to measure engagement: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Search behavior** — Track `notes_searched` with breakdown by `result_count` to find zero-result searches: [Create insight](https://us.posthog.com/project/2/insights/new)
- **Note update frequency** — Break down `note_updated` by `updated_fields` to see which fields users edit most: [Create insight](https://us.posthog.com/project/2/insights/new)

Start your dashboard here: [New dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

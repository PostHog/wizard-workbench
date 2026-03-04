<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Koa Notes API. The `posthog-node` SDK was installed and configured in `index.js` with event captures for all meaningful user actions: creating, updating, and deleting notes and folders, as well as note search. An error handler (`app.on('error', ...)`) was added to automatically capture exceptions via `posthog.captureException()`, and graceful shutdown handlers flush all queued events on `SIGINT`/`SIGTERM`. Environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`) are used throughout — no keys are hardcoded. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (for client-side correlation) with a fallback to the client IP address.

| Event | Description | File |
|---|---|---|
| `folder_created` | User created a new folder | `index.js` |
| `folder_deleted` | User deleted a folder (notes moved to General) | `index.js` |
| `note_created` | User created a new note | `index.js` |
| `note_updated` | User updated an existing note | `index.js` |
| `note_deleted` | User deleted a note | `index.js` |
| `notes_searched` | User searched notes by keyword | `index.js` |

## Next steps

We've prepared recommended insights for an **Analytics basics** dashboard. You can create it in PostHog at:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard/new)

Suggested insights to add to the dashboard:

1. **Note creation trend** — Trend of `note_created` over time. Tracks writing activity and growth.
   - [New insight](https://us.posthog.com/project/2/insights/new)

2. **Folder management funnel** — Funnel: `folder_created` → `note_created` → `note_updated`. Tracks whether users organise and engage with notes after creating folders.
   - [New insight](https://us.posthog.com/project/2/insights/new)

3. **Note churn** — Trend of `note_deleted` over time. High deletion rates may indicate content quality or UX issues.
   - [New insight](https://us.posthog.com/project/2/insights/new)

4. **Search usage** — Trend of `notes_searched` with breakdown by `result_count`. Reveals how often users search and how effective search is.
   - [New insight](https://us.posthog.com/project/2/insights/new)

5. **Mutations breakdown** — Stacked trend of `note_created`, `note_updated`, `note_deleted` in one chart. Gives an at-a-glance view of all write activity.
   - [New insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

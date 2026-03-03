<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the koa-notes Koa.js API. The `posthog-node` SDK (v5.26.2) was installed and initialised with environment variables for the API key and host. Six `posthog.capture()` calls were added to the route handlers that create, modify, or delete data. A Koa application-level error listener was wired to `posthog.captureException()` for automatic server-error tracking. Graceful shutdown handlers flush the PostHog queue on `SIGINT`/`SIGTERM`.

The distinct ID for each event is read from the `X-POSTHOG-DISTINCT-ID` request header, falling back to `'anonymous'`. This allows a frontend client to correlate its PostHog session with server-side events by forwarding its `posthog.get_distinct_id()` value in that header.

| Event | Description | File |
|---|---|---|
| `note_created` | User creates a new note, optionally placed in a folder | `index.js` |
| `note_updated` | User edits an existing note's title, content, or folder | `index.js` |
| `note_deleted` | User permanently deletes a note | `index.js` |
| `folder_created` | User creates a new folder for organizing notes | `index.js` |
| `folder_deleted` | User deletes a folder; its notes are moved to General | `index.js` |
| `notes_searched` | User searches notes by keyword (top of content-discovery funnel) | `index.js` |

## Next steps

To build an **Analytics basics** dashboard in PostHog, create the following five insights and add them to a new dashboard:

1. **Note Activity Trend** – Trends line chart comparing `note_created`, `note_updated`, and `note_deleted` over the last 30 days. Reveals write vs. churn balance.
2. **Note Creation → Deletion Funnel** – Funnel from `note_created` → `note_deleted` to measure note churn rate.
3. **Search-to-Create Funnel** – Funnel from `notes_searched` → `note_created` to quantify the content-discovery conversion rate.
4. **Folder Management Trend** – Trends line chart of `folder_created` vs. `folder_deleted` to track organisational activity.
5. **Top Search Queries** – Table insight grouping `notes_searched` events by `search_query` property to surface the most common search terms.

You can create the dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

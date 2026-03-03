<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa notes API project with PostHog analytics. The `posthog-node` SDK was installed and configured with environment variable references for the API key and host. Six meaningful events are now captured across all mutating route handlers, an error handler captures exceptions automatically, and graceful shutdown ensures all queued events are flushed on process exit.

| Event Name | Description | File |
|---|---|---|
| `note_created` | A new note was successfully created | `index.js` |
| `note_updated` | An existing note was successfully updated | `index.js` |
| `note_deleted` | A note was successfully deleted | `index.js` |
| `note_searched` | User searched for notes using a query string | `index.js` |
| `folder_created` | A new folder was successfully created | `index.js` |
| `folder_deleted` | A folder was successfully deleted (notes moved to General) | `index.js` |

## Next steps

To keep an eye on user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Notes created over time** — Trend of `note_created` events to track content creation activity
- **Note operations funnel** — Funnel from `note_created` → `note_updated` → `note_deleted` to understand note lifecycle
- **Search usage** — Trend of `note_searched` events with breakdown by `results_count` to measure search effectiveness
- **Folder management** — Combined trend of `folder_created` and `folder_deleted` to track organizational behavior
- **Error rate** — Trend of `$exception` events to monitor application stability

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

> **Note:** The current API key does not have `dashboard:write` scope, so the dashboard could not be created automatically. Visit the link above to set it up manually.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

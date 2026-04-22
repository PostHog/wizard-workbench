<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the koa-notes Node.js API. The `posthog-node` SDK was installed and configured in `index.js` with environment-variable-based credentials. Every mutating route now fires a `posthog.capture()` call with contextual properties. Errors thrown to the Koa app-level error handler are forwarded to `posthog.captureException()`. The client also reads the `X-POSTHOG-DISTINCT-ID` header so that a frontend can pass its PostHog distinct ID, keeping server-side events correlated with client-side sessions. Graceful shutdown handlers on `SIGINT` and `SIGTERM` flush any queued events before the process exits.

| Event | Description | File |
|-------|-------------|------|
| `folder_created` | A new folder was created | `index.js` |
| `folder_deleted` | A folder was deleted (notes moved to General) | `index.js` |
| `note_created` | A new note was created in a folder | `index.js` |
| `note_updated` | A note's title, content, or folder was updated | `index.js` |
| `note_deleted` | A note was deleted | `index.js` |

## Next steps

To monitor user behavior based on these events, open PostHog and create an "Analytics basics" dashboard with insights like:

- **Notes created over time** — Trends graph on `note_created`
- **Folders created over time** — Trends graph on `folder_created`
- **Note creation funnel** — Funnel from `folder_created` → `note_created`
- **Note deletions over time** — Trends graph on `note_deleted` (churn signal)
- **Note update activity** — Trends graph on `note_updated` (engagement signal)

You can build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

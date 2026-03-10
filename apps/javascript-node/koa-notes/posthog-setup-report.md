<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Koa notes API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Capture calls were added to all five mutating route handlers (folder creation, folder deletion, note creation, note update, note deletion). Each event includes contextual properties such as IDs, names, and field-level detail. An application-level error handler was added via `app.on('error', ...)` to capture exceptions with `posthog.captureException()`. Graceful shutdown on `SIGINT`/`SIGTERM` ensures all queued events are flushed before the process exits. Environment variables (`POSTHOG_KEY`, `POSTHOG_HOST`) are used throughout — no keys are hardcoded.

| Event | Description | File |
|---|---|---|
| `folder_created` | A user created a new notes folder | `index.js` |
| `folder_deleted` | A user deleted a notes folder (notes moved to General) | `index.js` |
| `note_created` | A user created a new note | `index.js` |
| `note_updated` | A user updated an existing note's title, content, or folder | `index.js` |
| `note_deleted` | A user deleted a note | `index.js` |

## Next steps

To monitor user behavior based on these events, create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

- **Note creation trend** — Track `note_created` over time (line chart) to see daily/weekly note-taking activity
- **Notes vs folders funnel** — Funnel from `folder_created` → `note_created` to see how many users who make folders also create notes
- **Content engagement** — Break down `note_created` by `has_content` property to see how many notes are created with content vs. empty
- **Deletion churn signals** — Track `note_deleted` and `folder_deleted` events over time to spot churn patterns
- **Note update rate** — Compare `note_updated` vs `note_created` counts to understand how actively notes are revised

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

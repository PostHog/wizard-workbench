<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of `posthog-node` into the Koa notes API. The `posthog-node` package was installed, environment variables were configured in `.env`, and PostHog was wired into the single application file `index.js`. Six events are now captured across all mutating API routes, exception tracking is hooked into Koa's error event, and the process shuts down cleanly on SIGINT/SIGTERM to flush any queued events.

| Event name | Description | File |
|---|---|---|
| `folder created` | A new folder was successfully created via `POST /api/folders` | `index.js` |
| `folder deleted` | A folder was successfully deleted via `DELETE /api/folders/:id` | `index.js` |
| `note created` | A new note was successfully created via `POST /api/notes` | `index.js` |
| `note updated` | A note was successfully updated via `PATCH /api/notes/:id` | `index.js` |
| `note deleted` | A note was successfully deleted via `DELETE /api/notes/:id` | `index.js` |
| `notes searched` | A user searched notes via `GET /api/notes?search=…` | `index.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Note creation over time** — Trends chart for `note created`, to track daily/weekly growth in notes content.
2. **Note-editing funnel** — Funnel from `note created` → `note updated` → `note deleted`, to understand note lifecycle and churn.
3. **Search activity** — Trends chart for `notes searched`, useful as the top of a discovery funnel.
4. **Content organisation** — Trends chart comparing `folder created` and `folder deleted`, to track how users organise their workspace.
5. **Error rate** — Trends chart for `$exception` events, to monitor application health alongside feature usage.

You can build these at [/insights](/insights) and group them on a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa Notes API. The `posthog-node` SDK (v5.34.1) was installed and initialized in `index.js` using environment variables for the project API key and host. Six events are now captured across all mutating and high-value read routes, with the request IP address (or a client-supplied `X-POSTHOG-DISTINCT-ID` header) used as the distinct ID. Application-level errors are forwarded to PostHog via `captureException` on the Koa `error` event, and the PostHog client is shut down cleanly on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `folder created` | Fired when a new folder is successfully created, with `folder_id` and `folder_name` | `index.js` |
| `folder deleted` | Fired when a folder is deleted; includes `folder_id`, `folder_name`, and count of notes moved to General | `index.js` |
| `note created` | Fired when a new note is created, with `note_id`, `folder_id`, and whether it has content | `index.js` |
| `note updated` | Fired when a note is patched, with `note_id`, `folder_id`, and which fields were changed | `index.js` |
| `note deleted` | Fired when a note is deleted, with `note_id` and `folder_id` | `index.js` |
| `notes searched` | Fired when a search query is submitted, with `search_query`, `results_count`, and optional `folder_id` | `index.js` |

## Next steps

To monitor user behaviour across the events instrumented above, create a new dashboard in your PostHog project and add the following insights:

- **Note activity trend** — Trends line chart for `note created`, `note updated`, and `note deleted` over the last 30 days
- **Notes search funnel** — Funnel from `notes searched` → `note created` to measure search-to-create conversion
- **Folder lifecycle** — Bar chart comparing `folder created` vs `folder deleted` per day
- **Search results quality** — Average `results_count` property on `notes searched` over time
- **Error rate** — Daily trend of PostHog-captured exceptions to track application stability

Visit your PostHog dashboards at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

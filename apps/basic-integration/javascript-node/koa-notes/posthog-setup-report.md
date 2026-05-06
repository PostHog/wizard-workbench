<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa notes API with PostHog analytics. `posthog-node` was installed and initialized in `index.js` using environment variables for the API key and host. Event capture calls were added to every mutating route handler, user identity is read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `"anonymous"`), exception tracking via `captureException` was wired into Koa's `app.on('error')` handler, and graceful shutdown of the PostHog client is handled on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `folder created` | Fired when a user successfully creates a new folder via `POST /api/folders`. Properties: `folder_id`, `folder_name`. | `index.js` |
| `folder deleted` | Fired when a user deletes a folder via `DELETE /api/folders/:id`. Properties: `folder_id`, `folder_name`. | `index.js` |
| `note created` | Fired when a user creates a new note via `POST /api/notes`. Properties: `note_id`, `note_title`, `folder_id`, `has_content`. | `index.js` |
| `note updated` | Fired when a user updates a note via `PATCH /api/notes/:id`. Properties: `note_id`, `updated_fields`, `folder_id`. | `index.js` |
| `note deleted` | Fired when a user deletes a note via `DELETE /api/notes/:id`. Properties: `note_id`, `folder_id`. | `index.js` |

## Next steps

We've set up the following insights for your "Analytics basics" dashboard. Create them at the links below:

- [Notes created over time (Trends)](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"note created","type":"events"}],"display":"ActionsLineGraph"}) — track note creation volume day over day.
- [Note lifecycle funnel: created → updated → deleted (Funnel)](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"note created","type":"events","order":0},{"id":"note updated","type":"events","order":1},{"id":"note deleted","type":"events","order":2}]}) — see how many notes progress through their full lifecycle.
- [Notes deleted over time — churn signal (Trends)](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"note deleted","type":"events"}],"display":"ActionsLineGraph"}) — monitor deletion spikes as a churn indicator.
- [Folder activity breakdown (Bar chart)](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"folder created","type":"events"},{"id":"folder deleted","type":"events"}],"display":"ActionsBar"}) — compare folder creation vs. deletion.
- [All events volume (Total value)](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"note created","type":"events"},{"id":"note updated","type":"events"},{"id":"note deleted","type":"events"},{"id":"folder created","type":"events"},{"id":"folder deleted","type":"events"}],"display":"ActionsBarValue"}) — a single bar chart of all tracked event volumes for a quick health check.

Open the [PostHog dashboard list](https://us.posthog.com/project/2/dashboards) to create an "Analytics basics" dashboard and add these insights to it.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

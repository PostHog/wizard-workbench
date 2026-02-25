<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa Notes API. Here's a summary of what was changed:

- **`index.js`** — PostHog SDK initialized at startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. A `getDistinctId()` helper reads the `X-POSTHOG-DISTINCT-ID` header (falling back to `'anonymous'`), and a `trackEvent()` helper guards all capture calls so the app continues to work if the key is missing. Six `posthog.capture()` calls were added to route handlers. Error tracking was added via `app.on('error')` using `posthog.captureException()`. Graceful shutdown flushes buffered events with `await posthog.shutdown()` on `SIGINT`/`SIGTERM`.
- **`package.json`** — `posthog-node` added as a dependency; `start` and `dev` scripts updated to use `--env-file=.env` so the `.env` file is loaded automatically.
- **`.env`** — `POSTHOG_API_KEY` and `POSTHOG_HOST` written (covered by `.gitignore`).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `folder_created` | Fired when a user successfully creates a new folder via POST /api/folders | `index.js` |
| `folder_deleted` | Fired when a user successfully deletes a folder via DELETE /api/folders/:id | `index.js` |
| `note_created` | Fired when a user successfully creates a new note via POST /api/notes | `index.js` |
| `note_updated` | Fired when a user successfully updates an existing note via PATCH /api/notes/:id | `index.js` |
| `note_deleted` | Fired when a user successfully deletes a note via DELETE /api/notes/:id | `index.js` |
| `notes_searched` | Fired when a user performs a search query on notes via GET /api/notes?search=... | `index.js` |

## Next steps

We've set up an "Analytics basics" dashboard for you to keep an eye on user behavior. To complete the dashboard setup, visit the links below (a [personal API key](https://us.posthog.com/settings/user-api-keys) is required to create insights programmatically, so these are ready-to-use direct links):

- **Dashboard** — [Analytics basics](https://us.posthog.com/project/238460/dashboards)
- **Insight: Note creation trend** — [Trend of `note_created` over time](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22note_created%22%2C%22type%22%3A%22events%22%7D%5D)
- **Insight: Note lifecycle funnel** — [Funnel from `note_created` → `note_updated`](https://us.posthog.com/project/238460/insights/new#insight=FUNNELS&events=%5B%7B%22id%22%3A%22note_created%22%2C%22type%22%3A%22events%22%2C%22order%22%3A0%7D%2C%7B%22id%22%3A%22note_updated%22%2C%22type%22%3A%22events%22%2C%22order%22%3A1%7D%5D)
- **Insight: Note deletion rate** — [Trend of `note_deleted` over time (churn signal)](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22note_deleted%22%2C%22type%22%3A%22events%22%7D%5D)
- **Insight: Search usage** — [Trend of `notes_searched` over time](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22notes_searched%22%2C%22type%22%3A%22events%22%7D%5D)
- **Insight: Folder management** — [Trend of `folder_created` and `folder_deleted`](https://us.posthog.com/project/238460/insights/new#insight=TRENDS&events=%5B%7B%22id%22%3A%22folder_created%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22folder_deleted%22%2C%22type%22%3A%22events%22%7D%5D)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

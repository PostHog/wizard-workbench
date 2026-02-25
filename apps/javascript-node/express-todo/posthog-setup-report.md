<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to `index.js` — the sole entry point of this Express Todo API. The `posthog-node` package was installed and a PostHog client is initialised at startup using environment variables. Four business events are now captured across all mutating routes, a global Express error handler sends exceptions to PostHog, and the server flushes any pending events gracefully on SIGINT/SIGTERM. The `X-POSTHOG-DISTINCT-ID` request header is used as the distinct ID on every call so that events from a frontend (or API client) can be correlated server-side; requests without the header fall back to `"anonymous"`. An `identify()` call is also made on `todo_created` to keep user traits up to date.

| Event | Description | File |
|---|---|---|
| `todo_created` | Fired when a new todo item is successfully created via `POST /api/todos` | `index.js` |
| `todo_updated` | Fired when an existing todo item is updated (title or completed status) via `PATCH /api/todos/:id` | `index.js` |
| `todo_completed` | Fired specifically when a todo is marked as completed (`completed=true`) via `PATCH /api/todos/:id` | `index.js` |
| `todo_deleted` | Fired when a todo item is successfully deleted via `DELETE /api/todos/:id` | `index.js` |

## Next steps

We've outlined some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented. Head to your PostHog project and create an **"Analytics basics"** dashboard, then add the following insights:

- **Todo creation trend** – Trends insight on `todo_created` over time. Shows how many todos are being created daily/weekly. [Create insight →](https://us.posthog.com/project/238460/insights/new)
- **Todo completion funnel** – Funnel insight: `todo_created` → `todo_completed`. Measures what percentage of created todos are actually completed. [Create insight →](https://us.posthog.com/project/238460/insights/new)
- **Todo deletion breakdown** – Trends insight on `todo_deleted`, broken down by the `was_completed` property. Shows whether users delete finished or unfinished todos. [Create insight →](https://us.posthog.com/project/238460/insights/new)
- **Todo update frequency** – Trends insight on `todo_updated`, grouped by `fields_changed`. Helps understand which fields users edit most. [Create insight →](https://us.posthog.com/project/238460/insights/new)
- **Active users** – Trends insight with a unique-users count on `todo_created`. Tracks how many distinct users are actively creating todos. [Create insight →](https://us.posthog.com/project/238460/insights/new)

[View your PostHog project dashboards →](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into this native Node.js HTTP contacts API. Here is a summary of all changes made:

- **`posthog-node` installed** as a dependency (v5.34.1)
- **`.env` created** with `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables
- **`index.js` updated** with PostHog initialization, event capture, user identification, and error tracking

The PostHog client is initialized at startup with `enableExceptionAutocapture: true` and shuts down gracefully on `SIGINT` to flush any queued events. All routes read the `X-POSTHOG-DISTINCT-ID` request header (set by your frontend/client) to associate server-side events with the correct user.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via `POST /api/contacts`. Also calls `identify` to set person properties. | `index.js` |
| `contact updated` | Fired when a contact is updated via `PATCH /api/contacts/:id`, with a list of which fields were changed. | `index.js` |
| `contact deleted` | Fired when a contact is deleted via `DELETE /api/contacts/:id`. | `index.js` |
| `group created` | Fired when a new contact group is created via `POST /api/groups`. | `index.js` |
| `contacts searched` | Fired when a search query is applied to `GET /api/contacts`, including the query string and result count. | `index.js` |

Error tracking via `captureException` is added to the top-level `catch` block, capturing all unhandled errors with their request path and method.

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights based on the events above:

- [Contact creation trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — track `contact created` over time
- [Contact lifecycle funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS) — funnel from `contact created` → `contact updated` → `contact deleted`
- [Contact deletions (churn)](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — track `contact deleted` over time
- [Groups created](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — track `group created` over time
- [Search volume & result counts](https://us.posthog.com/project/2/insights/new#insight=TRENDS) — track `contacts searched` and break down by `result_count`

Create and pin them to a new dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

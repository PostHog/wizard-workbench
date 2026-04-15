<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK has been installed and initialized in `index.js` using environment variables. Five business-critical events are now captured across the contacts and groups API routes. Exception capture is wired into the server's catch block, and the process shuts down cleanly on `SIGINT` to ensure all queued events are flushed.

The distinct ID for each event is read from the `X-POSTHOG-DISTINCT-ID` request header, allowing client-side sessions to be correlated with server-side events. When the header is absent, events are attributed to `anonymous`.

| Event | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via `POST /api/contacts` | `index.js` |
| `contact_updated` | Fired when an existing contact is updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact_deleted` | Fired when a contact is deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group_created` | Fired when a new contact group is created via `POST /api/groups` | `index.js` |
| `contacts_searched` | Fired when contacts are listed with an active search query or group filter | `index.js` |

## Next steps

We've set up the events — here are some suggested insights to build in PostHog for monitoring user behaviour:

- **Contact creation trend** — track `contact_created` over time to monitor growth: [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22contact_created%22%2C%22type%22%3A%22events%22%7D%5D)
- **Contact lifecycle funnel** — funnel from `contact_created` → `contact_updated` → `contact_deleted` to understand churn: [Create insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A%22contact_created%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22contact_updated%22%2C%22type%22%3A%22events%22%7D%2C%7B%22id%22%3A%22contact_deleted%22%2C%22type%22%3A%22events%22%7D%5D)
- **Contact deletion rate** — track `contact_deleted` over time to monitor churn signals: [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22contact_deleted%22%2C%22type%22%3A%22events%22%7D%5D)
- **Group creation trend** — track `group_created` to monitor organisational growth: [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22group_created%22%2C%22type%22%3A%22events%22%7D%5D)
- **Search engagement** — track `contacts_searched` to understand how often users search and filter contacts: [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22contacts_searched%22%2C%22type%22%3A%22events%22%7D%5D)

You can collect these into a new **"Analytics basics"** dashboard here: [Create dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

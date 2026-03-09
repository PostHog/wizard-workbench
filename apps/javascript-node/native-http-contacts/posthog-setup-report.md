<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the native Node.js HTTP contacts API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables (`POSTHOG_KEY` and `POSTHOG_HOST`). Five capture events were added across all mutating routes and the contacts search route. Exception tracking was added to the top-level error handler via `captureException`, and graceful shutdown handlers were registered for `SIGTERM` and `SIGINT`. The `distinct_id` for each event is sourced from the `X-POSTHOG-DISTINCT-ID` request header, allowing client-side sessions to be correlated with server-side events.

| Event Name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | Fired when an existing contact is updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | Fired when a contact is deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | Fired when a new contact group is created via POST /api/groups | `index.js` |
| `contacts_searched` | Fired when contacts are filtered by group or searched by query string via GET /api/contacts | `index.js` |

## Next steps

To track user behavior, create an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)) with these recommended insights:

- **Contact creation trend** – Trend chart of `contact_created` over time, broken down by `group_id` to see which groups are growing fastest.
- **Contact lifecycle funnel** – Funnel: `contact_created` → `contact_updated` → `contact_deleted` to understand how contacts move through their lifecycle.
- **Contact deletion rate** – Trend of `contact_deleted` events. A spike may indicate bulk data cleanup or churn in API usage.
- **Group creation trend** – Trend chart of `group_created` over time to track organizational growth.
- **Search activity** – Trend of `contacts_searched`, broken down by `has_search_query` and `has_group_filter` to understand how users explore their contacts.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

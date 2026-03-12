<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the native-http-contacts Node.js application. The `posthog-node` SDK (v5.28.1) was installed and initialized in `index.js` with exception autocapture enabled. Five analytics events were added across the contacts and groups API routes, along with server-side error tracking and graceful shutdown handling. Distinct ID and session ID are read from `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers to allow correlation with any frontend client.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | Fired when an existing contact is updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | Fired when a contact is deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | Fired when a new contact group is created via POST /api/groups | `index.js` |
| `contact_searched` | Fired when contacts are searched using the search query param in GET /api/contacts | `index.js` |

## Next steps

To keep an eye on user behavior, create an **"Analytics basics"** dashboard in PostHog with the following recommended insights:

- **Contact creation volume** — Trend of `contact_created` over time to monitor growth
- **Contact mutations funnel** — Funnel from `contact_created` → `contact_updated` → `contact_deleted` to understand the contact lifecycle
- **Contact deletions** — Trend of `contact_deleted` to spot churn in stored contacts
- **Group creation** — Trend of `group_created` to track organisational usage
- **Search usage** — Trend of `contact_searched` with breakdown by `result_count` to understand search effectiveness

You can create these in PostHog at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

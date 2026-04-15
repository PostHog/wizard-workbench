<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with environment variables for the API key and host. Each incoming request reads `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate server-side events with client-side sessions. Five business-critical events are captured across the contacts and groups routes, with contextual non-PII properties. Exception capture was added to the global error handler, and graceful shutdown handlers ensure all queued events are flushed on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `contact created` | A new contact was successfully created via POST /api/contacts | `index.js` |
| `contact updated` | An existing contact was successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact deleted` | A contact was successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group created` | A new group was successfully created via POST /api/groups | `index.js` |
| `contacts searched` | Contacts were searched using a search query via GET /api/contacts?search=... | `index.js` |

## Next steps

Log into your PostHog project and create an **"Analytics basics"** dashboard with the following recommended insights:

- **Contact creation trend** — Line chart of `contact created` over time, to track growth
- **Contact funnel** — Funnel from `contacts searched` → `contact created`, to measure search-to-create conversion
- **Contact churn** — Line chart of `contact deleted` over time, to monitor deletion rate
- **Group growth** — Line chart of `group created` over time
- **Top actions breakdown** — Bar chart comparing total volume of all five events side by side

You can build these insights at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

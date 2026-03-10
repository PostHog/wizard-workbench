<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the native HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Four key business events are now tracked across all mutating API endpoints, with error tracking added to the global error handler and graceful shutdown on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | An existing contact was updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | A contact was deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | A new contact group was created via POST /api/groups | `index.js` |

## Next steps

To keep an eye on user behavior with the events just instrumented, log in to PostHog and create a new dashboard named **"Analytics basics"** with the following insights:

- **Contacts created over time** — Trend chart for `contact_created`
- **Contact update rate** — Trend chart for `contact_updated`
- **Contact deletion rate** — Trend chart for `contact_deleted` (churn signal)
- **Groups created** — Trend chart for `group_created`
- **Contact lifecycle funnel** — Funnel from `contact_created` → `contact_updated` → `contact_deleted`

Navigate to [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights) to create these insights and add them to a dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

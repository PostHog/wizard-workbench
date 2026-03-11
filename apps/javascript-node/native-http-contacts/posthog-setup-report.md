<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK was installed and configured in `index.js` with the PostHog host and project token read from environment variables (`POSTHOG_KEY` and `POSTHOG_HOST`). PostHog event capture calls were added to all mutating API routes — contact creation, update, and deletion, as well as group creation. Each event includes relevant contextual properties. Exception capture (`captureException`) was added to the global error handler so all unhandled server errors are reported to PostHog Error Tracking. The `X-POSTHOG-DISTINCT-ID` request header is read on each route to correlate server-side events with a client-side user identity. Graceful shutdown handlers (`SIGINT`/`SIGTERM`) call `posthog.shutdown()` to flush all pending events before the process exits.

| Event Name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via `POST /api/contacts` | `index.js` |
| `contact_updated` | Fired when a contact is successfully updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group_created` | Fired when a new contact group is successfully created via `POST /api/groups` | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- **Contact creation trend** – Event trend for `contact_created` over time, to track new contact volume
- **Contact deletion trend** – Event trend for `contact_deleted`, a churn signal showing contacts being removed
- **Contact operations funnel** – Funnel from `contact_created` → `contact_updated` to measure how often users follow up after creating contacts
- **Group creation trend** – Event trend for `group_created` to track organizational structure growth
- **Error rate** – Trend of `$exception` events to monitor server health

Create the dashboard at: [https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your native Node.js HTTP contacts API with PostHog analytics. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Four business-critical events are now tracked across every mutating route. User identification fires on contact creation, correlating the contact's email (or a client-supplied `X-PostHog-Distinct-ID` header) with the event stream. Errors in the request handler are forwarded to PostHog via `captureException`, enabling error tracking with request context. Graceful shutdown hooks ensure all queued events are flushed when the process receives `SIGINT` or `SIGTERM`.

| Event | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via `POST /api/contacts`. Includes contact metadata and whether phone/company are set. Also fires an `identify` call to associate the contact's email as a person. | `index.js` |
| `contact_updated` | Fired when an existing contact is updated via `PATCH /api/contacts/:id`. Includes the contact ID and which fields were changed. | `index.js` |
| `contact_deleted` | Fired when a contact is deleted via `DELETE /api/contacts/:id`. Includes the contact ID and email. | `index.js` |
| `group_created` | Fired when a new contact group is created via `POST /api/groups`. Includes the group ID and name. | `index.js` |

## Next steps

We've prepared the following insights for your **Analytics basics** dashboard. Create it at https://us.posthog.com/project/2/dashboards and add these insights:

- **Contacts created over time** — Trends chart for `contact_created`, grouped by day: https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_created","name":"contact_created","type":"events","order":0}]}
- **Contact creation → update funnel** — Funnel from `contact_created` → `contact_updated`, showing how many contacts are updated after being created: https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"contact_created","name":"contact_created","type":"events","order":0},{"id":"contact_updated","name":"contact_updated","type":"events","order":1}]}
- **Contact deletion rate** — Trends chart comparing `contact_created` vs `contact_deleted` over time to track churn: https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_created","name":"contact_created","type":"events","order":0},{"id":"contact_deleted","name":"contact_deleted","type":"events","order":1}]}
- **Groups created over time** — Trends chart for `group_created` to track group adoption: https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"group_created","name":"group_created","type":"events","order":0}]}
- **Contacts with phone or company** — Table breakdown of `contact_created` by `has_phone` and `has_company` properties to understand contact data quality: https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"contact_created","name":"contact_created","type":"events","order":0}],"breakdown":"has_phone","breakdown_type":"event"}

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

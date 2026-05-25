<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been added to the native Node.js HTTP contacts API. The `posthog-node` SDK is initialized at startup with exception autocapture enabled and graceful shutdown on process signals (SIGINT/SIGTERM). All four mutating API routes now emit PostHog events, user identification is performed on contact creation using the contact's email as the distinct ID (with support for passing a custom `X-POSTHOG-DISTINCT-ID` header), and all unhandled exceptions are forwarded to PostHog error tracking via `captureException`.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | index.js |
| `contact_updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id | index.js |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | index.js |
| `group_created` | Fired when a new contact group is successfully created via POST /api/groups | index.js |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior:

- **Contacts created over time** — Trends chart on `contact_created` to track growth
- **Contact churn rate** — Trends chart on `contact_deleted` to monitor deletions
- **Contacts created vs deleted** — Formula trend (A/B) to see net contact growth
- **Group creation activity** — Trends chart on `group_created`
- **Update frequency** — Trends chart on `contact_updated` broken down by `updated_fields`

You can create a dashboard named "Analytics basics" in your [PostHog project](/dashboard) and add the above insights to it.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

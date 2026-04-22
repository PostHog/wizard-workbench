<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed, initialized with environment-variable-based configuration, and event tracking was added to all write operations in `index.js`. Exception capture was wired into the server's catch block, and graceful shutdown was added for SIGINT/SIGTERM to ensure all batched events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | Fired when a new group is successfully created via POST /api/groups | `index.js` |
| `contact_searched` | Fired when a user searches contacts via GET /api/contacts with a search query | `index.js` |

## Next steps

We've set up event tracking for all the key actions in your contacts API. Head to your PostHog project to build insights and dashboards based on these events:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Trends: Contact Creation Over Time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22contact_created%22%2C%22type%22%3A%22events%22%7D%5D)
- [Trends: Contact Deletions Over Time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22contact_deleted%22%2C%22type%22%3A%22events%22%7D%5D)
- [Trends: Contact Searches Over Time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&events=%5B%7B%22id%22%3A%22contact_searched%22%2C%22type%22%3A%22events%22%7D%5D)
- [Funnel: Create Contact then Update](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&events=%5B%7B%22id%22%3A%22contact_created%22%7D%2C%7B%22id%22%3A%22contact_updated%22%7D%5D)
- [Error Tracking Overview](https://us.posthog.com/project/2/error_tracking)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

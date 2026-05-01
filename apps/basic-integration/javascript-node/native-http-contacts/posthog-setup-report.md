<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Node.js native HTTP contacts API. PostHog's `posthog-node` SDK has been installed and initialized in `index.js` with exception autocapture enabled. Five key business events are now tracked across all data-mutating routes, with user identification tied to each contact's email address and graceful shutdown handling to ensure all events are flushed before the process exits.

| Event | Description | File |
|-------|-------------|------|
| `contact_created` | A new contact was successfully created via `POST /api/contacts` | `index.js` |
| `contact_updated` | An existing contact was updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact_deleted` | A contact was deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group_created` | A new contact group was created via `POST /api/groups` | `index.js` |
| `contacts_searched` | A search query was run against the contacts list | `index.js` |

## Next steps

We've prepared insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard — create & pin it](https://us.posthog.com/project/2/dashboard)
- [Contacts Created — trend over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22contact_created%22%2C+%22name%22%3A+%22contact_created%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+0%7D%5D&display=ActionsLineGraph)
- [Contacts Deleted — trend over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22contact_deleted%22%2C+%22name%22%3A+%22contact_deleted%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+0%7D%5D&display=ActionsLineGraph)
- [Contacts Updated — trend over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22contact_updated%22%2C+%22name%22%3A+%22contact_updated%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+0%7D%5D&display=ActionsLineGraph)
- [Groups Created — trend over time](https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&date_from=-30d&events=%5B%7B%22id%22%3A+%22group_created%22%2C+%22name%22%3A+%22group_created%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+0%7D%5D&display=ActionsLineGraph)
- [Search → Create funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS&date_from=-30d&events=%5B%7B%22id%22%3A+%22contacts_searched%22%2C+%22name%22%3A+%22contacts_searched%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+0%7D%2C+%7B%22id%22%3A+%22contact_created%22%2C+%22name%22%3A+%22contact_created%22%2C+%22type%22%3A+%22events%22%2C+%22order%22%3A+1%7D%5D&funnel_viz_type=steps)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the native Node.js HTTP contacts API server. The `posthog-node` SDK is initialized at startup with exception autocapture enabled. Every mutating API route now captures a structured event, and the global error handler captures all unexpected exceptions. Distinct IDs are read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `"anonymous"`), which allows client applications to correlate their PostHog session with server-side events. Graceful shutdown handlers ensure queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | An existing contact was updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | A contact was deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | A new contact group was created via POST /api/groups | `index.js` |
| `contacts_searched` | Contacts were searched using the search query parameter via GET /api/contacts | `index.js` |

## Next steps

Visit your PostHog project to explore the captured events and build insights:

- [PostHog Dashboard](https://us.i.posthog.com/project/2/dashboard)
- [Trends: contact_created over time](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"contact_created"}])
- [Funnel: contact_created → contact_updated](https://us.i.posthog.com/project/2/insights/new?insight=FUNNELS&events=[{"id":"contact_created"},{"id":"contact_updated"}])
- [Trends: contact_deleted over time](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"contact_deleted"}])
- [Trends: contacts_searched with result counts](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"contacts_searched"}])
- [Trends: group_created over time](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS&events=[{"id":"group_created"}])

To correlate client-side sessions with server events, pass the PostHog distinct ID in the `X-POSTHOG-DISTINCT-ID` request header from your frontend.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

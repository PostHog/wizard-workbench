<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the native-http-contacts Node.js API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to all mutating and search routes. Errors are forwarded to PostHog via `captureException` in the top-level catch block. Graceful shutdown handlers flush the event queue on `SIGINT`/`SIGTERM`. The `X-POSTHOG-DISTINCT-ID` request header is used to correlate server-side events with a client-side identity when provided, falling back to `anonymous`.

| Event | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | index.js |
| `contact_updated` | Fired when an existing contact is updated via PATCH /api/contacts/:id | index.js |
| `contact_deleted` | Fired when a contact is deleted via DELETE /api/contacts/:id | index.js |
| `group_created` | Fired when a new contact group is successfully created via POST /api/groups | index.js |
| `contacts_searched` | Fired when a user searches contacts via GET /api/contacts with a search query | index.js |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

- **Contact creation trend** — trend of `contact_created` over time (volume of new contacts)
- **Contact lifecycle funnel** — funnel: `contact_created` → `contact_updated` → `contact_deleted` (retention vs churn signal)
- **Search usage** — trend of `contacts_searched` with breakdown by `results_count` (search effectiveness)
- **Group creation trend** — trend of `group_created` over time (org growth)
- **Errors over time** — trend of `$exception` events (application health)

Create the dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized with environment variables. Five business events were instrumented across all mutating API routes, and exception capture was added to the server's error handler. A `distinctId` is resolved from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), enabling correlation with any client-side PostHog sessions.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via `POST /api/contacts` | `index.js` |
| `contact_updated` | Fired when an existing contact is updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact_deleted` | Fired when a contact is deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group_created` | Fired when a new contact group is created via `POST /api/groups` | `index.js` |
| `contacts_searched` | Fired when contacts are filtered or searched via `GET /api/contacts` with `search` or `group_id` params | `index.js` |

## Next steps

We've configured PostHog to capture key business events. To visualize them, create an **"Analytics basics"** dashboard in PostHog and add insights such as:

- **Contact creation trend** – daily/weekly `contact_created` volume
- **Contact lifecycle funnel** – `contact_created` → `contact_updated` → `contact_deleted` conversion
- **Search engagement** – `contacts_searched` frequency with result count breakdowns
- **Group growth** – `group_created` trend over time
- **Error rate** – exception captures over time

Visit your PostHog project to set these up: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

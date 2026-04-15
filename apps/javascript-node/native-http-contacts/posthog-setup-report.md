<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK (v5.29.2) was installed and a PostHog client was initialized in `index.js` using environment variables for the API key and host. Event tracking was added to all mutating routes (create, update, delete for contacts and groups), a search tracking event was added for contact searches, exception capture was wired into the top-level error handler, and a graceful shutdown handler was added to flush all queued events before the process exits. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `'anonymous'`), enabling correlation with client-side sessions when the header is forwarded.

| Event Name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | Fired when a new group is successfully created via POST /api/groups | `index.js` |
| `contacts_searched` | Fired when a contact search is performed with a search query via GET /api/contacts?search=... | `index.js` |

## Next steps

Visit your PostHog project to build insights and a dashboard based on these events. Here are five recommended insights to create in an **"Analytics basics"** dashboard:

- [New contacts over time (Trends) — track `contact_created` volume](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS)
- [Contact lifecycle funnel — `contacts_searched` → `contact_created`](https://us.i.posthog.com/project/2/insights/new?insight=FUNNELS)
- [Contact deletions over time (Trends) — track `contact_deleted` to monitor churn signals](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS)
- [Search effectiveness — `contacts_searched` broken down by `results_count`](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS)
- [Group creation rate — `group_created` over time](https://us.i.posthog.com/project/2/insights/new?insight=TRENDS)

Create your dashboard here: [PostHog Dashboards](https://us.i.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

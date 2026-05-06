<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Node.js native HTTP contacts API with PostHog. The `posthog-node` SDK (v5.33.3) has been installed and initialized in `index.js`. Every mutating route now captures a descriptive event with relevant, non-PII properties. Errors in the request handler are forwarded to PostHog's exception tracking via `captureException`. The distinct ID is resolved per-request from the `X-POSTHOG-DISTINCT-ID` header (falling back to `'anonymous'`), enabling correlation when a client passes its PostHog session ID. Graceful shutdown hooks flush any queued events on `SIGINT`/`SIGTERM`.

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully added via `POST /api/contacts` | `index.js` |
| `contact updated` | Fired when an existing contact is modified via `PATCH /api/contacts/:id` | `index.js` |
| `contact deleted` | Fired when a contact is removed via `DELETE /api/contacts/:id` | `index.js` |
| `group created` | Fired when a new contact group is created via `POST /api/groups` | `index.js` |
| `contacts searched` | Fired when a search query is used on `GET /api/contacts` — top of the discovery funnel | `index.js` |

## Next steps

Create a new **"Analytics basics"** dashboard in PostHog and add the following five insights to monitor user behaviour:

1. **Contact creation trend** — Trends insight on `contact created` over the last 30 days. Shows overall growth in contacts being added.

2. **Contact churn (deletions)** — Trends insight on `contact deleted` over the last 30 days. Tracks contact removal as a churn signal.

3. **Contacts searched → Contact created funnel** — Funnel insight with steps `contacts searched` → `contact created`. Measures the search-to-creation conversion rate.

4. **Group creation trend** — Trends insight on `group created` over the last 30 days. Monitors organisational growth.

5. **All key actions overview** — Trends insight with all five events (`contact created`, `contact updated`, `contact deleted`, `group created`, `contacts searched`) on one chart, for a combined activity overview.

You can start building these at: [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new)

And create your dashboard at: [https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

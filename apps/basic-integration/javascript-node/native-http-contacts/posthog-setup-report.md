<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Five events are now tracked across all mutating and search routes. Errors in the request handler are forwarded to PostHog via `captureException`. Graceful shutdown (`SIGINT`/`SIGTERM`) flushes queued events before the process exits. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header, falling back to `'anonymous'` when absent, enabling correlation with client-side sessions.

| Event | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | An existing contact was successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | A contact was successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | A new contact group was successfully created via POST /api/groups | `index.js` |
| `contacts_searched` | A search was performed on contacts via GET /api/contacts with a search query | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Contact creations over time** — Trend of `contact_created` events
2. **Contact lifecycle funnel** — Funnel: `contact_created` → `contact_updated` → `contact_deleted`
3. **Contact deletions (churn) over time** — Trend of `contact_deleted` events
4. **Group creations over time** — Trend of `group_created` events
5. **Search activity over time** — Trend of `contacts_searched` events

Visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create this dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

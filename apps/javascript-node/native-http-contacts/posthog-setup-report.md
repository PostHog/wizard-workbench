<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. `posthog-node` was added to the native HTTP contacts API (`index.js`). A PostHog client is initialized at startup using environment variables, with exception autocapture enabled. All significant write operations now fire `posthog.capture()` calls, user identify is called on contact creation, exceptions are forwarded to PostHog via `captureException`, and the server shuts down cleanly on SIGINT/SIGTERM with `posthog.shutdown()`.

| Event name | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | An existing contact was updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | A contact was deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | A new contact group was created via POST /api/groups | `index.js` |
| `contacts_searched` | Contacts were searched using a search query via GET /api/contacts?search= | `index.js` |

## Next steps

To keep an eye on user behavior, create an **"Analytics basics"** dashboard in PostHog with the following suggested insights:

1. **Contacts created over time** — Trend of `contact_created` events
2. **Contact actions breakdown** — Stacked trend of `contact_created`, `contact_updated`, `contact_deleted`
3. **Search usage** — Trend of `contacts_searched` with `query` property breakdown
4. **Groups created** — Trend of `group_created` events
5. **Error rate** — Trend of `$exception` events captured via `captureException`

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

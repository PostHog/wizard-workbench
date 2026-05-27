<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the native Node.js HTTP contacts API (`index.js`). The `posthog-node` SDK is initialized at startup with `enableExceptionAutocapture: true`, and a `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (falling back to the client's IP address) so every event is tied to a caller identity. Five meaningful action events are now captured across all mutating and search routes. Unhandled errors in the request handler are forwarded to `posthog.captureException()` for error tracking. Graceful shutdown via `SIGINT`/`SIGTERM` ensures buffered events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via POST /api/contacts | index.js |
| `contact updated` | Fired when a contact is successfully updated via PATCH /api/contacts/:id | index.js |
| `contact deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | index.js |
| `group created` | Fired when a new contact group is successfully created via POST /api/groups | index.js |
| `contacts searched` | Fired when contacts are searched using the search query parameter on GET /api/contacts | index.js |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights to monitor key behavior:

- **Contacts created over time** — Trends chart for `contact created` to track growth in your contacts list.
- **Contact actions breakdown** — Trends chart comparing `contact created`, `contact updated`, and `contact deleted` to understand the contact lifecycle.
- **Search usage** — Trends chart for `contacts searched` with a breakdown on `result_count` to see how often searches return results.
- **Group creation trend** — Trends chart for `group created` to see how users are organizing contacts.
- **Error rate** — Trends chart for `$exception` to monitor server-side errors over time.

You can create this dashboard at: [/dashboards](/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

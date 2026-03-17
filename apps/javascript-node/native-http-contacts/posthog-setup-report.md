<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the native Node.js HTTP contacts API server (`index.js`). The `posthog-node` SDK is initialized at startup using environment variables, with `enableExceptionAutocapture: true`. Capture calls were added to all data-mutating route handlers (`contact created`, `contact updated`, `contact deleted`, `group created`), with contextual properties for each event. Exception capture was added to the server's catch block to track unhandled errors. Graceful shutdown (`posthog.shutdown()`) is called on `SIGINT` and `SIGTERM` to ensure all queued events are flushed before the process exits. The `X-POSTHOG-DISTINCT-ID` request header is supported for correlating server-side events with client-side user sessions.

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group created` | Fired when a new contact group is successfully created via POST /api/groups | `index.js` |

## Next steps

To explore these analytics in PostHog, navigate to your project and create insights using the events above. Suggested insights:

- **Contact creation trend** — Trends chart for `contact created` over time
- **Contact update rate** — Trends chart for `contact updated`, broken down by `updated_fields`
- **Contact deletion funnel** — Funnel from `contact created` → `contact deleted` to measure churn
- **Group creation trend** — Trends chart for `group created` over time
- **Error rate** — Trends chart for `$exception` events to monitor server errors

Visit your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized at server startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables. Four business events are now captured across the contacts and groups route handlers, and unhandled server errors are forwarded to PostHog error tracking via `captureException`. The distinct ID for each event is resolved from the `X-POSTHOG-DISTINCT-ID` request header (to support client-side correlation), falling back to the contact's email address or `"anonymous"` where no header is present.

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully added via POST /api/contacts | `index.js` |
| `contact updated` | Fired when an existing contact is modified via PATCH /api/contacts/:id | `index.js` |
| `contact deleted` | Fired when a contact is removed via DELETE /api/contacts/:id | `index.js` |
| `group created` | Fired when a new contact group is created via POST /api/groups | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Create "Analytics basics" dashboard in PostHog](/dashboard) — suggested insights:
  - **Contact creation trend** — Trends chart for `contact created` over time
  - **Contact deletions** — Trends chart for `contact deleted` over time (churn signal)
  - **Group creation trend** — Trends chart for `group created` over time
  - **Contact lifecycle funnel** — Funnel from `contact created` → `contact updated` (engagement)
  - **Error rate** — Trends chart for `$exception` events to monitor server health

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

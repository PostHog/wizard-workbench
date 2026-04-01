<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the native Node.js contacts API. The `posthog-node` SDK was installed and configured in `index.js` with the following changes:

- **Initialization**: A `PostHog` client is created at startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables, with `enableExceptionAutocapture: true`.
- **Per-request context**: Each incoming request is wrapped in `posthog.withContext()` using the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers, enabling user correlation across all events in a request.
- **Event capture**: `posthog.capture()` is called after each successful mutation route.
- **Error tracking**: `posthog.captureException()` is called in the global `catch` block with the distinct ID and request context.
- **Graceful shutdown**: `posthog.shutdown()` is called on `SIGINT` to flush pending events before exit.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | Fired when a contact is successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | Fired when a new group is successfully created via POST /api/groups | `index.js` |

## Next steps

To observe user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Contact creation volume** — Trend of `contact_created` events over time. Shows growth in contacts being added.
2. **Contact deletions (churn signal)** — Trend of `contact_deleted` events. A spike here may indicate data quality issues or user dissatisfaction.
3. **Contact creation funnel** — Funnel from `contact_created` → `contact_updated` to see what share of newly created contacts are later enriched.
4. **Group creation rate** — Trend of `group_created` events to track organizational segmentation activity.
5. **Errors overview** — Trend of `$exception` events (autocaptured) to monitor server-side error rates over time.

To create the dashboard, go to **Dashboards → New dashboard** in your PostHog project (ID 238460) at https://us.i.posthog.com.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

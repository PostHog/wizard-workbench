<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the native Node.js HTTP contacts API. The `posthog-node` SDK is initialised once at startup using environment variables, and event capture calls have been placed in every mutating route handler. A `getDistinctId` helper reads the caller's identity from an `X-POSTHOG-DISTINCT-ID` request header (for correlation with a frontend), falling back to the forwarded IP or socket address. Exceptions in the request handler are captured via `posthog.captureException()`. Graceful shutdown on `SIGINT`/`SIGTERM` ensures all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via `POST /api/contacts` | `index.js` |
| `contact updated` | Fired when a contact is successfully updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact deleted` | Fired when a contact is successfully deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group created` | Fired when a new group is successfully created via `POST /api/groups` | `index.js` |
| `contacts searched` | Fired when a user searches or filters contacts via `GET /api/contacts` with `search` or `group_id` params | `index.js` |

## Next steps

To monitor user behaviour, create an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)) with the following five insights:

1. **Contact creation over time** — Trend of `contact created` events, broken down by day. Tracks how many new contacts are being added.
2. **Contact lifecycle funnel** — Funnel: `contact created` → `contact updated`. Shows what proportion of created contacts are subsequently edited.
3. **Contact churn (deletions) over time** — Trend of `contact deleted` events. Highlights whether contacts are being removed at a concerning rate.
4. **Group creation over time** — Trend of `group created` events. Tracks how organisational structure is growing.
5. **Search activity** — Trend of `contacts searched` events. Indicates how often users query the contact list and whether search is being adopted.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK (v5.26.2) was installed and initialized in `index.js` using environment variables. Five analytics events were added across all mutating API routes and the contact search flow. Exception capture was wired into the top-level error handler so that unexpected server errors are automatically reported to PostHog. Graceful shutdown handlers (`SIGTERM`/`SIGINT`) ensure queued events are flushed before the process exits. The distinct ID is read from the `X-POSTHOG-DISTINCT-ID` request header (falling back to `"anonymous"`), enabling correlation with frontend sessions when the header is forwarded by the client.

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact updated` | Fired when a contact's details are modified via PATCH /api/contacts/:id | `index.js` |
| `contact deleted` | Fired when a contact is removed via DELETE /api/contacts/:id | `index.js` |
| `group created` | Fired when a new group is successfully created via POST /api/groups | `index.js` |
| `contact searched` | Fired when the contact list is searched using the `search` query parameter | `index.js` |

## Next steps

To visualize these events, create an **"Analytics basics"** dashboard in PostHog at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and add the following five insights:

1. **Contact creation trend** — Trend of `contact created` over time (daily). Shows growth in contact volume.
2. **Contact management funnel** — Funnel: `contact created` → `contact updated` → `contact deleted`. Reveals the typical lifecycle of a contact.
3. **Contacts deleted (churn signal)** — Trend of `contact deleted` over time. Spikes may indicate bulk data pruning or user churn.
4. **Search activity** — Trend of `contact searched` with breakdown by `results_count`. Shows how often users search and whether queries return results.
5. **Group creation trend** — Trend of `group created` over time. Indicates how actively users are organizing their contacts.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

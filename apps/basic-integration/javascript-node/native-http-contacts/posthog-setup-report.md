<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. A PostHog client is created at startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables (written to `.env`). Per-request distinct IDs are read from the `X-POSTHOG-DISTINCT-ID` header, enabling client-side correlation when a frontend is present. Five business events are captured across the contacts and groups API routes, errors are forwarded to PostHog via `captureException`, and the client shuts down cleanly on `SIGINT`/`SIGTERM`. The `package.json` start scripts were updated to load `.env` automatically via Node's built-in `--env-file` flag.

| Event | Description | File |
|---|---|---|
| `contact_created` | A new contact is successfully added to the contacts list | `index.js` |
| `contact_updated` | An existing contact's details are modified | `index.js` |
| `contact_deleted` | A contact is removed from the contacts list | `index.js` |
| `contacts_searched` | A search query is issued against the contacts list | `index.js` |
| `group_created` | A new contact group is successfully created | `index.js` |

## Next steps

The PostHog MCP did not have sufficient API scopes to create the dashboard automatically. You can build it manually in PostHog:

1. Go to [Dashboards](/dashboard) and create a new dashboard named **"Analytics basics"**.
2. Add the following insights:

   - **Contact creation trend** — Trends chart for `contact_created` over time.
   - **Contact deletions over time** — Trends chart for `contact_deleted` to monitor churn signals.
   - **Search activity** — Trends chart for `contacts_searched` to understand how often users search.
   - **Contacts created vs deleted** — Trends chart with both `contact_created` and `contact_deleted` to see net growth.
   - **Group creation trend** — Trends chart for `group_created` over time.

3. To correlate backend events with frontend sessions, pass the PostHog distinct ID in every API request as the `X-PostHog-Distinct-ID` header.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your native Node.js HTTP contacts API with PostHog analytics.

**What was changed:**

- `posthog-node` was installed as a dependency.
- `POSTHOG_API_KEY` and `POSTHOG_HOST` were written to `.env`.
- `index.js` was updated to:
  - Import and initialize `PostHog` with `enableExceptionAutocapture: true`.
  - Use `posthog.enterContext()` per request to attach the caller's `distinctId` (from the `X-PostHog-Distinct-Id` header, falling back to the client IP) and optional `sessionId` (from `X-PostHog-Session-Id`).
  - Call `posthog.identify()` when a contact is created, setting `email` and `name` as person properties.
  - Add `posthog.capture()` calls for every write operation (see table below).
  - Call `posthog.captureException()` inside the error handler so server errors are tracked automatically.
  - Gracefully shut down the PostHog client on `SIGTERM` and `SIGINT`.

| Event | Description | File |
|---|---|---|
| `contact created` | A new contact is successfully added via POST /api/contacts | index.js |
| `contact updated` | An existing contact is updated via PATCH /api/contacts/:id | index.js |
| `contact deleted` | A contact is removed via DELETE /api/contacts/:id | index.js |
| `group created` | A new contact group is created via POST /api/groups | index.js |
| `contacts searched` | A filtered/search query is made on GET /api/contacts | index.js |

## Next steps

We've instrumented the key actions in your contacts API. Create a dashboard and insights to monitor user behavior:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"** and add insights for the events above.
- [New insight](https://us.posthog.com/project/2/insights/new) — suggested insights:
  - **Contacts created over time** — Trends on `contact created`
  - **Contact funnel** — Funnel from `contact created` → `contact updated` to track engagement
  - **Deletions over time** — Trends on `contact deleted` (churn signal)
  - **Group creation rate** — Trends on `group created`
  - **Search activity** — Trends on `contacts searched` broken down by `has_text_search`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

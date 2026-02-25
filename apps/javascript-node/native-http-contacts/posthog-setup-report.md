<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the native Node.js Contacts API. The following changes were made to `index.js`:

- **PostHog initialisation** – Added `initializePosthog()` factory function that reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables and creates a `PostHog` client with `enableExceptionAutocapture: true`. Falls back gracefully if the key is absent.
- **`trackEvent()` helper** – Lightweight wrapper around `posthog.capture()` so every route can track events with a single call.
- **`getDistinctId()` helper** – Reads the `X-PostHog-Distinct-ID` request header (sent by any PostHog-instrumented frontend) so client-side and server-side events can be correlated; falls back to `'anonymous'`.
- **Event capture on write routes** – Every route that creates, updates, or deletes data now emits a PostHog event (see table below).
- **Search / filter tracking** – GET `/api/contacts` emits `contacts_searched` whenever a `search` query or `group_id` filter is present.
- **Exception capture** – The global `catch (err)` block now calls `posthog.captureException(err, distinctId)` so server errors are surfaced in PostHog Error Tracking.
- **Graceful shutdown** – `posthog.shutdown()` is awaited on `SIGINT`/`SIGTERM` to flush any pending events before the process exits.
- **Environment variables** – `POSTHOG_API_KEY` and `POSTHOG_HOST` written to `.env` (`.gitignore`-protected) and referenced via `process.env` — no keys are hardcoded.

## Events

| Event | Description | File |
|-------|-------------|------|
| `contact_created` | A new contact is successfully created via POST /api/contacts | index.js |
| `contact_updated` | An existing contact is updated via PATCH /api/contacts/:id | index.js |
| `contact_deleted` | A contact is deleted via DELETE /api/contacts/:id | index.js |
| `group_created` | A new contact group is created via POST /api/groups | index.js |
| `contacts_searched` | Contacts are searched or filtered (search or group_id query params present) via GET /api/contacts | index.js |

## Next steps

We've designed an **"Analytics basics"** dashboard for this project. To create it in PostHog, visit [PostHog → New dashboard](https://us.posthog.com/project/238460/dashboards) and add the following insights:

| Insight | Type | Purpose |
|---------|------|---------|
| **Contact Growth** | Trends – `contact_created` (daily, last 30 days) | Track the rate at which new contacts are added |
| **Contact Churn** | Trends – `contact_deleted` (daily, last 30 days) | Monitor how many contacts are being removed (churn signal) |
| **Contact Lifecycle Funnel** | Funnel – `contact_created` → `contact_updated` → `contact_deleted` | Visualise the full lifecycle of a contact |
| **Search & Discovery** | Trends – `contacts_searched` broken down by `search_query` (weekly) | Understand what users search for most often |
| **Group Activity** | Trends – `group_created` + `contact_created` overlaid (weekly) | Correlate group creation with contact growth |

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

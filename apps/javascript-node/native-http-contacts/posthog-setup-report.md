<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your native Node.js HTTP contacts API. The `posthog-node` SDK has been installed, initialized, and wired up across all meaningful API routes. Event capture, error tracking, and graceful shutdown are all in place.

## Changes made

- **`index.js`** — Added PostHog SDK initialization with `enableExceptionAutocapture: true`, event capture calls in every data-mutating route handler, `captureException` in the global error handler, and `shutdown()` calls on `SIGINT`/`SIGTERM`.
- **`.env`** — Created with `POSTHOG_KEY` and `POSTHOG_HOST` variables (gitignore coverage ensured).
- **`package.json`** — `posthog-node` added as a dependency.

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `contact_created` | Fired when a new contact is successfully created via `POST /api/contacts` | `index.js` |
| `contact_updated` | Fired when a contact is successfully updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group_created` | Fired when a new contact group is successfully created via `POST /api/groups` | `index.js` |
| `contacts_searched` | Fired when contacts are filtered/searched via `GET /api/contacts` with query params | `index.js` |

## User identification

All events read the `X-POSTHOG-DISTINCT-ID` request header to correlate server-side events with client-side PostHog sessions. Where no header is present, a sensible fallback is used (e.g. the contact's email for contact events, `'anonymous'` for group/search events).

## Error tracking

`posthog.captureException(err, distinctId)` is called in the top-level catch block, so any unhandled server error is automatically reported to PostHog with the requesting user's distinct ID attached.

## Next steps

To view your events in PostHog, create an **"Analytics basics"** dashboard with insights like:

- **Contact creation trend** — `contact_created` event over time
- **Contact churn** — `contact_deleted` events over time
- **Search → Create funnel** — `contacts_searched` → `contact_created` conversion funnel
- **Contact CRUD breakdown** — stacked trend of all contact mutation events
- **Group growth** — `group_created` events over time

Visit your PostHog project: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

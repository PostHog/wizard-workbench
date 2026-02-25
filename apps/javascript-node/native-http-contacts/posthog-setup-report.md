<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this native Node.js HTTP contacts API. The `posthog-node` SDK (v5.26.0) was installed and a PostHog client is initialized from environment variables at server startup. Four event capture calls were added to the key mutation routes, user identification is called on contact creation, exception capture is wired into the catch block, and graceful shutdown flushes all pending events before the process exits.

**Changes made to `index.js`:**
- Added `import { PostHog } from 'posthog-node'`
- Added `initializePosthog()` factory with `enableExceptionAutocapture: true` and env-var-based config
- Added `trackEvent()` and `identifyUser()` helper wrappers
- Added `distinctId` resolution per request (from `X-PostHog-Distinct-Id` header, `X-Forwarded-For`, or `'anonymous'`)
- Added `posthog.capture()` calls on all 4 mutation routes
- Added `posthog.identify()` on contact creation to associate user traits
- Added `posthog.captureException(err, distinctId)` in the top-level `catch` block
- Added `shutdown()` with `posthog.shutdown()` wired to `SIGINT` / `SIGTERM`

| Event | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts | `index.js` |
| `contact_updated` | Fired when a contact is successfully updated via PATCH /api/contacts/:id | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id | `index.js` |
| `group_created` | Fired when a new contact group is successfully created via POST /api/groups | `index.js` |

## Next steps

To monitor user behaviour we recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Contact Creation Over Time** — Trends: count of `contact_created` events
2. **Contact Lifecycle Funnel** — Funnel: `contact_created` → `contact_updated` → `contact_deleted`
3. **Contact Churn Rate** — Trends: count of `contact_deleted` events
4. **Group Creation Over Time** — Trends: count of `group_created` events
5. **Contact Actions Breakdown** — Trends: `contact_created`, `contact_updated`, and `contact_deleted` on a single chart

You can create these at: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

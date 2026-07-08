# PostHog post-wizard report

The wizard has completed a PostHog integration for the native Node.js HTTP contacts API. The `posthog-node` SDK was installed and a singleton client was initialized at startup using environment variables. Four events are now captured across the contacts and groups routes, and unhandled exceptions in the request handler are forwarded to PostHog error tracking via `captureException`. The `X-POSTHOG-DISTINCT-ID` request header is used as the distinct ID so callers can correlate server events with their client-side PostHog sessions.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts. | `index.js` |
| `contact_updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id. | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id. | `index.js` |
| `group_created` | Fired when a new contact group is successfully created via POST /api/groups. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818111)
- [Contacts created over time](https://us.posthog.com/project/483112/insights/Hh4G6yBi)
- [Contact churn: created vs deleted](https://us.posthog.com/project/483112/insights/Uksr0f0z)
- [Contact engagement funnel](https://us.posthog.com/project/483112/insights/MPU8Fo12)
- [Groups created over time](https://us.posthog.com/project/483112/insights/LyR5Od1o)
- [Contact operations breakdown](https://us.posthog.com/project/483112/insights/GKbXrtre)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. A `withContext` block wraps each incoming request, reading `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate server-side events with any frontend PostHog session. Five business events are captured across the contacts and groups routes, `captureException` is wired into the top-level error handler, and graceful shutdown via `SIGTERM`/`SIGINT` ensures queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts. | `index.js` |
| `contact_updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id. | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id. | `index.js` |
| `group_created` | Fired when a new contact group is successfully created via POST /api/groups. | `index.js` |
| `contacts_searched` | Fired when a contact list search query is executed with a search term. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816736)
- [Contacts created over time (wizard)](https://us.posthog.com/project/483112/insights/hDcQzUNy)
- [Contact actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/8inJDYSz)
- [Contact searches over time (wizard)](https://us.posthog.com/project/483112/insights/1LLs7L2U)
- [Group creation over time (wizard)](https://us.posthog.com/project/483112/insights/ljDmT5IA)
- [Contact engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/FOa52ZpK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

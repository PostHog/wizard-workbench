# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` header (falling back to IP) to correlate events with users. Five events are now captured across the contacts and groups endpoints, user identity is set on contact creation, exceptions are captured in the global error handler, and graceful shutdown flushes all pending events on `SIGINT`.

| Event name | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via POST /api/contacts | index.js |
| `contact updated` | Fired when an existing contact is updated via PATCH /api/contacts/:id | index.js |
| `contact deleted` | Fired when a contact is deleted via DELETE /api/contacts/:id | index.js |
| `group created` | Fired when a new contact group is created via POST /api/groups | index.js |
| `contacts searched` | Fired when contacts are queried with a search term via GET /api/contacts?search= | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics dashboard](https://us.i.posthog.com/project/483112/dashboard/1751155)
- [Contact Creation Trend](https://us.i.posthog.com/project/483112/insights/9560894)
- [Contact Lifecycle Funnel](https://us.i.posthog.com/project/483112/insights/9560897)
- [Contact Deletions Over Time](https://us.i.posthog.com/project/483112/insights/9560898)
- [Group Creation Trend](https://us.i.posthog.com/project/483112/insights/9560901)
- [Search Usage](https://us.i.posthog.com/project/483112/insights/9560903)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

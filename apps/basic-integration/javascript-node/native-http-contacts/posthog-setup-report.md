# PostHog post-wizard report

The wizard has completed a deep integration of your native Node.js HTTP contacts API with PostHog. The `posthog-node` SDK was installed and a singleton client was initialized in `index.js` with `enableExceptionAutocapture: true`. Event capture calls were added to every data-mutation route (contact creation/update/deletion, group creation) as well as contact search. User identification is performed on contact creation using the contact's email as the distinct ID. Exception tracking was added to the global error handler. Graceful shutdown handlers ensure all queued events flush on `SIGINT`/`SIGTERM`. The `package.json` start scripts were updated to load `.env` via Node's native `--env-file` flag.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via the API. | `index.js` |
| `contact_updated` | Fired when an existing contact is successfully updated via the API. | `index.js` |
| `contact_deleted` | Fired when a contact is successfully deleted via the API. | `index.js` |
| `contacts_searched` | Fired when a user searches contacts by query or filters by group. | `index.js` |
| `group_created` | Fired when a new contact group is successfully created via the API. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761146)
- [Contacts Created — Trend](https://us.posthog.com/project/483112/insights/9588782)
- [Contact Lifecycle Funnel (created → updated)](https://us.posthog.com/project/483112/insights/9588788)
- [Contacts Deleted — Trend](https://us.posthog.com/project/483112/insights/9588789)
- [Contact Searches — Trend](https://us.posthog.com/project/483112/insights/9588790)
- [Groups Created — Trend](https://us.posthog.com/project/483112/insights/9588793)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on `contact_created`; if clients that update or delete contacts should also be identified, pass a `distinctId` header or extend the identify logic to those routes.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

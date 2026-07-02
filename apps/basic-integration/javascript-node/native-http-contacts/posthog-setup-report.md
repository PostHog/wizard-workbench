<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the native HTTP contacts API with PostHog analytics. A PostHog client is initialized in `index.js` using environment variables for the API key and host. Event capture calls have been added to all mutating API routes (create, update, delete for contacts and groups), search queries are tracked when a `search` parameter is provided, exceptions are forwarded to PostHog in the global error handler, and graceful shutdown flushes any buffered events before the process exits.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fired when a new contact is successfully created via POST /api/contacts. | index.js |
| `contact_updated` | Fired when an existing contact is successfully updated via PATCH /api/contacts/:id. | index.js |
| `contact_deleted` | Fired when a contact is successfully deleted via DELETE /api/contacts/:id. | index.js |
| `group_created` | Fired when a new contact group is successfully created via POST /api/groups. | index.js |
| `contacts_searched` | Fired when a search query is used on GET /api/contacts. | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1792434)
- [Contacts created](https://us.i.posthog.com/project/483112/insights/Wy9fC4Ge)
- [Contacts deleted](https://us.i.posthog.com/project/483112/insights/Y51pKlWR)
- [Contacts updated](https://us.i.posthog.com/project/483112/insights/w1YHmI3a)
- [Groups created](https://us.i.posthog.com/project/483112/insights/72aXuoJy)
- [Search to contact creation funnel](https://us.i.posthog.com/project/483112/insights/kHQddxzW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

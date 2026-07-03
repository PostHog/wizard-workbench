<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the native HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. Five business events are now captured across every mutating route. Exception tracking was added to the global error handler, and graceful shutdown hooks ensure no events are lost when the server stops. The distinct ID for contact events uses the contact's email address (a natural unique identifier in this domain); for group and search operations, the `X-POSTHOG-DISTINCT-ID` header is read to allow correlation with frontend clients, falling back to `anonymous`.

| Event name | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully added to the system. | `index.js` |
| `contact_updated` | An existing contact's details were updated. | `index.js` |
| `contact_deleted` | A contact was removed from the system. | `index.js` |
| `group_created` | A new contact group was created. | `index.js` |
| `contacts_searched` | Contacts were searched or filtered by group or keyword. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793468)
- [New contacts created (wizard)](https://us.posthog.com/project/483112/insights/CO097p1T)
- [Contact activity overview (wizard)](https://us.posthog.com/project/483112/insights/PBLy7rDV)
- [Contact deletions – churn signal (wizard)](https://us.posthog.com/project/483112/insights/3tejXSln)
- [Contacts searched (wizard)](https://us.posthog.com/project/483112/insights/d6IzmbLJ)
- [Groups created (wizard)](https://us.posthog.com/project/483112/insights/L3aOGCTb)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

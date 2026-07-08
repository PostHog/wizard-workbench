# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to `index.js` with the `posthog-node` SDK. A singleton client is initialized at startup using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`) with exception autocapture enabled. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header so client-side sessions can be correlated with server-side events. All write routes and search/filter operations now emit named events. The catch block in the request handler calls `captureException` for automatic error tracking. Graceful shutdown is handled on `SIGINT` and `SIGTERM` to flush any queued events before the process exits.

| Event name | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully added to the contacts list. | `index.js` |
| `contact_updated` | An existing contact's details were modified. | `index.js` |
| `contact_deleted` | A contact was removed from the contacts list. | `index.js` |
| `group_created` | A new contact group was created. | `index.js` |
| `contacts_searched` | A user searched contacts by name, email, or phone. | `index.js` |
| `contacts_filtered_by_group` | A user filtered the contacts list by a specific group. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818132)
- [Contact events over time](https://us.posthog.com/project/483112/insights/1ygmzf96) — Line chart of contact_created, contact_updated, and contact_deleted over 30 days
- [Contact creation funnel](https://us.posthog.com/project/483112/insights/JTYPQGZY) — Conversion from contacts_searched → contact_created
- [Contact actions breakdown](https://us.posthog.com/project/483112/insights/TfTIhCLB) — Pie chart of create/update/delete ratio over 90 days
- [Contacts searched over time](https://us.posthog.com/project/483112/insights/y1usqJyD) — Daily bar chart of search usage
- [Groups created over time](https://us.posthog.com/project/483112/insights/DONLHfiF) — Line chart of group_created over 30 days

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

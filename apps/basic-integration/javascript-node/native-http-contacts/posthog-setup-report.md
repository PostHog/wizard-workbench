<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this native Node.js contacts API. It installed the `posthog-node` SDK, initialized a shared PostHog client with environment-based configuration, added server-side event capture for group creation, contact filtering, contact creation, contact updates, and contact deletion, added person identification for created and updated contacts, and wired exception capture in the request error path. Environment variables were added locally for the PostHog project token and host, and a dashboard with five related insights was created in PostHog.

| Event name | Description | File |
| --- | --- | --- |
| group_created | Tracks when a new contact group is created through the API. | `index.js` |
| contacts_filtered | Tracks when the contacts list is filtered by group or search criteria. | `index.js` |
| contact_created | Tracks when a new contact record is created through the API. | `index.js` |
| contact_updated | Tracks when an existing contact record is updated through the API. | `index.js` |
| contact_deleted | Tracks when a contact record is deleted through the API. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825355
- Insight: Contacts created over time (wizard) — https://us.posthog.com/project/483112/insights/pHzhF7Rs
- Insight: Contact lifecycle funnel (wizard) — https://us.posthog.com/project/483112/insights/Yct9wAxl
- Insight: Groups created (wizard) — https://us.posthog.com/project/483112/insights/z0fcq98J
- Insight: Filtered contact searches (wizard) — https://us.posthog.com/project/483112/insights/qtm0b07X
- Insight: Contact updates vs deletes (wizard) — https://us.posthog.com/project/483112/insights/V9xhzxl6

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

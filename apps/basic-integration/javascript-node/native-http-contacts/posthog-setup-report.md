# PostHog post-wizard report

The wizard completed a server-side PostHog integration for this native Node.js contacts API. The `posthog-node` SDK was installed, initialized with environment variables, configured for immediate flushing in short-lived request flows, and added alongside the existing HTTP handlers without changing the app's structure. Business events were added for contact and group creation, contact search, read, update, and delete flows, and server-side exception capture was added in the API error path. A PostHog dashboard and five insights were also created to visualize the new analytics coverage.

| Event name | Description | File |
| --- | --- | --- |
| group_created | Tracks successful creation of a contact group through the groups API. | `index.js` |
| contacts_searched | Tracks filtered contact list requests to understand search and group filtering usage. | `index.js` |
| contact_created | Tracks successful creation of a contact record through the contacts API. | `index.js` |
| contact_viewed | Tracks successful retrieval of an individual contact record. | `index.js` |
| contact_updated | Tracks successful updates to an existing contact record. | `index.js` |
| contact_deleted | Tracks successful deletion of a contact record. | `index.js` |
| api_error_captured | Tracks unexpected server errors handled by the contacts API. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846729)
- [Contacts created (wizard)](https://us.posthog.com/project/483112/insights/zWUWCAzB)
- [Group creation volume (wizard)](https://us.posthog.com/project/483112/insights/8KxTOTqI)
- [Searches by filter usage (wizard)](https://us.posthog.com/project/483112/insights/TcBLWQRq)
- [Contact lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/6MQUIVCm)
- [Contact updates vs deletes (wizard)](https://us.posthog.com/project/483112/insights/DhBB7LRE)
- [API errors captured (wizard)](https://us.posthog.com/project/483112/insights/yxuXWGNI)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

An agent skill folder was left in the project under `.claude/skills/integration-javascript_node`. This can be reused for further agent-assisted PostHog work with the same framework context.

# PostHog post-wizard report

The wizard has completed a deep integration of the native HTTP contacts API with PostHog analytics. The `posthog-node` SDK was installed and a singleton client is initialized at startup using environment variables. Five events are captured across all mutating routes, plus exception capture is wired into the server's central error handler. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header so callers can pass their PostHog distinct ID; it falls back to `'anonymous'` when the header is absent.

| Event name | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully added to the address book. | `index.js` |
| `contact updated` | Fired when an existing contact's details are patched. | `index.js` |
| `contact deleted` | Fired when a contact is permanently removed from the address book. | `index.js` |
| `group created` | Fired when a new contact group is created. | `index.js` |
| `contacts searched` | Fired when a user searches or filters contacts by query or group. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829200)
- [Contacts created over time (wizard)](https://us.posthog.com/project/483112/insights/cSSmkBwz) — daily line chart of new contact volume
- [Contact deletions over time (wizard)](https://us.posthog.com/project/483112/insights/jwBqWian) — daily bar chart of contact churn events
- [Contact search activity (wizard)](https://us.posthog.com/project/483112/insights/pL09IojH) — daily line chart of search and filter usage
- [Group creation over time (wizard)](https://us.posthog.com/project/483112/insights/sIZ1sF2X) — weekly bar chart of new group creation
- [Contact lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/0owNzgr2) — ordered funnel from contact created → updated → deleted over 30 days

Dashboard subscription and alerts were not configured — the wizard could not prompt for consent in this environment. You can set these up manually in PostHog under the dashboard's **Share / Subscribe** menu.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

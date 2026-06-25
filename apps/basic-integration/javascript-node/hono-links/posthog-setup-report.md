<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Hono-based bookmark/link saver API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the project token and host. Event capture was added to every route that creates, updates, or deletes data. A `getDistinctId` helper reads the `x-posthog-distinct-id` header for client-side correlation (falling back to the forwarded IP or `anonymous`). Exception capture was added around JSON parsing in write routes. Graceful shutdown handlers flush pending events on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `link_saved` | A user saved a new bookmark link with URL, title, and optional tags. | index.js |
| `link_updated` | A user updated an existing bookmark link's properties. | index.js |
| `link_favorited` | A user toggled the favorite status of a bookmark link. | index.js |
| `link_deleted` | A user deleted a bookmark link from their collection. | index.js |
| `links_searched` | A user searched through their bookmark links by keyword. | index.js |
| `links_filtered_by_tag` | A user filtered their bookmark links by a specific tag. | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** https://us.i.posthog.com/project/483112/dashboard/1751155
- **Links saved over time** (trend): https://us.i.posthog.com/project/483112/insights/0Uv0Wic9
- **Link actions breakdown** (totals): https://us.i.posthog.com/project/483112/insights/pDZ2bj1j
- **Search and filter activity** (trend): https://us.i.posthog.com/project/483112/insights/IprnZDM4
- **Link retention funnel** (link_saved → link_favorited): https://us.i.posthog.com/project/483112/insights/QKbDnOnB
- **Link churn** (link_deleted trend): https://us.i.posthog.com/project/483112/insights/9ZhRyByv

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

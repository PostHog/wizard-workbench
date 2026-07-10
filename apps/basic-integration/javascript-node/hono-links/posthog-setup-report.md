# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Hono-based bookmark link API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. A PostHog client reads its API key and host from environment variables. Helper functions extract the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers from every request so that events can be correlated with a frontend PostHog session if one is present. Five events are captured across the API's route handlers, and graceful shutdown handlers flush any queued events on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `link_saved` | A user saved a new bookmark link with a URL, title, and optional tags. | `index.js` |
| `link_deleted` | A user deleted an existing bookmark link. | `index.js` |
| `link_updated` | A user updated an existing bookmark link's properties (title, URL, description, or tags). | `index.js` |
| `link_favorited` | A user marked or unmarked a bookmark link as a favorite. | `index.js` |
| `links_searched` | A user searched or filtered the list of bookmark links by query term, tag, or favorites. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829186)
- [Links saved over time (wizard)](https://us.posthog.com/project/483112/insights/YV1RkBE4) — daily bar chart of new bookmarks saved
- [Links deleted over time (wizard)](https://us.posthog.com/project/483112/insights/wMrfOcdK) — daily bar chart of bookmarks deleted (churn signal)
- [Link save to delete funnel (wizard)](https://us.posthog.com/project/483112/insights/xl3gkRTY) — ordered funnel from `link_saved` → `link_deleted` within 14 days, showing what share of saved links are later deleted
- [Link engagement breakdown (wizard)](https://us.posthog.com/project/483112/insights/zIbMu72X) — multi-series line chart of saves, updates, and favorites over time
- [Search and filter activity (wizard)](https://us.posthog.com/project/483112/insights/q3WJTZlB) — search usage broken down by whether the user filtered for favorites only

Dashboard subscription and alerts were not configured (the interactive prompt was unavailable in this run). You can set them up manually from the dashboard page in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

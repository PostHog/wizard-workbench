<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the hono-links Hono bookmark API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables. A `getDistinctId` helper reads the `x-posthog-distinct-id` request header so API callers can pass their distinct ID for cross-client correlation. Six events covering the full lifecycle of a bookmark link are now captured, with exception tracking added to the two mutating routes that parse JSON request bodies. Graceful shutdown via `SIGINT`/`SIGTERM` handlers ensures queued events flush before the process exits.

| Event name | Description | File |
|---|---|---|
| `link_saved` | A user saves a new bookmark link to the collection. | `index.js` |
| `link_deleted` | A user deletes an existing bookmark link. | `index.js` |
| `link_updated` | A user updates the details of an existing bookmark link. | `index.js` |
| `link_favorited` | A user marks a bookmark link as a favorite. | `index.js` |
| `links_searched` | A user searches links by keyword query. | `index.js` |
| `links_filtered_by_tag` | A user filters the link list by a specific tag. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793467)
- [Links saved over time](https://us.posthog.com/project/483112/insights/Ll5tusmZ)
- [Links deleted over time (churn)](https://us.posthog.com/project/483112/insights/bljy1xPb)
- [Key management actions](https://us.posthog.com/project/483112/insights/ncFzOtAX)
- [Search and tag filter usage](https://us.posthog.com/project/483112/insights/iQQaLOy4)
- [Links favorited over time](https://us.posthog.com/project/483112/insights/1Um1QoNR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

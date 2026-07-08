# PostHog post-wizard report

The wizard has completed a deep integration of the hono-links Hono/Node.js bookmark API with PostHog analytics. The `posthog-node` SDK was installed and initialised in `index.js` with `enableExceptionAutocapture: true`. A `getDistinctId()` helper reads the `x-posthog-distinct-id` request header (populated by a PostHog JS frontend via `tracing_headers`) so server-side events stay correlated with any client-side session. Five business events are now captured across all mutating routes, plus graceful shutdown via `SIGINT`/`SIGTERM` handlers.

| Event name | Description | File |
|---|---|---|
| `link_saved` | A user saves a new bookmark link with a URL, title, and optional tags. | `index.js` |
| `link_updated` | A user updates an existing bookmark link's properties such as title, URL, or tags. | `index.js` |
| `link_deleted` | A user deletes a bookmark link from their collection. | `index.js` |
| `link_favorited` | A user marks or unmarks a bookmark link as a favorite. | `index.js` |
| `links_searched` | A user searches for bookmark links by keyword or filters by tag. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818120)
- [Links saved over time (wizard)](https://us.posthog.com/project/483112/insights/XzTUs54t)
- [Link actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/5GfGzxM0)
- [Save to delete funnel (wizard)](https://us.posthog.com/project/483112/insights/oR3vTFZA)
- [Links searched over time (wizard)](https://us.posthog.com/project/483112/insights/97vmAoxc)
- [Favorites rate (wizard)](https://us.posthog.com/project/483112/insights/q8z7zshl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

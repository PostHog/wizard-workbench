<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Hono links API. The `posthog-node` SDK was installed and initialised in `index.js` with exception autocapture enabled. A `getDistinctId` helper reads the `x-posthog-distinct-id` header (so client-side sessions can be correlated) and falls back to the forwarded IP or `'anonymous'`. Capture calls were added to every mutating route, plus the search/filter path on `GET /api/links`. Graceful shutdown is handled via `SIGTERM`.

| Event | Description | File |
|---|---|---|
| `link_saved` | Fired when a user successfully saves a new link bookmark. | `index.js` |
| `link_updated` | Fired when a user updates an existing link's details. | `index.js` |
| `link_favorited` | Fired when a user marks a link as a favorite. | `index.js` |
| `link_deleted` | Fired when a user deletes a saved link. | `index.js` |
| `links_searched` | Fired when a user searches or filters the link list. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816732)
- [Link saves over time (wizard)](https://us.posthog.com/project/483112/insights/tx5dkCxE)
- [Link activity overview (wizard)](https://us.posthog.com/project/483112/insights/9E9xozm7)
- [Save to delete funnel (wizard)](https://us.posthog.com/project/483112/insights/LwHreWl8)
- [Links favorited over time (wizard)](https://us.posthog.com/project/483112/insights/11UzqCxa)
- [Links searched over time (wizard)](https://us.posthog.com/project/483112/insights/hDmtowJ3)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>

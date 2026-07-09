<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the Hono links API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. All five key user actions are now tracked: creating a link, updating a link, deleting a link, favoriting a link, and searching/filtering links. A Hono-native error handler (`app.onError`) was added to capture unexpected exceptions with `captureException`. Graceful shutdown is handled on `SIGINT` and `SIGTERM` so queued events flush before the process exits. The `x-posthog-distinct-id` header is read on every request so clients can pass their PostHog distinct ID for cross-context correlation.

| Event | Description | File |
|---|---|---|
| `link_created` | A user saves a new link with a URL and title. | `index.js` |
| `link_updated` | A user updates an existing link's properties such as title, URL, tags, or description. | `index.js` |
| `link_deleted` | A user deletes a saved link by ID. | `index.js` |
| `link_favorited` | A user marks a link as a favorite (or un-favorites one). | `index.js` |
| `links_searched` | A user searches or filters links by tag, keyword, or favorites. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824485)
- **Insight:** [Links created over time](https://us.posthog.com/project/483112/insights/O7Lk1GXX)
- **Insight:** [Link actions breakdown](https://us.posthog.com/project/483112/insights/YvssJxL6)
- **Insight:** [Link creation to deletion funnel](https://us.posthog.com/project/483112/insights/1otwslw2)
- **Insight:** [Links searched vs created](https://us.posthog.com/project/483112/insights/zEcfKf1m)
- **Insight:** [Favorited links total](https://us.posthog.com/project/483112/insights/KiyAmNW1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

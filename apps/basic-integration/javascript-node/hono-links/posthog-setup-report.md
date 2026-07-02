<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the hono-links bookmark API. A single file (`index.js`) was updated to:

- Import and initialize the `posthog-node` SDK using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`)
- Capture events for every meaningful user action: saving, updating, deleting, favoriting, and unfavoriting links
- Read the `x-posthog-distinct-id` request header so callers can pass their PostHog distinct ID and keep server-side events correlated with client-side sessions
- Capture server-side exceptions via `app.onError` using `posthog.captureException`
- Flush the SDK cleanly on `SIGTERM` via `posthog.shutdown()`

| Event name | Description | File |
|---|---|---|
| `link_saved` | A user saved a new link with a URL, title, tags, and description. | index.js |
| `link_updated` | A user updated an existing link's properties such as URL, title, tags, or description. | index.js |
| `link_deleted` | A user deleted a saved link. | index.js |
| `link_favorited` | A user marked a link as a favorite. | index.js |
| `link_unfavorited` | A user removed a link from their favorites. | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792422)
- [Links saved over time](https://us.posthog.com/project/483112/insights/EfQMj66u)
- [Links deleted over time](https://us.posthog.com/project/483112/insights/KNdYFRoO)
- [Links favorited vs unfavorited](https://us.posthog.com/project/483112/insights/JLEw6Usl)
- [Link lifecycle funnel (saved → updated → deleted)](https://us.posthog.com/project/483112/insights/yKPqXgmv)
- [Server errors over time](https://us.posthog.com/project/483112/insights/X2Y6YpsE)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

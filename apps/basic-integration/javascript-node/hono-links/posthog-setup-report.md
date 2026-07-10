<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Hono-based link management API with PostHog. The `posthog-node` SDK was installed, PostHog environment variables were added locally, the server now initializes a shared PostHog client with exception autocapture enabled, and key server-side actions now emit analytics events. Bookmark creation, update, deletion, favorite toggling, and filtered link retrieval are captured from the API handlers. Returning authenticated requests can also update person properties through `identify()` when an `x-user-id` or `x-posthog-distinct-id` header is present. Graceful shutdown handling was added so queued analytics events are flushed on process exit.

| Event name | Description | File |
| --- | --- | --- |
| `link_created` | Captures when a new bookmark is successfully saved. | `index.js` |
| `link_updated` | Captures when an existing bookmark is edited. | `index.js` |
| `link_deleted` | Captures when a saved bookmark is removed. | `index.js` |
| `favorite_toggled` | Captures when a bookmark favorite status is changed. | `index.js` |
| `links_filtered` | Captures when the links API is queried with search or filter parameters. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831033)
- [Create to favorite funnel (wizard)](https://us.posthog.com/project/483112/insights/n3RW7DBM)
- [Link lifecycle activity (wizard)](https://us.posthog.com/project/483112/insights/rC1IhThc)
- [Links created over time (wizard)](https://us.posthog.com/project/483112/insights/mlClQ5Eg)
- [Filtered link searches (wizard)](https://us.posthog.com/project/483112/insights/2OmTUTfH)
- [Favorites toggled (wizard)](https://us.posthog.com/project/483112/insights/baHMDhsm)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for the `hono-links` Hono bookmark API. The `posthog-node` SDK was installed, a PostHog client was initialized using environment variables, and `posthog.capture()` calls were added to every mutating route handler. Exception capture was added to the POST and PATCH handlers. Graceful shutdown (`posthog.shutdown()`) is registered on `SIGINT` and `SIGTERM` so queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `link_saved` | A user saved a new bookmark link. | `index.js` |
| `link_updated` | A user updated an existing bookmark link. | `index.js` |
| `link_favorited` | A user marked a link as a favorite. | `index.js` |
| `link_deleted` | A user deleted a saved bookmark link. | `index.js` |
| `links_searched` | A user searched or filtered their bookmark list. | `index.js` |

## Next steps

To view the analytics for these events, visit your PostHog project and create a dashboard with the following suggested insights:

- **Link saves over time** — Trend of `link_saved` events, showing growth in usage
- **Link deletions (churn)** — Trend of `link_deleted` events to monitor churn
- **Search/filter activity** — Trend of `links_searched` events broken down by `tag`, `search`, and `favorites_only` properties
- **Favorites conversion funnel** — `link_saved` → `link_favorited` funnel to measure engagement depth
- **Updates breakdown** — Breakdown of `link_updated` events by `fields_updated` to see what users change most

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

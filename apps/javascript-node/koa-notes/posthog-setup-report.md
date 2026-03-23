<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa Notes API with PostHog. The `posthog-node` SDK has been installed and initialized in `index.js` with exception autocapture enabled. Event tracking calls have been added to every mutation route, error tracking has been wired into Koa's app-level error handler, and graceful shutdown handlers have been registered for `SIGINT` and `SIGTERM` signals. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` header from incoming requests so that client-side and server-side events can be correlated when a distinct ID is forwarded from the frontend.

| Event name | Description | File |
|---|---|---|
| `folder created` | Fired when a user successfully creates a new folder | `index.js` |
| `folder deleted` | Fired when a user successfully deletes a folder | `index.js` |
| `note created` | Fired when a user successfully creates a new note | `index.js` |
| `note updated` | Fired when a user successfully updates a note | `index.js` |
| `note deleted` | Fired when a user successfully deletes a note | `index.js` |

## Next steps

Head to your PostHog project to explore the events and build insights:

- [PostHog project dashboard](https://us.posthog.com/project/238460/dashboard)
- [Explore events in Activity](https://us.posthog.com/project/238460/activity/explore)

Suggested insights to create in an **Analytics basics** dashboard:

1. **Notes created over time** — Trends chart for `note created`, daily interval
2. **Content creation funnel** — Funnel: `folder created` → `note created`
3. **Note operations breakdown** — Trends chart with `note created`, `note updated`, and `note deleted` on the same axis
4. **Folder churn** — Trends chart for `folder deleted` to monitor folder removal rate
5. **Note deletion rate** — Trends chart for `note deleted` to watch for unexpected spikes

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

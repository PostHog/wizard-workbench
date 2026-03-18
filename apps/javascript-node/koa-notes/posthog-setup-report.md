<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Koa Notes API. The `posthog-node` SDK was installed and initialized in `index.js` with environment-variable-based configuration. Event capture calls were added to all mutating route handlers (create, update, delete) and to the notes search route. An application-level error handler using `app.on('error', ...)` was added to capture exceptions with `posthog.captureException()`. Graceful shutdown hooks for `SIGINT` and `SIGTERM` ensure all queued events are flushed before the process exits. A `getDistinctId()` helper reads the `X-POSTHOG-DISTINCT-ID` request header so client-generated distinct IDs can be correlated with backend events.

| Event name | Description | File |
|---|---|---|
| `note created` | A new note was created | `index.js` |
| `note updated` | An existing note was updated | `index.js` |
| `note deleted` | A note was deleted | `index.js` |
| `note searched` | Notes were searched using the search query parameter | `index.js` |
| `folder created` | A new folder was created | `index.js` |
| `folder deleted` | A folder was deleted and its notes moved to General | `index.js` |

## Next steps

Visit your PostHog project to build insights and a dashboard from these events:

- **PostHog Project**: https://us.posthog.com/project/2
- **Create a new dashboard**: https://us.posthog.com/project/2/dashboard/new

Suggested insights to create in an "Analytics basics" dashboard:

1. **Notes created over time** — Trend of `note created` events to track content creation velocity
2. **Notes deleted over time** — Trend of `note deleted` events to spot churn signals
3. **Search usage** — Trend of `note searched` events with a breakdown by `results_count` to see search effectiveness
4. **Folder operations** — Stacked bar of `folder created` and `folder deleted` events over time
5. **Content creation funnel** — Funnel from `folder created` → `note created` to measure folder adoption

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

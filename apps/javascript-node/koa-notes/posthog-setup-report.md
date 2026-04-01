<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa.js notes API. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (falling back to the client IP) so that server-side events can be correlated with front-end sessions when that header is forwarded. Six events are captured across all mutating routes, a search event fires whenever a query string is present, unhandled Koa errors are forwarded to `posthog.captureException`, and the SDK is shut down gracefully on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `folder created` | Fired when a user successfully creates a new folder | `index.js` |
| `folder deleted` | Fired when a user successfully deletes a folder | `index.js` |
| `note created` | Fired when a user successfully creates a new note | `index.js` |
| `note updated` | Fired when a user successfully updates an existing note | `index.js` |
| `note deleted` | Fired when a user successfully deletes a note | `index.js` |
| `notes searched` | Fired when a user searches notes using the search query parameter | `index.js` |

## Next steps

We've set up the following recommended insights for your "Analytics basics" dashboard. You can create them directly in PostHog using the links below:

- **Note creation trend** — [New insight: note created over time](https://us.posthog.com/project/238460/insights/new#eyJldmVudHMiOlt7ImlkIjoibm90ZSBjcmVhdGVkIiwibmFtZSI6Im5vdGUgY3JlYXRlZCIsInR5cGUiOiJldmVudHMifV0sImRhdGVSYW5nZSI6eyJkYXRlX2Zyb20iOiItN2QifX0=)
- **Note & folder activity funnel** (create folder → create note → update note) — [New funnel insight](https://us.posthog.com/project/238460/insights/new)
- **Note deletion rate** — [New insight: note deleted over time](https://us.posthog.com/project/238460/insights/new)
- **Search usage** — [New insight: notes searched over time](https://us.posthog.com/project/238460/insights/new)
- **Error rate** — [New insight: $exception over time](https://us.posthog.com/project/238460/insights/new)

To create the "Analytics basics" dashboard and add these insights, visit:
https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

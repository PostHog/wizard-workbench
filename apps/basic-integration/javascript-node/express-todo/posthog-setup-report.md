# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Express Todo API. The `posthog-node` SDK was installed and a PostHog client is initialized at startup using environment variables. Every route that mutates data now captures a PostHog event with contextual properties. Users are identified via an optional `X-POSTHOG-DISTINCT-ID` request header (falling back to `"anonymous"`), enabling correlation between client-side and server-side events. An Express error middleware captures unhandled exceptions with `captureException`, and the server shuts down cleanly on SIGINT by calling `posthog.shutdown()`.

| Event name | Description | File |
|---|---|---|
| `todo created` | A new todo item was created | `index.js` |
| `todo updated` | A todo item's title or completion status was updated | `index.js` |
| `todo completed` | A todo item was marked as completed | `index.js` |
| `todo deleted` | A todo item was deleted | `index.js` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with these suggested insights:

- **Todos created over time** — Trends chart for the `todo created` event
- **Todos completed over time** — Trends chart for the `todo completed` event
- **Todo completion funnel** — Funnel from `todo created` → `todo completed`
- **Todo deletion rate** — Trends chart for the `todo deleted` event
- **Overall todo activity** — Trends chart comparing all four events side-by-side

Visit your [PostHog project](/insights) to build these insights using the event names in the table above.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

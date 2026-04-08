<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the `hono-links` Hono.js bookmark API. The `posthog-node` SDK was installed and configured using environment variables. Event tracking was added to all mutating API routes, with error tracking middleware and graceful shutdown handling included.

| Event | Description | File |
|---|---|---|
| `link saved` | Fired when a user successfully saves a new bookmark link | `index.js` |
| `link updated` | Fired when a user updates an existing bookmark link's properties | `index.js` |
| `link favorited` | Fired when a user marks a link as a favorite | `index.js` |
| `link deleted` | Fired when a user deletes a bookmark link | `index.js` |

## Next steps

To explore insights and build a dashboard based on the events instrumented above, visit your PostHog project:

- **Events explorer**: https://us.posthog.com/project/2/events
- **Create a Trends insight** for `link saved` over time: https://us.posthog.com/project/2/insights/new
- **Create a Funnel** from `link saved` → `link favorited` to track engagement: https://us.posthog.com/project/2/insights/new
- **Dashboards**: https://us.posthog.com/project/2/dashboard

Suggested insights to build in the "Analytics basics" dashboard:
1. **Links saved over time** — Trends chart for `link saved`
2. **Links deleted over time** — Trends chart for `link deleted`
3. **Save to favorite funnel** — Funnel from `link saved` → `link favorited`
4. **Top tags** — Breakdown of `link saved` by `tags` property
5. **Update vs delete rate** — Bar chart comparing `link updated` vs `link deleted`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

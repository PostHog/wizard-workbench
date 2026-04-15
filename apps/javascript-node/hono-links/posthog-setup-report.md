<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Hono.js link saver API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables. Event tracking was added to all mutating and filtering route handlers, exception capture was added to the global error handler, and graceful shutdown hooks ensure no events are lost on process exit.

| Event Name | Description | File |
|---|---|---|
| `link_saved` | A new bookmark link is saved via POST /api/links | `index.js` |
| `link_updated` | An existing bookmark link is updated (title, url, description, or tags) via PATCH /api/links/:id | `index.js` |
| `link_favorited` | A link's favorite status is toggled via PATCH /api/links/:id | `index.js` |
| `link_deleted` | A bookmark link is deleted via DELETE /api/links/:id | `index.js` |
| `links_searched` | User searches or filters links by tag, keyword, or favorites via GET /api/links | `index.js` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to track user behavior based on the events just instrumented. Create it in PostHog with the insights below:

- **Dashboard**: [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

Recommended insights to add to the dashboard:

- **Links saved over time** — Trend of `link_saved` events: [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"link_saved","name":"link_saved","type":"events","order":0}]})
- **Save → Favorite conversion funnel** — Funnel from `link_saved` → `link_favorited`: [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"link_saved","name":"link_saved","type":"events","order":0},{"id":"link_favorited","name":"link_favorited","type":"events","order":1}]})
- **Link deletion rate** — Trend of `link_deleted` events over time: [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"link_deleted","name":"link_deleted","type":"events","order":0}]})
- **Save → Delete churn funnel** — Funnel from `link_saved` → `link_deleted`: [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"link_saved","name":"link_saved","type":"events","order":0},{"id":"link_deleted","name":"link_deleted","type":"events","order":1}]})
- **Search activity** — Trend of `links_searched` events (how often users filter/search): [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"links_searched","name":"links_searched","type":"events","order":0}]})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Fastify blog API with PostHog analytics. The `index.js` file was updated to include full PostHog instrumentation: a `PostHog` client is initialized from environment variables (`POSTHOG_API_KEY` and `POSTHOG_HOST`), helper functions `trackEvent()` and `identifyUser()` were added, event capture calls were placed in every route that creates, updates, or deletes data, a global Fastify error handler captures exceptions with `posthog.captureException()`, and a graceful shutdown handler ensures buffered events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post_published` | Fired when a post's published status is set to true via PATCH | `index.js` |
| `post_updated` | Fired when a post's title or body is updated | `index.js` |
| `post_deleted` | Fired when a post and its comments are deleted | `index.js` |
| `post_viewed` | Fired when a single post is retrieved – top of the reading funnel | `index.js` |
| `comment_added` | Fired when a user adds a comment to a post – engagement metric | `index.js` |

## Next steps

We've prepared the following insights and a dashboard for you to monitor user behavior based on the events we just instrumented. You can create them directly in PostHog:

- **[Analytics basics dashboard](https://us.posthog.com/project/238460/dashboards)** – Create a new dashboard named "Analytics basics" and add the insights below.
- **[Post creation trend](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"post_created","custom_name":"Posts Created"}],"dateRange":{"date_from":"-30d"},"trendsFilter":{"display":"ActionsLineGraph"}}})** – Daily trend of `post_created` events to track content creation volume.
- **[Publishing conversion funnel](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"FunnelsQuery","series":[{"kind":"EventsNode","event":"post_created","custom_name":"Post Created"},{"kind":"EventsNode","event":"post_published","custom_name":"Post Published"}],"dateRange":{"date_from":"-30d"}}})** – Funnel from `post_created` → `post_published` to measure how many posts actually get published.
- **[Engagement trend](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"comment_added","custom_name":"Comments Added"},{"kind":"EventsNode","event":"post_viewed","custom_name":"Posts Viewed"}],"dateRange":{"date_from":"-30d"},"trendsFilter":{"display":"ActionsLineGraph"}}})** – Overlay of `comment_added` and `post_viewed` to track reader engagement.
- **[Churn signals](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"post_deleted","custom_name":"Posts Deleted"}],"dateRange":{"date_from":"-30d"},"trendsFilter":{"display":"ActionsLineGraph"}}})** – Daily `post_deleted` events as a churn indicator.
- **[Author activity](https://us.posthog.com/project/238460/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","breakdown":{"breakdown_type":"person","breakdown":"$distinct_id"},"series":[{"kind":"EventsNode","event":"post_created"}],"dateRange":{"date_from":"-30d"}}})** – `post_created` breakdown by author (`$distinct_id`) to identify your most active contributors.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

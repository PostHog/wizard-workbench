<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is now initialized on app boot (`src/main.js`) with your project token and host pulled from environment variables. A global Vue error handler forwards all uncaught exceptions to PostHog. Users are identified by username on login and their session is reset on logout. Six custom events have been instrumented across four files covering authentication, content discovery, search, and trailer engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; calls `posthog.identify` with the username | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button; calls `posthog.reset()` to clear the session | `src/components/NavBar.vue` |
| `media_detail_viewed` | Fired when a movie or TV show detail page loads with real data; includes `media_id`, `media_type`, `media_title`, `release_year`, and `vote_average` | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal; includes `media_id`, `media_type`, and `media_title` | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired on search submission; includes `query` and `result_count` | `src/views/SearchView.vue` |
| `search_result_clicked` | Fired when a user clicks a search result card; includes `query`, `media_id`, `media_type`, and `media_title` | `src/views/SearchView.vue` |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior. Use the links below to open the insight builder with the correct project pre-selected:

- [Login trend — how many users are logging in each day](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","math":"dau","type":"events","name":"user_logged_in"}]})
- [Login → media view conversion funnel — what share of logged-in users browse content](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"user_logged_in","type":"events"},{"id":"media_detail_viewed","type":"events"}]})
- [Top searched queries — most common search terms by frequency](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"search_performed","math":"total","type":"events","name":"search_performed"}],"breakdown":"query","breakdown_type":"event"})
- [Trailer engagement — which media items drive the most trailer views](https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"trailer_played","math":"total","type":"events","name":"trailer_played"}],"breakdown":"media_title","breakdown_type":"event"})
- [Search → click conversion — what share of searches lead to a result click](https://us.posthog.com/project/238460/insights/new#{"insight":"FUNNELS","events":[{"id":"search_performed","type":"events"},{"id":"search_result_clicked","type":"events"}]})

You can also visit your [PostHog dashboards](https://us.posthog.com/project/238460/dashboard) to create an "Analytics basics" dashboard and pin these insights to it.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

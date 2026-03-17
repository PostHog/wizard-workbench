<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog `posthog-js` was installed and initialized in `src/main.js` with a global Vue error handler that forwards uncaught exceptions to PostHog. Environment variables (`VITE_POSTHOG_PROJECT_TOKEN`, `VITE_POSTHOG_HOST`) were created in `.env` to keep credentials out of source code. User identification is performed on login and PostHog state is reset on logout. Five event tracking calls were added across four files, covering the core user journey.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; PostHog `identify()` is called with the username | `src/views/LoginView.vue` |
| `user_logged_out` | User logs out; PostHog `reset()` clears the session | `src/components/NavBar.vue` |
| `media_searched` | User submits a search query with result count | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (media ID, type, title) | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opens the trailer modal (media ID, type, title) | `src/views/MediaDetailView.vue` |

## Next steps

To visualise this data, create a dashboard called **"Analytics basics"** in PostHog ([https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards)) and add the following insights:

1. **Login trend** – trend of `user_logged_in` over time to track daily active users.
2. **Search activity** – trend of `media_searched` with breakdown by `result_count` to understand zero-result searches.
3. **Content engagement funnel** – funnel from `media_detail_viewed` → `trailer_played` to measure trailer engagement rate.
4. **Logout rate** – trend of `user_logged_out` vs `user_logged_in` to monitor churn signals.
5. **Top searched queries** – aggregation of `media_searched` broken down by `query` property to discover popular titles.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

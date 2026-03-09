<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Vue 3 Movies application. The `posthog-js` SDK was installed and initialized in `src/main.js` with environment-variable-based configuration. A global Vue error handler was added to automatically capture uncaught errors. User identification is performed on login and the PostHog session is reset on logout. Custom events are captured at key engagement points including media detail views, trailer plays, searches, and navigation to media list pages.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Also calls `posthog.identify()` to associate the session with the username. | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out. Also calls `posthog.reset()` to clear the session. | `src/composables/useAuth.ts` |
| `media_viewed` | Fired when a user views a movie or TV show detail page. Captures `media_id`, `media_type`, and `media_title`. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks the Watch Trailer button. Captures `media_id`, `media_type`, and `media_title`. | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired when a user performs a search. Captures `query` text and `result_count`. | `src/views/SearchView.vue` |
| `media_list_viewed` | Fired when a user navigates to the movies or TV shows list page. Captures `media_type`. | `src/views/MediaListView.vue` |

## Next steps

We attempted to create an "Analytics basics" dashboard but the PostHog API key lacks the required `dashboard:write` scope. You can create it manually in PostHog with the following suggested insights:

1. **Daily active users** — Trend of unique users per day (any event)
2. **Login funnel** — Funnel from `media_list_viewed` → `media_viewed` → `trailer_played` (engagement funnel)
3. **Search volume & results** — Trend of `search_performed` events, broken down by `result_count = 0` (zero-result searches indicate content gaps)
4. **Most viewed media** — `media_viewed` event broken down by `media_title` property
5. **Churn signal** — Trend of `user_logged_out` events compared to `user_logged_in` (retention indicator)

To create the dashboard, visit: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

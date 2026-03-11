<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application. The `posthog-js` SDK was installed and initialized in `src/main.js` with environment variable configuration, a global Vue error handler capturing all uncaught exceptions, and user identification on login/logout. Custom events were added across authentication, media browsing, search, and content engagement flows.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify()` to link the user session | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired on logout; also calls `posthog.reset()` to clear the session | `src/composables/useAuth.ts` |
| `media_viewed` | Fired when a movie or TV show detail page fully loads; captures media id, type, title, genres, and release year | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks the "Watch Trailer" button; captures media id, type, and title | `src/views/MediaDetailView.vue` |
| `media_searched` | Fired when a search query is submitted; captures the search query and result count | `src/views/SearchView.vue` |
| `media_search_result_clicked` | Fired when a user clicks a media card (in search or carousel); captures media id, type, and title | `src/components/media/MediaCard.vue` |

## Next steps

We've built some suggested insights for a dashboard to keep an eye on user behavior, based on the events we just instrumented. You can create these in PostHog at https://us.posthog.com/project/2/dashboard:

1. **Login Conversion Funnel** — Funnel from `$pageview` (path `/login`) → `user_logged_in`. Shows what % of visitors successfully log in.
2. **Media Discovery Funnel** — Funnel from `user_logged_in` → `media_searched` → `media_search_result_clicked` → `media_viewed`. Shows the full content discovery flow.
3. **Trailer Engagement** — Trend of `trailer_played` over time, broken down by `media_type` (movie vs TV). Shows which content type drives trailer views.
4. **Search Effectiveness** — Average `result_count` property on `media_searched` events. Low values indicate users aren't finding what they want.
5. **Session Retention** — Users who logged in (`user_logged_in`) vs users who logged out (`user_logged_out`) over time. A high ratio of logins to logouts may indicate session problems.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

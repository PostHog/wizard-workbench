<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application. PostHog was installed and initialized in `src/main.js` with your project token and host from environment variables, along with a global Vue error handler that forwards uncaught exceptions to PostHog. User identification is performed on login via `posthog.identify()` with the username, and `posthog.reset()` is called on logout to clear the session. Eight custom events were instrumented across five files covering the core user journey: authentication, content discovery, media browsing, and trailer playback.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in with a username | `src/composables/useAuth.ts` |
| `user_logged_out` | User clicked the logout button and was redirected to login | `src/composables/useAuth.ts` |
| `login_failed` | User attempted to log in but the login call threw an error | `src/views/LoginView.vue` |
| `search_performed` | User submitted a search query for movies or TV shows | `src/views/SearchView.vue` |
| `media_detail_viewed` | User viewed the detail page for a movie or TV show (top of browsing funnel) | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicked the Watch Trailer button to open the trailer modal | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicked a media card (movie or TV show) from a list or carousel | `src/components/media/MediaCard.vue` |
| `recommendation_clicked` | User clicked a recommendation card on a media detail page | `src/views/MediaDetailView.vue` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- [New dashboard](https://us.posthog.com/project/2/dashboard/new) — Create "Analytics basics" with up to five insights:
  1. **Login trend** — Trends insight on `user_logged_in` to track daily active users signing in
  2. **Browsing-to-trailer funnel** — Funnel from `media_detail_viewed` → `trailer_played` to measure engagement conversion
  3. **Search engagement** — Trends on `search_performed` with breakdown by `result_count` to see search effectiveness
  4. **Content discovery funnel** — Funnel from `media_card_clicked` → `media_detail_viewed` → `recommendation_clicked`
  5. **Login failure rate** — Trends comparing `user_logged_in` vs `login_failed` to monitor auth health

Direct links to build these insights:
- [Create new insight](https://us.posthog.com/project/2/insights/new)
- [PostHog project dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

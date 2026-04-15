<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Vue Movies app. `posthog-js` was installed, initialized in `src/main.js` with environment-variable-based configuration, and event tracking was added across all major user interaction points. A global Vue error handler was also wired up so uncaught errors are automatically sent to PostHog.

## Changes summary

| File | Change |
|---|---|
| `src/main.js` | Initializes PostHog with `VITE_POSTHOG_PROJECT_TOKEN` / `VITE_POSTHOG_HOST`; adds global `app.config.errorHandler` for exception capture |
| `src/composables/useAuth.ts` | Calls `posthog.identify()` + captures `user_logged_in` on login; captures `user_logged_out` and calls `posthog.reset()` on logout |
| `src/views/LoginView.vue` | Captures `login_failed` with error message on failed login attempt |
| `src/views/SearchView.vue` | Captures `search_performed` (with query + result count) and `search_results_empty` after each search |
| `src/views/MediaDetailView.vue` | Captures `media_detail_viewed` after real media data loads; captures `trailer_played` and `trailer_closed` with media context |
| `src/components/media/MediaCard.vue` | Captures `media_card_clicked` with media id, type, and title on every card click |
| `src/components/NavBar.vue` | Captures `nav_section_clicked` with section name on home, movies, tv, and search nav links |
| `.env` | Created with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and logged in | `src/composables/useAuth.ts` |
| `user_logged_out` | User logged out of the app | `src/composables/useAuth.ts` |
| `login_failed` | Login attempt failed with an error | `src/views/LoginView.vue` |
| `search_performed` | User submitted a search query for movies or TV shows | `src/views/SearchView.vue` |
| `search_results_empty` | Search returned no results for the given query | `src/views/SearchView.vue` |
| `media_detail_viewed` | User viewed the detail page for a movie or TV show | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicked to play the trailer | `src/views/MediaDetailView.vue` |
| `trailer_closed` | User closed the trailer modal | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicked on a media card | `src/components/media/MediaCard.vue` |
| `nav_section_clicked` | User clicked a navigation link | `src/components/NavBar.vue` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the following five recommended insights:

1. **Login funnel** — Funnel from `user_logged_in` → `media_detail_viewed` → `trailer_played`
   Track how many users log in, discover content, and engage with trailers.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily active users** — Unique users triggering `user_logged_in` over time (trend)
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trend)

3. **Top searched queries** — Breakdown of `search_performed` by `query` property
   Understand what content users are looking for.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trend)

4. **Search success rate** — `search_performed` vs `search_results_empty` counts over time
   Monitor how often searches return no results (potential churn signal).
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trend)

5. **Trailer engagement** — `trailer_played` events broken down by `media_type` (movie vs tv)
   Identify which content type drives the most trailer engagement.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trend)

[Open PostHog project dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

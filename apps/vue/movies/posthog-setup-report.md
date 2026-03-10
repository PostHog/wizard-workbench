<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. The following changes were made:

- **`src/main.js`**: Initialized `posthog-js` before the Vue app mounts, using environment variables for the API key and host. Added a global `app.config.errorHandler` that calls `posthog.captureException()` to automatically track any uncaught Vue errors.
- **`src/composables/useAuth.ts`**: Added `posthog.identify()` on successful login to link events to a known user. Added `posthog.capture('user_logged_in')` on login and `posthog.capture('user_logged_out')` on logout. Added `posthog.reset()` on logout to clear the PostHog session.
- **`src/views/MediaDetailView.vue`**: Added `posthog.capture('media_viewed')` after real media data loads successfully, with properties for media ID, type, title, and release year. Added `posthog.capture('trailer_played')` when the user opens the trailer modal.
- **`src/views/SearchView.vue`**: Added `posthog.capture('media_searched')` after a search completes, with the query text and result count as properties.
- **`src/components/media/MediaCard.vue`**: Added `posthog.capture('search_result_clicked')` when a media card is clicked, with the media ID, type, and title as properties.
- **`.env`**: Created with `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logged in | `src/composables/useAuth.ts` |
| `user_logged_out` | User logged out and session was reset | `src/composables/useAuth.ts` |
| `media_viewed` | User viewed detail page for a movie or TV show | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicked to play a trailer for a movie or TV show | `src/views/MediaDetailView.vue` |
| `media_searched` | User performed a search for movies or TV shows | `src/views/SearchView.vue` |
| `search_result_clicked` | User clicked on a media card (search result or carousel) | `src/components/media/MediaCard.vue` |

## Next steps

To monitor user behavior, create an "Analytics basics" dashboard in PostHog with these recommended insights:

1. **Login trend** — Trend of `user_logged_in` over time
2. **Search → View funnel** — Funnel: `media_searched` → `search_result_clicked` → `media_viewed`
3. **Trailer engagement** — Trend of `trailer_played` grouped by `media_type`
4. **Top searched queries** — `media_searched` breakdown by `search_query`
5. **Churn signal** — Trend of `user_logged_out` over time

You can create these at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

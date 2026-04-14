<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. Here is a summary of all changes made:

- **`src/main.js`** — PostHog is initialized once before the app mounts, using `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables. A global Vue `errorHandler` is registered to forward uncaught errors to PostHog via `captureException`.
- **`src/composables/useAuth.ts`** — On successful login, `posthog.identify()` is called with the username to link subsequent events to a known user, followed by a `user_logged_in` capture. On logout, `user_logged_out` is captured and `posthog.reset()` clears the session so the next login starts fresh.
- **`src/views/SearchView.vue`** — After a successful search API call, `search_performed` is captured with the query text and result count. Errors are forwarded to `captureException`.
- **`src/views/MediaDetailView.vue`** — After real media data loads, `media_detail_viewed` is captured with the media ID, type, title, and release year. When a user opens the trailer modal, `trailer_played` is captured. API errors are forwarded to `captureException`.
- **`src/components/media/MediaCard.vue`** — A click handler captures `media_card_clicked` with the media ID, type, and title whenever a user navigates to a detail page from a card.
- **`.env`** — `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` have been written (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out | `src/composables/useAuth.ts` |
| `search_performed` | Fired when a user submits a search query | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user plays a trailer on the media detail page | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks on a media card | `src/components/media/MediaCard.vue` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Login funnel** — Funnel insight: `user_logged_in` → `media_detail_viewed` → `trailer_played`. Tracks how many users go from signing in to watching a trailer.
- **Search usage over time** — Trend insight for `search_performed`. Helps understand how often users search and whether search drives engagement.
- **Top viewed media** — Trend insight for `media_detail_viewed`, broken down by `media_title`. Shows which movies and TV shows are most popular.
- **Trailer engagement rate** — Trend insight comparing `trailer_played` vs `media_detail_viewed`. Measures what fraction of detail views convert to trailer plays.
- **Daily active users** — Trend insight for `user_logged_in` (unique users). Tracks retention and growth over time.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

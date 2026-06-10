<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies app. The following changes were made:

- **`src/main.js`** — Initialized `posthog-js` with the project token and host from environment variables. Added a global Vue `errorHandler` that forwards uncaught Vue errors to PostHog via `captureException`.
- **`src/views/LoginView.vue`** — Added `posthog.identify()` with the authenticated username and a `user_logged_in` capture call after a successful login.
- **`src/components/NavBar.vue`** — Added a `user_logged_out` capture and `posthog.reset()` before the logout call so the PostHog session is cleared cleanly.
- **`src/views/MediaDetailView.vue`** — Added a `media_viewed` capture (with `media_id`, `media_type`, and `media_title` properties) after real media data loads, and a `trailer_played` capture when a user opens the trailer modal.
- **`src/views/SearchView.vue`** — Added a `search_performed` capture (with `query` and `result_count` properties) after a successful search.
- **`.env`** — Created with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` set to the project values.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button | `src/components/NavBar.vue` |
| `media_viewed` | User views a movie or TV show detail page | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opens the trailer modal for a movie or TV show | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query | `src/views/SearchView.vue` |

## Next steps

Create an **"Analytics basics (wizard)"** dashboard in PostHog with insights for these events:

- [Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named `Analytics basics (wizard)`
- [New insight](https://us.posthog.com/project/2/insights/new) — suggested insights to add:
  1. **Login funnel** — funnel from `user_logged_in` to `media_viewed` to track conversion from login to content engagement
  2. **Search → Content trend** — trends for `search_performed` and `media_viewed` over time
  3. **Trailer engagement** — trend of `trailer_played` events
  4. **Logout / churn** — trend of `user_logged_out` events to track session churn
  5. **Content popularity breakdown** — `media_viewed` broken down by `media_type` (movie vs. tv)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

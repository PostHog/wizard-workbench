<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. The `posthog-js` SDK was installed and initialized in `src/main.js` with environment variables. A global Vue error handler was added to automatically capture unhandled exceptions. User identification is performed on login, and `posthog.reset()` is called on logout to clear the session. Six meaningful events covering the core user journey — login, logout, search, media browsing, trailer watching, and card clicks — were instrumented across the application.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Identifies the user in PostHog via `posthog.identify()`. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. Resets the PostHog session. | `src/components/NavBar.vue` |
| `media_searched` | Fired when a user submits a search query. Captures `query` and `results_count`. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when media data loads successfully on a detail page. Captures `media_type`, `media_id`, `media_title`. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal. Captures `media_type`, `media_id`, `media_title`. | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks any media card. Captures `media_type`, `media_id`, `media_title`. | `src/components/media/MediaCard.vue` |

## Files modified

- **`src/main.js`** — PostHog initialized with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` env vars; global `app.config.errorHandler` added for exception capture.
- **`src/views/LoginView.vue`** — `posthog.identify()` + `posthog.capture('user_logged_in')` on successful login; `posthog.captureException()` on login error.
- **`src/components/NavBar.vue`** — `posthog.capture('user_logged_out')` + `posthog.reset()` before logout.
- **`src/views/SearchView.vue`** — `posthog.capture('media_searched')` after successful search; `posthog.captureException()` on search error.
- **`src/views/MediaDetailView.vue`** — `posthog.capture('media_detail_viewed')` after media loads; `posthog.capture('trailer_played')` on trailer button click; `posthog.captureException()` on load error.
- **`src/components/media/MediaCard.vue`** — `posthog.capture('media_card_clicked')` on card click.

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Login funnel** — Trend of `user_logged_in` over time to track daily active users
2. **Search usage** — Trend of `media_searched` with average `results_count` to understand search demand
3. **Media engagement funnel** — Conversion funnel: `media_card_clicked` → `media_detail_viewed` → `trailer_played`
4. **Trailer play rate** — `trailer_played` / `media_detail_viewed` ratio to measure content engagement
5. **Churn signal** — Trend of `user_logged_out` events to monitor session endings

Visit your [PostHog project](https://us.posthog.com/project/2) to create these insights and add them to a new dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

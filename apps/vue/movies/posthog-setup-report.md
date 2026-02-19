<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is now initialized at app boot in `src/main.js` using environment variables, with a global Vue error handler that sends all uncaught exceptions to PostHog via `captureException`. Users are identified by username on login, and their session is fully reset on logout. Six meaningful business events have been instrumented across five source files, covering the full user journey from login through content discovery, browsing, searching, and engagement.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Calls `posthog.identify(username)` to link the session to the user, then captures the event. Top of the conversion funnel. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when the user explicitly logs out. Calls `posthog.reset()` to clear the session and unlink the identity. Churn/session-end signal. | `src/components/NavBar.vue` |
| `media_viewed` | Fired after the real media data loads on a detail page. Includes `media_type`, `media_id`, `title`, and `genres`. Key engagement event. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the user clicks "Watch Trailer". Includes `media_type`, `media_id`, and `title`. High-intent engagement signal. | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired after a search completes. Includes `query` and `result_count`. Tracks discovery intent. | `src/views/SearchView.vue` |
| `media_browsed` | Fired when the user visits a movies or TV list page. Includes `media_type`. Tracks category-level interest. | `src/views/MediaListView.vue` |

## Files changed

- **`src/main.js`** — PostHog initialized with `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` env vars; global `app.config.errorHandler` added for exception capture.
- **`src/views/LoginView.vue`** — `posthog.identify()` + `user_logged_in` capture added on successful login.
- **`src/components/NavBar.vue`** — `user_logged_out` capture + `posthog.reset()` added on logout.
- **`src/views/MediaDetailView.vue`** — `media_viewed` captured after real media loads; `trailer_played` captured on trailer button click.
- **`src/views/SearchView.vue`** — `search_performed` captured after search completes with query and result count.
- **`src/views/MediaListView.vue`** — `media_browsed` captured on mount with media type.
- **`.env`** — `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` set (gitignored).

## Next steps

Once events are flowing, we recommend building the following insights in your PostHog dashboard to monitor user behavior:

1. **Login conversion funnel** — `user_logged_in` → `media_browsed` → `media_viewed` → `trailer_played`. Reveals where users drop off after logging in.
2. **Search effectiveness** — Trend of `search_performed` over time, broken down by `result_count` (zero vs non-zero). Helps identify failed searches.
3. **Top content by views** — `media_viewed` broken down by `title` property. Reveals the most popular movies and TV shows.
4. **Trailer engagement rate** — `trailer_played` / `media_viewed` ratio. High-intent engagement indicator.
5. **Session length proxy** — `user_logged_in` → `user_logged_out` funnel time analysis. Measures session engagement.

To create these, go to your [PostHog project](https://us.posthog.com) → Insights → New insight, and use the event names listed above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

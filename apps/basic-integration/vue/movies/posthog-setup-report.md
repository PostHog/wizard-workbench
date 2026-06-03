<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Vue Movies project with PostHog. The following changes were made:

- **`src/main.js`** — PostHog is initialised once at app boot using `posthog.init()` with credentials from environment variables. A global Vue `errorHandler` sends all uncaught exceptions to PostHog via `captureException`.
- **`src/composables/useAuth.ts`** — On successful login the user is identified with `posthog.identify()` and a `user_logged_in` event is captured.
- **`src/components/NavBar.vue`** — On logout a `user_logged_out` event is captured and `posthog.reset()` clears the session identity, ensuring the next login starts fresh.
- **`src/views/SearchView.vue`** — A `search_performed` event is captured after every successful search, including the query text and result count. Search errors are also reported to PostHog.
- **`src/views/MediaDetailView.vue`** — A `media_detail_viewed` event is captured when real media data loads. A `trailer_played` event fires when a user opens the trailer modal. A `recommendation_clicked` event fires when a user clicks a recommendation card. API errors are reported to PostHog.
- **`src/views/HomeView.vue`** — A `hero_media_clicked` event is captured when a user clicks the hero banner.
- **`.env`** — Created with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; triggers `identify()` | `src/composables/useAuth.ts` |
| `user_logged_out` | User logs out; triggers `posthog.reset()` | `src/components/NavBar.vue` |
| `search_performed` | User submits a search query (includes query text and result count) | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (includes id, title, type) | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opens the trailer modal (includes media id, title, type) | `src/views/MediaDetailView.vue` |
| `recommendation_clicked` | User clicks a recommendation on a detail page | `src/views/MediaDetailView.vue` |
| `hero_media_clicked` | User clicks the hero banner on the home page | `src/views/HomeView.vue` |

## Next steps

The PostHog API key used during setup was missing the `dashboard:write` and `query:read` scopes, so the dashboard and insights could not be created automatically. You can create them manually in PostHog:

1. Go to [Dashboards](/dashboard) and create a new dashboard named **"Analytics basics"**.
2. Add the following insights:

   - **Login funnel** — Funnel from `user_logged_in` → `media_detail_viewed` → `trailer_played`
   - **Search engagement** — Trends chart of `search_performed` over time, broken down by result count buckets
   - **Content engagement** — Trends of `media_detail_viewed` and `trailer_played` on the same chart
   - **Hero click-through** — Trends of `hero_media_clicked` over time
   - **Logout / churn rate** — Trends of `user_logged_out` over time compared to `user_logged_in`

3. To enable dashboard creation via the MCP in future, add the `dashboard:write`, `insight:write`, and `query:read` scopes to your PostHog personal API key in [Settings → Personal API Keys](/settings/user-api-keys).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

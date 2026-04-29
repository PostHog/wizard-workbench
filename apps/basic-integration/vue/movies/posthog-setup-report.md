<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Vue 3 Movies application with PostHog analytics. Here is a summary of all changes made:

**`src/main.js`** — PostHog is initialized here using `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables. A global Vue error handler (`app.config.errorHandler`) forwards all uncaught component errors to PostHog via `posthog.captureException()`.

**`src/views/LoginView.vue`** — After a successful login, `posthog.identify()` is called with the username to tie future events to the user, followed by a `user_logged_in` capture event.

**`src/components/NavBar.vue`** — On logout, a `user_logged_out` event is captured and `posthog.reset()` is called to clear the PostHog session, ensuring the next login starts a clean identity.

**`src/views/MediaDetailView.vue`** — A `media_viewed` event is captured when a movie or TV show detail page loads successfully (with `media_id`, `media_type`, and `media_title` properties). A `trailer_played` event is captured when the user clicks the "Watch Trailer" button (same properties).

**`src/views/SearchView.vue`** — A `search_performed` event is captured after a successful search, with `query` and `result_count` properties.

**`.env`** — `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables added (covered by `.gitignore`).

---

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Preceded by `posthog.identify()` to associate the session with the user. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when the user logs out. PostHog session is reset. | `src/components/NavBar.vue` |
| `media_viewed` | Fired when a movie or TV show detail page loads successfully. Top of content engagement funnel. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the user clicks to watch a trailer. Indicates high content interest. | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired when a search is submitted, with the query string and result count. | `src/views/SearchView.vue` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- **Login funnel** — Funnel from `user_logged_in` → `media_viewed` → `trailer_played`: [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
- **Daily active users (logins)** — Trend of `user_logged_in` over time: [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Most searched queries** — Breakdown of `search_performed` by `query` property: [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Trailer engagement rate** — Compare `media_viewed` vs `trailer_played` counts: [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
- **Logout / churn signal** — Trend of `user_logged_out` over time: [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

To create the dashboard: go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) → **New dashboard** → name it "Analytics basics" → add the insights above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

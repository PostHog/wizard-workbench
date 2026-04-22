<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is initialized in `src/main.js` with session replay and a global Vue error handler for automatic exception capture. User identification happens at login, and the PostHog session is properly reset on logout. Six custom events are tracked across key user flows — login, logout, media discovery, trailer engagement, and search behavior.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired after successful login; also calls `posthog.identify()` with the username | `src/views/LoginView.vue` |
| `user_logged_out` | Fired before logout; also calls `posthog.reset()` to clear the session | `src/components/NavBar.vue` |
| `media_detail_viewed` | Fired when a movie or TV show detail page loads, with media ID, type, and title | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the user clicks "Watch Trailer" on a detail page | `src/views/MediaDetailView.vue` |
| `search_performed` | Fired after a search completes, with the query and result count | `src/views/SearchView.vue` |
| `search_result_clicked` | Fired when a user clicks a result card in search, with query and media details | `src/views/SearchView.vue` |

## Next steps

We've set up the events — head to your PostHog project to build insights and a dashboard based on them:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) — create an "Analytics basics" dashboard
- Suggested insights:
  - **Login trend** — `user_logged_in` over time (trend)
  - **Search funnel** — `search_performed` → `search_result_clicked` → `media_detail_viewed` (funnel)
  - **Trailer engagement** — `trailer_played` over time, broken down by `media_type`
  - **Top searched content** — `search_performed` grouped by `query` property
  - **Content discovery** — `media_detail_viewed` grouped by `media_type`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. The `posthog-js` SDK has been installed and initialized in `src/main.js` using environment variables for the project token and host. A global Vue error handler has been added to capture uncaught exceptions automatically. User identification happens on login, and the PostHog session is reset on logout. Six custom events have been instrumented across five files covering the core user journey: authentication, content discovery, engagement, and error handling.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired after a user successfully logs in. Identifies the user in PostHog via `posthog.identify()`. | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. Resets the PostHog session via `posthog.reset()`. | `src/components/NavBar.vue` |
| `media_searched` | Fired when a user submits a search query. Includes `query` and `result_count` properties. | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a media detail page loads successfully. Includes `media_id`, `media_type`, and `media_title`. | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal. Includes `media_id`, `media_type`, and `media_title`. | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card. Includes `media_id`, `media_type`, and `media_title`. | `src/components/media/MediaCard.vue` |

## Next steps

To monitor user behavior with these events, create an "Analytics basics" dashboard in PostHog with the following suggested insights:

- **Login funnel** — Funnel from `media_card_clicked` → `media_detail_viewed` → `trailer_played` (content engagement funnel)
- **User login trend** — Trend of `user_logged_in` events over time
- **Top searches** — Breakdown of `media_searched` by `query` property
- **Content engagement rate** — Ratio of `trailer_played` to `media_detail_viewed` (trailer conversion)
- **Search success rate** — Breakdown of `media_searched` by `result_count` (0 vs >0 results)

Create your dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

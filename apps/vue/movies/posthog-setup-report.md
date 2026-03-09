<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. The `posthog-js` SDK was installed and initialized in `src/main.js` with environment-variable-based configuration (`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`). A global Vue error handler was added to capture all uncaught exceptions via `posthog.captureException`. User identification is performed on login using `posthog.identify`, and the session is cleared on logout via `posthog.reset`. Six meaningful events were added across five files, covering the full user journey from login through content discovery.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in. Identifies the user with their username. | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks logout. Clears the PostHog session with `posthog.reset()`. | `src/components/NavBar.vue` |
| `media_searched` | User submits a search query. Includes query text and result count. | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page. Includes media ID, type, and title. | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks "Watch Trailer". Includes media ID, type, and title. | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicks a media card to navigate to a detail page. Includes media ID, type, and title. | `src/components/media/MediaCard.vue` |

## Next steps

We've set up the event tracking foundation. To visualize user behavior in PostHog, create an **"Analytics basics"** dashboard with these recommended insights:

1. **Daily Logins** — Trend of `user_logged_in` events over time. Tracks user acquisition and retention.
2. **Search Volume & Success** — Trend of `media_searched` with breakdown by result count (zero results = discovery friction).
3. **Content Discovery Funnel** — Funnel: `user_logged_in` → `media_searched` → `media_card_clicked` → `media_detail_viewed`. Reveals drop-off in the discovery flow.
4. **Trailer Engagement** — Trend of `trailer_played` vs `media_detail_viewed` to measure content quality signal.
5. **Login → Logout Lifecycle** — Funnel of `user_logged_in` → `user_logged_out` to understand session depth.

Visit [PostHog Project 2](https://us.posthog.com/project/2/insights) to create these insights using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

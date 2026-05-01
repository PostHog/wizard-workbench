<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the Vue Movies app with PostHog analytics. The following changes were made:

- **`src/main.js`** — PostHog is initialized on app boot using environment variables. A global Vue `errorHandler` sends all uncaught exceptions to PostHog via `captureException`.
- **`src/composables/useAuth.ts`** — Users are identified with `posthog.identify()` on login, and PostHog state is reset with `posthog.reset()` on logout. Login and logout events are captured.
- **`src/views/SearchView.vue`** — A `search_performed` event is captured after every successful search, including the query string and result count.
- **`src/views/MediaDetailView.vue`** — A `media_detail_viewed` event is captured after real media data loads (top of the engagement funnel). A `trailer_played` event is captured when the Watch Trailer button is clicked.
- **`src/components/media/MediaCard.vue`** — A `media_card_clicked` event is captured whenever a user clicks a media card to navigate to its detail page.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/composables/useAuth.ts` |
| `user_logged_out` | User logs out of the app | `src/composables/useAuth.ts` |
| `search_performed` | User submits a search query for movies or TV shows | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (top of conversion funnel) | `src/views/MediaDetailView.vue` |
| `trailer_played` | User clicks the Watch Trailer button on a media detail page | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicks a media card to navigate to a detail page | `src/components/media/MediaCard.vue` |

## Next steps

Here are the recommended insights to build in your PostHog dashboard ("Analytics basics"):

1. **Login trend** — Trends chart for `user_logged_in` over time. Reveals active user growth and login frequency.
2. **Engagement funnel: Login → Browse → Detail → Trailer** — Funnel with steps: `user_logged_in` → `media_card_clicked` → `media_detail_viewed` → `trailer_played`. Shows where users drop off in the content engagement journey.
3. **Search usage** — Trends chart for `search_performed` with a breakdown by `result_count = 0` (no-results searches). Helps identify content gaps.
4. **Most-viewed media types** — Trends chart for `media_detail_viewed` broken down by `media_type` (movie vs tv). Shows which category drives more engagement.
5. **Churn indicator: Logout rate** — Trends chart for `user_logged_out` over time. A spike here relative to logins is a churn signal.

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

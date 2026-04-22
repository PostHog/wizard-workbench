<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is now initialized in `src/main.js` with your project token and host sourced from environment variables. A global Vue error handler forwards all uncaught Vue errors to PostHog exception tracking. User identity is established on login via `posthog.identify()` and cleared on logout via `posthog.reset()`. Six targeted events have been added across the most business-critical flows: authentication, content discovery via search, media detail page views (top of engagement funnel), trailer opens (high-intent engagement), and media card clicks.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `src/views/LoginView.vue` |
| `user_logged_out` | User clicks the logout button | `src/components/NavBar.vue` |
| `search_performed` | User submits a search query (includes query text and result count) | `src/views/SearchView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (includes id, type, title) | `src/views/MediaDetailView.vue` |
| `trailer_opened` | User clicks Watch Trailer (includes id, type, title) | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | User clicks a media card to navigate to its detail page (includes id, type, title) | `src/components/media/MediaCard.vue` |

## Next steps

We recommend building the following insights in your PostHog project to monitor user behavior. You can create them from your PostHog dashboard:

- **Login trend** — Trends insight on `user_logged_in` over time. Track daily active users logging in.
- **Engagement funnel** — Funnel insight: `user_logged_in` → `media_detail_viewed` → `trailer_opened`. Shows how many users progress from login to viewing a media detail to opening a trailer.
- **Search usage** — Trends insight on `search_performed` with a breakdown. Monitor search volume and average result counts.
- **Top content** — Trends insight on `media_detail_viewed` broken down by `media_title` or `media_type`. See which movies/shows attract the most interest.
- **Churn signal** — Trends insight on `user_logged_out`. Monitor when and how often users log out.

Visit your PostHog project to create these insights: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

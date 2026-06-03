<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is initialized in `src/main.js` using environment variables, with a global Vue error handler that pipes uncaught exceptions to PostHog. Users are identified by username after login and the PostHog session is reset on logout. Custom events are captured at key user interaction points across the app.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in | `src/composables/useAuth.ts` |
| `user_logged_out` | User logs out | `src/composables/useAuth.ts` |
| `login_failed` | Login attempt fails (e.g. empty fields) | `src/views/LoginView.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opens the trailer modal | `src/views/MediaDetailView.vue` |
| `search_performed` | User submits a search query | `src/views/SearchView.vue` |
| `media_card_clicked` | User clicks any media card in a carousel or list | `src/components/media/MediaCard.vue` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with insights like:

- **Login funnel** — Funnel from `user_logged_in` → `media_detail_viewed` to measure new-user activation.
- **Search → Detail conversion** — Funnel from `search_performed` → `media_card_clicked` to measure search engagement.
- **Daily active users** — Trends of `user_logged_in` over time.
- **Top content** — Trends of `media_detail_viewed` broken down by `media_title` to see most-viewed titles.
- **Trailer engagement** — Trends of `trailer_played` to track content engagement.

You can create this dashboard at [/dashboard](https://us.posthog.com/project/2/dashboard) in your PostHog project.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

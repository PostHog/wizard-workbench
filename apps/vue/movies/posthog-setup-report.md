<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog was installed via npm, environment variables were configured, and event tracking was added across all key user interaction points. PostHog is initialized in `src/main.js` before the app mounts, with a global Vue error handler that sends uncaught exceptions to PostHog. User identity is established at login via `posthog.identify()` and cleared on logout via `posthog.reset()`.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in; triggers `posthog.identify()` | `src/composables/useAuth.ts` |
| `user_logged_out` | User clicked logout; triggers `posthog.reset()` | `src/composables/useAuth.ts` |
| `login_failed` | Login attempted with missing credentials | `src/composables/useAuth.ts` |
| `media_searched` | User submitted a search query for movies or TV shows | `src/views/SearchView.vue` |
| `media_detail_viewed` | User navigated to a movie or TV show detail page | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opened the trailer modal on a detail page | `src/views/MediaDetailView.vue` |
| `trailer_played` | User opened the trailer modal from the hero carousel | `src/components/media/MediaHero.vue` |
| `media_card_clicked` | User clicked a media card to navigate to its detail page | `src/components/media/MediaCard.vue` |

## Next steps

To explore user behavior, visit your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Login → Media Viewed funnel** — `user_logged_in` → `media_detail_viewed` (conversion funnel)
- **Search usage** — trend of `media_searched` events over time
- **Trailer engagement** — trend of `trailer_played` events, breakdown by `media_type`
- **Most-clicked media** — top `media_card_clicked` events by `media_title`
- **Login failures** — trend of `login_failed` to monitor UX issues

Visit your project: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

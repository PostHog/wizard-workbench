<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. PostHog is now initialized in `src/main.js` using environment variables, with a global Vue error handler wired to `posthog.captureException`. Users are identified on login and their session is reset on logout. Ten custom events covering authentication, media engagement, and search have been instrumented across seven files.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out | `src/composables/useAuth.ts` |
| `login_failed` | Fired when a login attempt fails with an error | `src/views/LoginView.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks play on a trailer | `src/views/MediaDetailView.vue` |
| `media_load_error` | Fired when media details fail to load | `src/views/MediaDetailView.vue` |
| `search_submitted` | Fired when a user submits a search query | `src/views/SearchView.vue` |
| `media_card_clicked` | Fired when a user clicks on any media card (movie or TV show) | `src/components/media/MediaCard.vue` |
| `hero_clicked` | Fired when a user clicks the hero banner item | `src/views/HomeView.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [PostHog Project — PostHog hello world projects](https://us.posthog.com/project/238460)

Suggested insights to create in your PostHog dashboard:
1. **User Logins Over Time** — Trend chart of `user_logged_in` to monitor daily active users
2. **Login → Media View → Trailer Funnel** — Funnel: `user_logged_in` → `media_detail_viewed` → `trailer_played` to measure engagement depth
3. **Search Usage** — Trend chart of `search_submitted` with breakdown by query
4. **Media Engagement Rate** — `media_card_clicked` vs `media_detail_viewed` over time
5. **Login Failures** — Trend of `login_failed` to identify authentication issues

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

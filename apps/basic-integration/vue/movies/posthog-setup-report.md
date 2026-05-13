<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. PostHog is initialized in `src/main.js` using `posthog-js`, with the project token and host loaded from environment variables. A global Vue error handler routes all uncaught component errors to `posthog.captureException()`. User identification is performed on login via `posthog.identify()`, and `posthog.reset()` is called on logout to clear the session. Seven custom events are instrumented across five files, covering user authentication, search, content discovery, and engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; also calls `posthog.identify()` | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out; also calls `posthog.reset()` | `src/composables/useAuth.ts` |
| `login_failed` | Fired when a login attempt throws an error | `src/views/LoginView.vue` |
| `search_performed` | Fired when a search is submitted, with query and result count | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a movie or TV show detail page loads successfully, with title, type, and genres | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card to navigate to detail | `src/components/media/MediaCard.vue` |

## Next steps

We've set up the events above. Now create an **"Analytics basics"** dashboard in PostHog and add these five insights to track your most important user behaviors:

1. **Login-to-content funnel** — Funnel from `user_logged_in` → `media_detail_viewed` → `trailer_played`. Shows where users drop off between logging in and engaging with content.
   [Create funnel insight →](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily logins** — Trend of `user_logged_in` over time. Tracks daily active users.
   [Create trends insight →](https://us.posthog.com/project/2/insights/new#trends)

3. **Search usage** — Trend of `search_performed` with a breakdown by result count (0 vs >0). Identifies search success rate.
   [Create trends insight →](https://us.posthog.com/project/2/insights/new#trends)

4. **Content views by type** — Trend of `media_detail_viewed` broken down by `media_type` (movie vs tv). Shows which content category is more popular.
   [Create trends insight →](https://us.posthog.com/project/2/insights/new#trends)

5. **Churn / logout events** — Trend of `user_logged_out`. Useful to correlate with `user_logged_in` to understand session engagement.
   [Create trends insight →](https://us.posthog.com/project/2/insights/new#trends)

[Create "Analytics basics" dashboard →](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

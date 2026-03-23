<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application. The `posthog-js` SDK was installed and initialized in `src/main.js` with environment-variable-based configuration. A global Vue `errorHandler` was added to capture unhandled exceptions. Users are identified by username on login, and the PostHog session is reset on logout. Key user actions across media browsing and discovery are now tracked as custom events.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired after a user successfully logs in; also calls `posthog.identify()` | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired before logout; also calls `posthog.reset()` to clear the session | `src/composables/useAuth.ts` |
| `media_searched` | Fired when a search query completes, with `query` and `result_count` properties | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when media data loads on the detail page (top of conversion funnel); includes `media_id`, `media_type`, `media_title` | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks to play a trailer from the detail page; includes `media_id`, `media_type`, `media_title` | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user clicks to play a trailer from the hero component; includes `media_id`, `media_type`, `media_title` | `src/components/media/MediaHero.vue` |
| `media_card_clicked` | Fired when a user clicks a media card to navigate to the detail page; includes `media_id`, `media_type`, `media_title` | `src/components/media/MediaCard.vue` |

## Next steps

We've set up event tracking across the most business-critical flows. Here are some suggested insights and a dashboard to build in PostHog:

- **[PostHog Project](https://us.posthog.com/project/238460)** — Your PostHog project
- **[Create "Analytics basics" Dashboard](https://us.posthog.com/project/238460/dashboard)** — Create a new dashboard named "Analytics basics" and add the following insights:

  1. **Login → Detail → Trailer Funnel** — Funnel: `user_logged_in` → `media_detail_viewed` → `trailer_played`
  2. **Daily Logins Trend** — Trend of `user_logged_in` over time
  3. **Search Volume & Results** — Trend of `media_searched`, broken down by `result_count`
  4. **Media Card Clicks** — Trend of `media_card_clicked`, broken down by `media_type`
  5. **User Churn** — Trend of `user_logged_out` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

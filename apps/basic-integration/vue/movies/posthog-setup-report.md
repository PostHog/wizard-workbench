<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Vue Movies application. `posthog-js` was installed and initialized in `src/main.js` with the project token and host from environment variables. A global Vue `errorHandler` was registered to capture all unhandled exceptions via `posthog.captureException()`. User identity is established on login and cleared on logout. Six meaningful analytics events are now tracked across the core user journey — from authentication through media discovery and engagement.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in; calls `posthog.identify()` with the username | `src/views/LoginView.vue` |
| `user_logged_out` | Fired when a user logs out; calls `posthog.reset()` to clear the session | `src/components/NavBar.vue` |
| `search_performed` | Fired when a user performs a search, with `query` and `result_count` properties | `src/views/SearchView.vue` |
| `media_viewed` | Fired when a movie or TV show detail page loads, with `media_id`, `media_type`, `media_title`, and `genre_ids` | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when a user opens the trailer modal, with `media_id`, `media_type`, and `media_title` | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card, with `media_id`, `media_type`, and `media_title` | `src/components/media/MediaCard.vue` |

## Next steps

To visualize user behavior, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Login → Media → Trailer funnel** — Funnel insight with steps: `user_logged_in` → `media_viewed` → `trailer_played`. Tracks conversion from login through content engagement.
2. **Daily logins** — Trend of `user_logged_in` (unique users per day). Tracks daily active user growth.
3. **Search activity** — Trend of `search_performed` with breakdown by `result_count = 0` vs `> 0`. Identifies search quality.
4. **Top media card clicks** — Trend of `media_card_clicked` broken down by `media_type`. Shows whether users prefer movies or TV shows.
5. **Trailer engagement rate** — Combined trend of `media_viewed` and `trailer_played` on the same chart. Reveals what fraction of detail page views convert to trailer plays.

You can build this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

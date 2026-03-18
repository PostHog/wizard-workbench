<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. The following changes were made:

- **`src/main.js`**: Initialized `posthog-js` with the project token and host from environment variables. Added a global Vue `errorHandler` that automatically sends uncaught exceptions to PostHog via `captureException`.
- **`src/composables/useAuth.ts`**: Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login. Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout to clear the PostHog session.
- **`src/views/SearchView.vue`**: Captures `search_performed` after each successful search with the query string and result count. Errors during search are sent to PostHog via `captureException`.
- **`src/views/MediaDetailView.vue`**: Captures `media_detail_viewed` when a media page loads successfully (with media ID, type, and title). Captures `trailer_played` when the Watch Trailer button is clicked. API errors are forwarded to PostHog via `captureException`.
- **`src/components/media/MediaCard.vue`**: Captures `media_card_clicked` whenever a user clicks on a media card, with the media ID, type, and title.
- **`.env`**: Created with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also identifies the user | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when the user logs out; resets the PostHog session | `src/composables/useAuth.ts` |
| `search_performed` | Fired when a search query is submitted, with query and result count | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when a movie or TV detail page loads successfully | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the user clicks "Watch Trailer" on a detail page | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when the user clicks on a media card to view details | `src/components/media/MediaCard.vue` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login conversion** — Trend of `user_logged_in` over time to track daily active users
2. **Content discovery funnel** — Funnel from `media_card_clicked` → `media_detail_viewed` → `trailer_played` to measure engagement depth
3. **Top searches** — Table of `search_performed` grouped by `query` property to understand what users are looking for
4. **Trailer engagement rate** — Formula insight: unique `trailer_played` / unique `media_detail_viewed` to measure high-intent engagement
5. **Churn signal** — Trend of `user_logged_out` compared to `user_logged_in` to spot retention issues

You can create this dashboard at: [https://us.i.posthog.com/project/2/dashboards](https://us.i.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

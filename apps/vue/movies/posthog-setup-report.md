<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies app. The following changes were made:

- **`src/main.js`** — PostHog initialized with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables before app mount. A global Vue `errorHandler` is registered to capture unhandled exceptions via `posthog.captureException()`.
- **`src/composables/useAuth.ts`** — On login, `posthog.identify()` is called with the username to link all subsequent events to the user, and a `user_logged_in` event is captured. On logout, a `user_logged_out` event is captured and `posthog.reset()` clears the PostHog session.
- **`src/views/SearchView.vue`** — A `media_searched` event is captured after each successful search with the query string and number of results.
- **`src/views/MediaDetailView.vue`** — A `media_detail_viewed` event is captured when a media item loads successfully (with `media_id`, `media_title`, and `media_type`). A `trailer_played` event is captured when the user opens the trailer modal.
- **`src/components/media/MediaCard.vue`** — A `media_card_clicked` event is captured on click with `media_id`, `media_title`, and `media_type`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out | `src/composables/useAuth.ts` |
| `media_searched` | Fired when the user submits a search query, with query string and result count | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired when the user views a media detail page, with media id, title, and type | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the user clicks "Watch Trailer" on a media detail page | `src/views/MediaDetailView.vue` |
| `media_card_clicked` | Fired when a user clicks a media card to navigate to a detail page | `src/components/media/MediaCard.vue` |

## Next steps

Visit your PostHog project to explore the data once users start interacting with the app. Here are some suggested insights to create:

- **Login funnel**: `user_logged_in` — track how many users complete login
- **Search usage**: `media_searched` — chart over time; break down by query and result count
- **Content discovery funnel**: `media_card_clicked` → `media_detail_viewed` → `trailer_played` — conversion through content engagement
- **User retention**: unique users triggering `user_logged_in` over time
- **Churn signal**: `user_logged_out` rate

PostHog project: https://us.i.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Vue Movies application. Here's a summary of all changes made:

- **`src/main.js`** — PostHog is initialized (via `posthog.init`) before the app mounts, using `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` environment variables. A global Vue `errorHandler` is wired up to automatically send uncaught Vue errors to PostHog via `posthog.captureException`.
- **`src/composables/useAuth.ts`** — On successful login, `posthog.identify` is called with the username to tie all future events to that user, followed by a `user_logged_in` capture. On logout, a `user_logged_out` event is fired and `posthog.reset()` clears the identity for the next session.
- **`src/views/MediaDetailView.vue`** — After real media data loads, a `media_detail_viewed` event is captured with rich properties (id, title, type, genres, rating, release year). When a user opens the trailer modal, a `trailer_played` event is captured. API errors are forwarded to PostHog via `captureException`.
- **`src/views/MediaListView.vue`** — On mount, a `media_list_browsed` event is fired with the `media_type` (movie or tv), tracking catalog exploration. API errors are also captured.
- **`src/views/SearchView.vue`** — After a search completes, a `media_searched` event is fired with the query and result count. Clicking a result fires `search_result_clicked` with item details and position. Search API errors are forwarded to PostHog.
- **`src/components/media/MediaCard.vue`** — Clicking any media card fires `media_card_clicked` with the item's id, title, type, and rating.
- **`.env`** — `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` added (and covered by `.gitignore`).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify` with the username | `src/composables/useAuth.ts` |
| `user_logged_out` | Fired on logout; also calls `posthog.reset()` to clear identity | `src/composables/useAuth.ts` |
| `media_searched` | Fired when a search is submitted; includes `query` and `result_count` | `src/views/SearchView.vue` |
| `media_detail_viewed` | Fired after a detail page loads real data; includes `media_id`, `media_title`, `media_type`, `genres`, `vote_average`, `release_year` | `src/views/MediaDetailView.vue` |
| `trailer_played` | Fired when the trailer modal is opened; includes `media_id`, `media_title`, `media_type` | `src/views/MediaDetailView.vue` |
| `media_list_browsed` | Fired on mount of the movies/TV list; includes `media_type` | `src/views/MediaListView.vue` |
| `media_card_clicked` | Fired when any media card is clicked; includes `media_id`, `media_title`, `media_type`, `vote_average` | `src/components/media/MediaCard.vue` |
| `search_result_clicked` | Fired when a search result card is clicked; includes `media_id`, `media_title`, `media_type`, `position`, `query` | `src/views/SearchView.vue` |

## Next steps

To get the most from these events, we recommend creating the following insights in your PostHog project at [https://us.posthog.com](https://us.posthog.com):

1. **Login trend** — Trends chart on `user_logged_in` to monitor daily active authenticated users.
2. **Content discovery funnel** — Funnel: `media_list_browsed` → `media_card_clicked` → `media_detail_viewed` → `trailer_played` to measure how users move from browsing to deep engagement.
3. **Search conversion** — Trends chart showing `media_searched` vs `search_result_clicked` side-by-side to measure search-to-click conversion rate.
4. **Movies vs TV browsing** — Trends on `media_list_browsed` broken down by `media_type` property to compare movie and TV catalog exploration.
5. **Session churn** — Trends on `user_logged_out` to track daily logout volume as a churn signal.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-vue-3/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

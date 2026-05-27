<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The integration includes client-side and server-side event tracking, user identification, session replay support, and error tracking across key user flows.

**Changes made:**

- `nuxt.config.ts` — Added `posthog` block to `runtimeConfig.public` with `publicKey`, `host`, and `posthogDefaults` sourced from environment variables.
- `plugins/posthog.client.ts` — Created PostHog client plugin that initializes `posthog-js`, enables `__add_tracing_headers` for client-to-server correlation, hooks `vue:error` for automatic exception capture, and provides `$posthog` to the entire app.
- `types/nuxt-app.d.ts` — Created TypeScript module augmentation so `useNuxtApp().$posthog` is fully typed.
- `.env` — Populated `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` with project values.
- `pages/login.vue` — Calls `posthog.identify(username)` and captures `user_logged_in` after a successful login.
- `components/NavBar.vue` — Captures `user_logged_out` and calls `posthog.reset()` on logout to unlink the session.
- `pages/search.vue` — Captures `search_performed` with the query string whenever a new search is executed.
- `pages/[type]/[id].vue` — Captures `media_viewed` with `media_id`, `media_type`, and `media_title` when a movie or TV show detail page loads.
- `components/media/Hero.vue` — Captures `trailer_played` with `media_id` and `media_title` when the trailer button is clicked.
- `components/video/Card.vue` — Captures `video_played` with `video_key`, `video_name`, and `video_type` when a video card is clicked.
- `pages/genre/[no]/movie.vue` — Captures `genre_browsed` with `genre_id`, `genre_name`, and `media_type` on page load.
- `server/api/auth/login.post.ts` — Creates a `posthog-node` client per request, extracts `x-posthog-session-id` and `x-posthog-distinct-id` headers (set automatically by the client SDK), and captures `server_login` via `withContext()` to maintain client-server correlation. Calls `posthog.shutdown()` to flush events.
- `app.vue` — Added `onErrorCaptured` error boundary to capture Vue component errors via `posthog.captureException()`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully completed login | `pages/login.vue` |
| `user_logged_out` | User logged out of the app | `components/NavBar.vue` |
| `search_performed` | User executed a search query | `pages/search.vue` |
| `media_viewed` | User viewed a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User clicked to play a trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User clicked to play a video from the videos grid | `components/video/Card.vue` |
| `genre_browsed` | User navigated to a genre listing page | `pages/genre/[no]/movie.vue` |
| `server_login` | Server-side login event (correlated with client session) | `server/api/auth/login.post.ts` |

## Next steps

To explore the events, visit your PostHog project and navigate to [Activity](/activity) or [Insights](/insights) to start building charts.

Suggested insights to create in an "Analytics basics" dashboard:

- **Login funnel** — Funnel from `user_logged_in` → `media_viewed` → `trailer_played` to measure content engagement depth after login.
- **Search → content engagement** — Funnel from `search_performed` → `media_viewed` to see how many searches lead to viewing content.
- **Daily active users** — Trend of `user_logged_in` over time to track returning user engagement.
- **Most played content** — `trailer_played` and `video_played` trends, broken down by `media_title` or `video_type` to identify top content.
- **Genre popularity** — `genre_browsed` trend broken down by `genre_name` to identify the most popular genres.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

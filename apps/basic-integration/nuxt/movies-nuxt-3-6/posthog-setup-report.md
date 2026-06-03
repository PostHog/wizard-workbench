<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.6 movies application. Here is a summary of the changes made:

- **`plugins/posthog.client.ts`** (new): Client-side PostHog plugin that initializes posthog-js, registers a `vue:error` hook for automatic exception capture, and provides `$posthog` to the entire application.
- **`types/nuxt-app.d.ts`** (new): TypeScript declaration extending `NuxtApp` with `$posthog: PostHog` for full type safety.
- **`nuxt.config.ts`**: Added `posthog` block to `runtimeConfig.public` referencing `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`.env`**: Created with PostHog project token and host URL.
- **`app.vue`**: Added `onErrorCaptured` hook to capture Vue component errors via `captureException`.
- **`pages/login.vue`**: On successful login, calls `posthog.identify()` with the username and captures `user_logged_in`. On failure, captures `login_failed` with the error message.
- **`components/NavBar.vue`**: Captures `user_logged_out` and calls `posthog.reset()` before logout.
- **`pages/[type]/[id].vue`**: Captures `media_viewed` with media ID, type, and title when a movie or TV show detail page is loaded.
- **`pages/search.vue`**: Captures `search_performed` with the search query whenever a new search is submitted.
- **`components/video/Card.vue`**: Captures `video_played` with video name and type when a trailer or clip is played.
- **`pages/person/[id].vue`**: Captures `person_viewed` with person ID and name when an actor/director profile is viewed.
- **`components/ExternalLinks.vue`**: Captures `external_link_clicked` with the platform name (imdb, twitter, etc.) for each external link.
- **`pages/genre/[no]/movie.vue`**: Captures `genre_browsed` with genre name and media type when a genre category page is visited.
- **`server/api/auth/login.post.ts`**: Added server-side PostHog Node client that reads session/distinct ID headers (`x-posthog-session-id`, `x-posthog-distinct-id`) and captures `server_login` using `withContext()` to correlate with the client-side session.

## Events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in; also triggers `identify()` | `pages/login.vue` |
| `user_logged_out` | User logged out; also triggers `posthog.reset()` | `components/NavBar.vue` |
| `login_failed` | Login attempt failed with error message | `pages/login.vue` |
| `media_viewed` | Movie or TV show detail page viewed (media_id, media_type, media_title) | `pages/[type]/[id].vue` |
| `search_performed` | User submitted a search query | `pages/search.vue` |
| `video_played` | Trailer or video clip played (video_name, video_type) | `components/video/Card.vue` |
| `person_viewed` | Actor or director profile page viewed (person_id, person_name) | `pages/person/[id].vue` |
| `external_link_clicked` | External link clicked (platform: imdb, twitter, etc.) | `components/ExternalLinks.vue` |
| `genre_browsed` | Genre category page visited (genre_name, media_type) | `pages/genre/[no]/movie.vue` |
| `server_login` | Server-side login event correlated with client session | `server/api/auth/login.post.ts` |

## Next steps

We recommend creating an "Analytics basics" dashboard in PostHog with the following insights:

1. **Login funnel** — Funnel from `user_logged_in` → `media_viewed` → `video_played` to track engagement after login.
2. **Search usage trend** — Trends chart of `search_performed` over time to understand search adoption.
3. **Top content** — Breakdown of `media_viewed` by `media_type` (movie vs tv) to see content preferences.
4. **Video engagement** — Trends chart of `video_played` broken down by `video_type` (Trailer, Teaser, etc.).
5. **External link clicks** — Trends chart of `external_link_clicked` broken down by `platform`.

You can create this dashboard at [/dashboard](/dashboard) in your PostHog project.

To view events as they come in, visit [/activity/explore](/activity/explore).

To manage your event definitions and properties, visit [/data-management/events](/data-management/events).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

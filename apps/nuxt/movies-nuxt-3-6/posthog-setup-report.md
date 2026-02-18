<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.6 Movies application. Here is a summary of all changes made:

**New files created:**
- `plugins/posthog.client.ts` — Initialises the PostHog JS client on the browser side using `runtimeConfig`, hooks into `vue:error` for automatic exception tracking, and provides `$posthog` throughout the app via `useNuxtApp()`.
- `types/nuxt-app.d.ts` — TypeScript declaration extending `NuxtApp` with the `$posthog: PostHog` property for full type safety.

**Modified files:**
- `nuxt.config.ts` — Added `runtimeConfig.public.posthog` block (`publicKey`, `host`, `posthogDefaults`) sourced from environment variables.
- `pages/login.vue` — On successful login, calls `posthog.identify(username)` to associate the PostHog anonymous user with a known identity, then captures `user_logged_in`.
- `components/NavBar.vue` — Replaced the direct `logout()` call with `handleLogout()`, which first captures `user_logged_out`, calls `posthog.reset()` to clear the PostHog session, then logs out.
- `server/api/auth/login.post.ts` — Added a PostHog Node.js client that reads `x-posthog-session-id` and `x-posthog-distinct-id` headers (sent automatically by the client SDK when `__add_tracing_headers` is used) and fires `server_login` to correlate server actions with the correct client session.
- `server/api/auth/logout.post.ts` — Similarly tracks `server_logout` server-side with session context.
- `pages/search.vue` — Captures `media_searched` with the query text and total result count on the first page of results.
- `pages/[type]/[id].vue` — Captures `media_viewed` with `media_type`, `media_id`, and `media_title` when a user opens a movie or TV show detail page (client-side only).
- `components/media/Details.vue` — Captures `media_tab_changed` with the tab name and media context whenever a user switches between Overview, Videos, and Photos.
- `pages/genre/[no]/movie.vue` — Captures `genre_browsed` with `media_type`, `genre_id`, and `genre_name` when a user browses a movie genre (client-side only).

**Environment variables** (written to `.env`, `.gitignore` coverage ensured):
- `NUXT_PUBLIC_POSTHOG_KEY`
- `NUXT_PUBLIC_POSTHOG_HOST`

---

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in. PostHog `identify()` is also called here. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button. `posthog.reset()` clears the session. | `components/NavBar.vue` |
| `server_login` | Server-side counterpart of `user_logged_in`, correlated via session headers. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side counterpart of `user_logged_out`, correlated via session headers. | `server/api/auth/logout.post.ts` |
| `media_searched` | User searches for movies/TV shows; captures query and result count. | `pages/search.vue` |
| `media_viewed` | User opens a movie or TV show detail page; captures type, id, and title. | `pages/[type]/[id].vue` |
| `media_tab_changed` | User switches between Overview, Videos, or Photos tabs on a detail page. | `components/media/Details.vue` |
| `genre_browsed` | User browses a movie genre; captures genre name, id, and media type. | `pages/genre/[no]/movie.vue` |
| `$exception` (automatic) | Vue errors are captured automatically via the `vue:error` hook. | `plugins/posthog.client.ts` |

---

## Next steps

To build analytics on top of these events, visit your PostHog project and create insights like:

- **Login funnel**: `media_viewed` → `media_searched` (content discovery after login)
- **Search engagement**: Trend of `media_searched` over time with average `result_count`
- **Content engagement**: Most-viewed media items via `media_viewed` broken down by `media_type`
- **Tab engagement**: Breakdown of `media_tab_changed` by tab name to see what users care about most
- **Genre popularity**: `genre_browsed` broken down by `genre_name`
- **Error monitoring**: `$exception` trend to track application health

You can log in at **https://us.i.posthog.com** and navigate to **Insights** to create these.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

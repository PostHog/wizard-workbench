<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application (Nuxt 3.6). The integration covers client-side analytics via `posthog-js`, server-side analytics via `posthog-node`, user identification, and automatic error tracking.

**Summary of changes:**

- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public` with environment variable references for the project token and host.
- **`plugins/posthog.client.ts`** *(new)* — Client-side Nuxt plugin that initializes PostHog with session replay defaults, hooks into the `vue:error` lifecycle for automatic Vue error capture, and provides `$posthog` throughout the app.
- **`types/nuxt-app.d.ts`** *(new)* — TypeScript declaration extending `NuxtApp` with `$posthog: PostHog`.
- **`pages/login.vue`** — Identifies the user and captures `user_logged_in` on successful login; captures `user_login_failed` on error.
- **`composables/useAuth.ts`** — Captures `user_logged_out` and calls `posthog.reset()` on logout.
- **`server/api/auth/login.post.ts`** — Creates a `posthog-node` client per request, reads `x-posthog-session-id` / `x-posthog-distinct-id` headers, and captures `server_login` in the correct session context.
- **`pages/search.vue`** — Captures `media_searched` with the query string after each debounced search.
- **`pages/[type]/[id].vue`** — Captures `media_detail_viewed` with `media_type`, `media_id`, and `media_title` on mount.
- **`components/video/Card.vue`** — Captures `video_played` with `video_name`, `video_type`, and `video_key` when a trailer/clip is opened.
- **`components/media/Details.vue`** — Captures `media_tab_changed` with the new tab name and media context when the user switches between Overview / Videos / Photos tabs.
- **`components/media/Card.vue`** — Captures `media_card_clicked` with `media_type`, `media_id`, and `media_title` on navigation.
- **`pages/person/[id].vue`** — Captures `person_viewed` with `person_id` and `person_name` on mount.
- **`pages/genre/[no]/movie.vue`** — Captures `genre_browsed` with `media_type`, `genre_id`, and `genre_name` on mount.
- **`error.vue`** — Captures `error_displayed` with status code and message; calls `captureException` for non-404 errors.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in (client-side identify + capture) | `pages/login.vue` |
| `user_login_failed` | Login attempt fails | `pages/login.vue` |
| `server_login` | Login recorded server-side with session correlation | `server/api/auth/login.post.ts` |
| `user_logged_out` | User logs out (PostHog identity reset) | `composables/useAuth.ts` |
| `media_searched` | User performs a search | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User opens a video/trailer | `components/video/Card.vue` |
| `media_tab_changed` | User switches tabs on media detail page | `components/media/Details.vue` |
| `media_card_clicked` | User clicks a media card | `components/media/Card.vue` |
| `person_viewed` | User views an actor/person page | `pages/person/[id].vue` |
| `genre_browsed` | User browses by genre | `pages/genre/[no]/movie.vue` |
| `error_displayed` | Global error page shown to user | `error.vue` |

## Next steps

To view your analytics, head to your PostHog project and build insights around these events:

- **Login conversion funnel**: `user_logged_in` → `media_detail_viewed` → `video_played`
- **Search-to-detail funnel**: `media_searched` → `media_card_clicked` → `media_detail_viewed`
- **Engagement trends**: Trend chart for `video_played`, `media_tab_changed`, `genre_browsed` over time
- **Error monitoring**: `error_displayed` breakdown by `status_code` property
- **User retention**: Unique users triggering `user_logged_in` vs `user_logged_out` per day

Suggested dashboard: **Analytics basics** — create it at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) and add the insights above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

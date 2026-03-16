<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application. The following changes were made:

- **Installed** `@posthog/nuxt` (Nuxt 4 module) and `posthog-node` packages
- **Configured** `nuxt.config.ts` to register the `@posthog/nuxt` module with client-side exception capture, server-side exception autocapture, and tracing headers for session correlation
- **Added** `runtimeConfig.public.posthog` for token/host access in server utilities
- **Created** `server/utils/posthog.ts` — a singleton `useServerPostHog()` utility for server-side tracking
- **Set** environment variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env`
- **Instrumented** 5 files with PostHog event tracking (see table below)

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on successful login. Identifies the user in PostHog (`posthog.identify()`). | `pages/login.vue` |
| `user_logged_out` | Fired when user clicks logout. Resets PostHog identity (`posthog.reset()`). | `components/NavBar.vue` |
| `media_searched` | Fired when a search query is committed (debounced). Includes the `query` property. | `pages/search.vue` |
| `media_viewed` | Fired on mount when a movie/TV show detail page is viewed. Includes `media_type`, `media_id`, and `media_title`. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks to play a trailer or video. Includes `video_name`, `video_type`, and `video_key`. | `components/video/Card.vue` |
| `server_user_logged_in` | Server-side event on login. Correlates with client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. | `server/api/auth/login.post.ts` |

## Next steps

Visit your PostHog project to create insights and a dashboard based on these events. Here are some suggested insights to build:

- **Login funnel** — Funnel from `user_logged_in` → `media_viewed` → `video_played` (engagement after login)
- **Search-to-view conversion** — Funnel from `media_searched` → `media_viewed`
- **Daily active users** — Trend of unique users triggering `user_logged_in` per day
- **Most viewed content** — Breakdown of `media_viewed` by `media_title` property
- **Video engagement** — Count of `video_played` events, broken down by `video_type`

We've also enabled **automatic error tracking** (client-side via Vue and server-side via Nitro) through the `@posthog/nuxt` module — no manual instrumentation needed for uncaught exceptions.

PostHog project: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

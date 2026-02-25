<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the **Nuxt Movies** application (Nuxt 3.x). This includes client-side analytics, server-side event tracking, user identification, error tracking, and session correlation between client and server.

## Changes Made

### New files created
- **`plugins/posthog.client.ts`** — Initializes PostHog client-side SDK using runtime config, hooks into Vue's `vue:error` lifecycle for automatic error capture, and provides `$posthog` to all components via Nuxt's plugin system.
- **`types/nuxt-app.d.ts`** — TypeScript declaration that types `$posthog` on the Nuxt app instance.

### Modified files
- **`nuxt.config.ts`** — Added `posthog.publicKey`, `posthog.host`, and `posthog.posthogDefaults` to `runtimeConfig.public`, sourced from environment variables.
- **`.env`** — Created with `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST`.
- **`composables/useAuth.ts`** — On successful login: calls `posthog.identify(username)` and captures `user_logged_in`. On logout: captures `user_logged_out` and calls `posthog.reset()`.
- **`pages/login.vue`** — Captures `login_failed` with the error message when authentication fails.
- **`pages/search.vue`** — Captures `media_searched` with the search query whenever a new search is triggered.
- **`pages/[type]/[id].vue`** — Captures `media_detail_viewed` with media ID, title, type, and vote average on page load.
- **`components/media/Hero.vue`** — Captures `trailer_played` with media ID and title when the trailer button is clicked.
- **`components/video/Card.vue`** — Captures `video_played` with video ID, name, type, and YouTube key when a video is played.
- **`components/LanguageSwitcher.vue`** — Captures `language_changed` with previous and new locale when the language is switched.
- **`error.vue`** — Captures `app_error` with status code, error message, 404 flag, and URL on mount.
- **`server/api/auth/login.post.ts`** — Server-side: creates a `posthog-node` client per request, extracts `x-posthog-session-id` and `x-posthog-distinct-id` headers for client–server correlation, and captures `server_user_logged_in`.
- **`server/api/auth/logout.post.ts`** — Server-side: similarly captures `server_user_logged_out` with session correlation.

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in. Also calls `posthog.identify()` to associate the session with a username. | `composables/useAuth.ts` |
| `login_failed` | Fired when a login attempt fails, capturing the error message. | `pages/login.vue` |
| `user_logged_out` | Fired when a user logs out. Calls `posthog.reset()` to clear the identity. | `composables/useAuth.ts` |
| `media_searched` | Fired when a user submits a search query. Captures the search query. | `pages/search.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page. Top of the engagement funnel. | `pages/[type]/[id].vue` |
| `trailer_played` | Fired when a user clicks the Watch Trailer button on the hero component. | `components/media/Hero.vue` |
| `video_played` | Fired when a user clicks to play a video from the video grid. | `components/video/Card.vue` |
| `language_changed` | Fired when a user switches the application language. | `components/LanguageSwitcher.vue` |
| `app_error` | Fired when an application-level error is displayed in the error page. | `error.vue` |
| `server_user_logged_in` | Server-side event fired after successful authentication in the login API route. Correlated with the client session via request headers. | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side event fired when the logout API endpoint is called. Correlated with the client session. | `server/api/auth/logout.post.ts` |

## Next steps

Your PostHog project is at: **https://us.posthog.com/project/238460**

We recommend building an **"Analytics basics"** dashboard with these insights:

1. **Login Funnel** — Trend of `user_logged_in` over time; compare against `login_failed` to track auth success rates.
2. **Content Engagement Funnel** — Funnel from `media_detail_viewed` → `trailer_played` → `video_played` to measure how users engage with content after discovery.
3. **Search Activity** — Trend of `media_searched` over time to understand discovery behavior.
4. **App Error Rate** — Trend of `app_error` events to monitor application health.
5. **Active Users** — Unique users triggering `user_logged_in` per day/week.

Go to [PostHog Dashboards](https://us.posthog.com/project/238460/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The integration includes client-side analytics via `posthog-js`, server-side tracking via `posthog-node`, user identification, session correlation between client and server, Vue error tracking, and event tracking for the most important user actions.

## Changes made

### New files
- **`plugins/posthog.client.ts`** — Client-side PostHog plugin that initializes PostHog with the project API key and host from runtime config, hooks into `vue:error` for automatic exception capture, and provides `$posthog` to the entire app.
- **`types/nuxt-app.d.ts`** — TypeScript type declarations for the `$posthog` property on the `NuxtApp` interface.

### Modified files
- **`nuxt.config.ts`** — Added `posthog` section to `runtimeConfig.public` with `publicKey`, `host`, and `posthogDefaults` fields, driven by environment variables.
- **`pages/login.vue`** — Added PostHog user identification (`posthog.identify()`), `user_logged_in` event capture on successful login, `login_failed` event capture and exception tracking on failure.
- **`composables/useAuth.ts`** — Added `user_logged_out` event capture and `posthog.reset()` on logout to clear the PostHog session.
- **`pages/search.vue`** — Added `media_searched` event capture with the search query when users search for content.
- **`pages/[type]/[id].vue`** — Added `media_details_viewed` event capture on mount, tracking media_id, media_type, and media_title.
- **`components/video/Card.vue`** — Added `video_played` event capture with video name, type, and key when users play a video trailer.
- **`components/media/Card.vue`** — Added `media_card_clicked` event capture with media_id, media_type, and media_title when users click on a media card.
- **`error.vue`** — Added `app_error_displayed` event capture with status_code, error_message, and is_404, plus exception capture when the error page is shown.
- **`server/api/auth/login.post.ts`** — Added server-side PostHog Node client with `server_login_succeeded` and `server_login_failed` events, using `x-posthog-session-id` and `x-posthog-distinct-id` headers to correlate with client-side sessions.
- **`.env`** — Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in | `pages/login.vue` |
| `login_failed` | Fired when a login attempt fails | `pages/login.vue` |
| `user_logged_out` | Fired when a user logs out | `composables/useAuth.ts` |
| `media_searched` | Fired when a user searches for a movie or TV show | `pages/search.vue` |
| `media_details_viewed` | Fired when a user views the details page for a movie or TV show | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks to play a video (trailer/clip) | `components/video/Card.vue` |
| `media_card_clicked` | Fired when a user clicks on a media card in a grid or carousel | `components/media/Card.vue` |
| `app_error_displayed` | Fired when the app error page is shown to the user | `error.vue` |
| `server_login_succeeded` | Server-side event fired when a user successfully authenticates | `server/api/auth/login.post.ts` |
| `server_login_failed` | Server-side event fired when a login attempt fails on the server | `server/api/auth/login.post.ts` |

## Next steps

Once your app is running and events are flowing into PostHog, we recommend building these key insights in your PostHog project at [https://us.i.posthog.com](https://us.i.posthog.com):

1. **Login Funnel** — Funnel from `user_logged_in` → `media_details_viewed` → `video_played` to track user engagement after login.
2. **Search → Content Engagement** — Funnel from `media_searched` → `media_card_clicked` → `media_details_viewed` to measure search conversion.
3. **Login Failure Rate** — Trend of `login_failed` vs `user_logged_in` over time to monitor auth health.
4. **Content Discovery** — Breakdown of `media_card_clicked` by `media_type` (movie vs tv) to understand content preferences.
5. **Error Rate** — Trend of `app_error_displayed` over time, filtered by `is_404` to distinguish 404s from real errors.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

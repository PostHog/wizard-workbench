<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Nuxt Movies 3.6 application. The integration includes:

- **Client-side SDK** (`posthog-js`) initialized via a Nuxt plugin with session replay, error tracking (Vue error hook), and automatic pageview capture.
- **Server-side SDK** (`posthog-node`) used in the login API route to capture server-side events correlated with the client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.
- **User identification** on login (client-side `identify()`) and identity reset on logout (`reset()`).
- **Event tracking** across 7 key user actions covering the full engagement funnel from login to content discovery and video playback.
- **Environment variables** written to `.env` (`NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`), referenced via Nuxt runtime config — no secrets hardcoded.
- **TypeScript declarations** added in `types/nuxt-app.d.ts` for the `$posthog` provider.

## Files created or modified

| File | Change |
|------|--------|
| `plugins/posthog.client.ts` | **Created** — initializes PostHog, registers `vue:error` error tracking, provides `$posthog` |
| `types/nuxt-app.d.ts` | **Created** — TypeScript declaration for `$posthog` on `NuxtApp` |
| `nuxt.config.ts` | **Updated** — added `runtimeConfig.public.posthog` block with key, host, and defaults |
| `.env` | **Created** — `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` |
| `pages/login.vue` | **Updated** — identify user and capture `user_logged_in` on successful login |
| `components/NavBar.vue` | **Updated** — capture `user_logged_out` and call `posthog.reset()` on logout |
| `server/api/auth/login.post.ts` | **Updated** — capture server-side `server_login` event correlated with client session |
| `pages/[type]/[id].vue` | **Updated** — capture `media_viewed` with media id, type, title, and rating |
| `pages/search.vue` | **Updated** — capture `media_searched` with search query |
| `components/video/Card.vue` | **Updated** — capture `video_played` with video key, name, and type |
| `components/media/Details.vue` | **Updated** — capture `media_tab_changed` with tab name and media context |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in. Also identifies the user in PostHog. | `pages/login.vue` |
| `user_logged_out` | User logs out. Also resets the PostHog identity. | `components/NavBar.vue` |
| `server_login` | Server-side event captured on the login API route to correlate with client session. | `server/api/auth/login.post.ts` |
| `media_viewed` | User views the detail page of a movie or TV show. | `pages/[type]/[id].vue` |
| `media_searched` | User performs a search query. | `pages/search.vue` |
| `video_played` | User clicks to play a trailer or video clip. | `components/video/Card.vue` |
| `media_tab_changed` | User switches between Overview, Videos, and Media Photos tabs on a media detail page. | `components/media/Details.vue` |

## Next steps

To build insights and a dashboard from these events, go to your PostHog project and create an **"Analytics basics"** dashboard with insights like:

- **Login trend** — `user_logged_in` events over time (acquisition/retention signal)
- **Content engagement funnel** — `user_logged_in` → `media_viewed` → `video_played` (conversion funnel)
- **Search adoption** — `media_searched` unique users over time (feature adoption)
- **Churn signal** — `user_logged_out` events over time
- **Tab engagement** — `media_tab_changed` breakdown by `tab` property (videos vs photos vs overview)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

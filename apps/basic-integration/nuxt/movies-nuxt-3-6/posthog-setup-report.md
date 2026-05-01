<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Nuxt 3.6 Movies application. Here is a summary of all changes made:

**New files created:**
- `plugins/posthog.client.ts` — Initializes PostHog on the client side, hooks into Vue error handling, and provides `$posthog` throughout the app.
- `types/nuxt-app.d.ts` — TypeScript declarations for the `$posthog` property on the Nuxt app instance.
- `.env` — PostHog public token and host environment variables.

**Existing files modified:**
- `nuxt.config.ts` — Added PostHog config to `runtimeConfig.public.posthog` (public key, host, defaults version).
- `app.vue` — Added `onErrorCaptured` error boundary to capture component errors via `captureException`.
- `pages/login.vue` — Identifies the user (`posthog.identify`) and captures `user_logged_in` on success; captures `user_login_failed` with error message on failure.
- `components/NavBar.vue` — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- `pages/search.vue` — Captures `search_performed` with the query and total result count on the first page of results.
- `pages/[type]/[id].vue` — Captures `media_detail_viewed` with media ID, type, and title when a movie or TV show detail page loads.
- `components/video/Card.vue` — Captures `video_played` with video name, type, and key when a user clicks to play a video.
- `server/api/auth/login.post.ts` — Server-side `server_login` event captured via `posthog-node`, correlated with the client session using `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in (also calls `identify`) | `pages/login.vue` |
| `user_login_failed` | Login attempt fails, includes `error_message` | `pages/login.vue` |
| `user_logged_out` | User logs out (also calls `reset`) | `components/NavBar.vue` |
| `search_performed` | Search executed, includes `query` and `result_count` | `pages/search.vue` |
| `media_detail_viewed` | Movie or TV show detail page viewed, includes `media_id`, `media_type`, `media_title` | `pages/[type]/[id].vue` |
| `video_played` | Trailer or clip played, includes `video_name`, `video_type`, `video_key` | `components/video/Card.vue` |
| `server_login` | Server-side login event correlated with client session | `server/api/auth/login.post.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog to monitor user behavior. Below are five suggested insights:

1. **Login Funnel** — Funnel from `user_logged_in` to `media_detail_viewed` to track how quickly users engage with content after logging in.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Login Success vs Failure** — Trend chart comparing `user_logged_in` and `user_login_failed` over time to monitor auth health.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Search → Content Discovery Funnel** — Funnel from `search_performed` → `media_detail_viewed` to measure search effectiveness.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

4. **Video Engagement** — Trend of `video_played` events over time to track trailer and clip consumption.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **User Retention** — Retention insight for users who fired `user_logged_in` and then returned to `media_detail_viewed`.
   [Create in PostHog](https://us.posthog.com/project/2/insights/new?insight=RETENTION)

[View all dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

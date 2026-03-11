<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking enabled. A `server/utils/posthog.ts` utility was created to provide a shared PostHog Node client for server-side event tracking. Event capture was added to eight key files covering the full user journey: login/logout with user identification, media browsing, search, video playback, and error page tracking.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify()` with the username | `pages/login.vue` |
| `user_logged_out` | Fired when user clicks logout; also calls `posthog.reset()` | `components/NavBar.vue` |
| `server_login` | Server-side login event with session/distinct ID correlation | `server/api/auth/login.post.ts` |
| `media_searched` | Fired when a user executes a search query | `pages/search.vue` |
| `media_viewed` | Fired when a movie or TV show detail page is loaded | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user plays a video (trailer/clip) | `components/video/Card.vue` |
| `media_card_clicked` | Fired when a user clicks on a media card | `components/media/Card.vue` |
| `error_page_viewed` | Fired when the error page is shown, with status code and message | `error.vue` |

## Files changed

- `nuxt.config.ts` — Added `@posthog/nuxt` to modules, `posthog` to `runtimeConfig.public`, and `posthogConfig` with client/server error tracking and tracing headers.
- `server/utils/posthog.ts` — Created shared PostHog Node client singleton for server-side tracking.
- `pages/login.vue` — Added `user_logged_in` capture and `posthog.identify()` on successful login.
- `components/NavBar.vue` — Added `user_logged_out` capture and `posthog.reset()` on logout.
- `server/api/auth/login.post.ts` — Added `server_login` server-side event with session/distinct ID headers.
- `pages/search.vue` — Added `media_searched` event when a search is executed.
- `pages/[type]/[id].vue` — Added `media_viewed` event when a media detail page loads.
- `components/video/Card.vue` — Added `video_played` event when a video is played.
- `components/media/Card.vue` — Added `media_card_clicked` event when a card is clicked.
- `error.vue` — Added `error_page_viewed` event when the error page is shown.
- `.env` — Created with `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST`.

## Next steps

To complete the PostHog setup, create an "Analytics basics" dashboard in your PostHog project with the following recommended insights:

1. **Login Conversion Funnel** — Funnel from `user_logged_in` to `media_viewed` to `video_played`: shows how users move from authentication into content engagement.
2. **Daily Active Users (Logins)** — Trend of `user_logged_in` events over time: measures user acquisition and return visits.
3. **Top Searched Queries** — Breakdown of `media_searched` by `query` property: shows what content users are looking for.
4. **Most Viewed Media** — Breakdown of `media_viewed` by `media_title` property: identifies the most popular movies and TV shows.
5. **Churn Signal: Logout Rate** — Trend of `user_logged_out` events: tracks users actively leaving the app.

You can create these insights at [https://us.posthog.com/project/2/insights](https://us.posthog.com/project/2/insights).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

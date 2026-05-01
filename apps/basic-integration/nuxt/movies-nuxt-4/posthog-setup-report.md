<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 4 application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side and server-side tracking with session replay, error capture, and user identification.

## Changes made

| File | Change |
|------|--------|
| `nuxt.config.ts` | Added `@posthog/nuxt` module, `posthogConfig` with client/server error tracking and tracing headers, and `runtimeConfig.public.posthog` for runtime env exposure |
| `.env` | Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` |
| `server/utils/posthog.ts` | Created shared PostHog Node client singleton for server-side event capture |
| `pages/login.vue` | Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login |
| `components/NavBar.vue` | Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout |
| `pages/search.vue` | Added `posthog.capture('search_performed')` with query property when a search is triggered |
| `pages/[type]/[id].vue` | Added `posthog.capture('media_viewed')` with media ID, type, and title on detail page load |
| `components/video/Card.vue` | Added `posthog.capture('video_played')` with video name, type, and key on play |
| `components/media/Card.vue` | Added `posthog.capture('media_card_clicked')` with media ID, type, and title on card click |
| `server/api/auth/login.post.ts` | Added server-side `posthog.capture('server_login')` with session/distinct ID headers for client-server correlation |

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logged in via the login form | `pages/login.vue` |
| `user_logged_out` | User clicked the logout button in the navigation bar | `components/NavBar.vue` |
| `search_performed` | User performed a search with a query string | `pages/search.vue` |
| `media_viewed` | User viewed a movie or TV show detail page (top of content funnel) | `pages/[type]/[id].vue` |
| `video_played` | User clicked play on a video/trailer card | `components/video/Card.vue` |
| `media_card_clicked` | User clicked on a media card to navigate to a detail page | `components/media/Card.vue` |
| `server_login` | Server-side capture of login event with session context | `server/api/auth/login.post.ts` |

## Next steps

We've set up an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: https://us.posthog.com/project/2/dashboard/1346453

Suggested insights to add to the dashboard:
- **Content Discovery Funnel** – `user_logged_in` → `media_card_clicked` → `media_viewed` → `video_played`
- **Daily Logins** – trend of `user_logged_in` over time
- **Search Activity** – trend of `search_performed` with breakdown by query
- **Top Viewed Media** – trend of `media_viewed` with breakdown by `media_title`
- **Churn Signals** – trend of `user_logged_out` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured, providing automatic pageview tracking, session replay, and error tracking on both client and server. Six targeted events were instrumented across the key user journeys: authentication, content discovery, and video engagement.

## Changes made

| File | What changed |
|---|---|
| `nuxt.config.ts` | Added `@posthog/nuxt` module, `runtimeConfig.public.posthog`, `posthogConfig` with client/server error tracking and tracing headers |
| `server/utils/posthog.ts` | New file — shared singleton PostHog Node client for server-side event tracking |
| `server/api/auth/login.post.ts` | Added server-side `server_login` capture with session/distinct ID correlation from request headers |
| `pages/login.vue` | Added `posthog.identify()` + `user_logged_in` capture on successful login |
| `composables/useAuth.ts` | Added `user_logged_out` capture and `posthog.reset()` on logout |
| `pages/search.vue` | Added `search_performed` capture (with query term) when a new search is committed |
| `pages/[type]/[id].vue` | Added `media_detail_viewed` capture (with media ID, type, and title) on page load |
| `components/video/Card.vue` | Added `video_played` capture (with video name, type, and key) when play is clicked |
| `.env` | Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `identify()` to link future events to the user | `pages/login.vue` |
| `user_logged_out` | User logs out; calls `posthog.reset()` to clear identity | `composables/useAuth.ts` |
| `search_performed` | User commits a search query; includes the `query` property | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page; top of the content engagement funnel | `pages/[type]/[id].vue` |
| `video_played` | User clicks play on a video trailer or clip | `components/video/Card.vue` |
| `server_login` | Server-side login event correlated to the client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers | `server/api/auth/login.post.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Login conversion funnel** — Funnel from `user_logged_in` → `media_detail_viewed` → `video_played`
2. **Daily active users** — Unique users who fired any event, trended over time
3. **Top searches** — `search_performed` broken down by `query` property
4. **Most viewed media** — `media_detail_viewed` broken down by `media_title`
5. **Video play rate** — `video_played` count over time, broken down by `video_type`

Visit your PostHog project to create the dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

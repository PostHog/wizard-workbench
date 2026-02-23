<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. Here's a summary of all changes made:

## What was set up

- **`posthog-js`** and **`posthog-node`** packages installed
- **Environment variables** written to `.env` (`NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`)
- **`plugins/posthog.client.ts`** — new client-side plugin that initializes PostHog, hooks into `vue:error` for automatic exception capture, and provides `$posthog` throughout the app
- **`types/nuxt-app.d.ts`** — TypeScript declaration for `$posthog` on `NuxtApp`
- **`nuxt.config.ts`** — `runtimeConfig.public.posthog` block added with `publicKey`, `host`, and `posthogDefaults`
- **`composables/useAuth.ts`** — `posthog.identify()` called on login, `posthog.reset()` called on logout, error capture on login failure
- **`pages/login.vue`** — captures `login_error_displayed` when an auth error is shown
- **`pages/[type]/[id].vue`** — captures `media_viewed` with title, type, ID, and rating on mount
- **`pages/search.vue`** — captures `media_searched` with query text on each new search
- **`pages/[type]/category/[query].vue`** — captures `media_category_viewed` with category and media type on mount
- **`components/video/Card.vue`** — captures `video_played` with video name, type, and key on play click
- **`error.vue`** — captures `error_displayed` with status code and message on mount
- **`server/api/auth/login.post.ts`** — server-side PostHog Node tracking for `server_login_succeeded` and `server_login_failed`, with session/distinct ID propagation via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers

## Instrumented events

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in | `composables/useAuth.ts` |
| `user_logged_out` | User explicitly logged out | `composables/useAuth.ts` |
| `login_failed` | Login attempt failed with an error | `composables/useAuth.ts` |
| `media_viewed` | User viewed a movie or TV show detail page | `pages/[type]/[id].vue` |
| `media_searched` | User performed a search | `pages/search.vue` |
| `video_played` | User played a trailer or video | `components/video/Card.vue` |
| `media_category_viewed` | User viewed a category listing | `pages/[type]/category/[query].vue` |
| `error_displayed` | Application error shown to user | `error.vue` |
| `login_error_displayed` | Login error shown on login page | `pages/login.vue` |
| `server_login_succeeded` | Server-side: login API succeeded | `server/api/auth/login.post.ts` |
| `server_login_failed` | Server-side: login API rejected attempt | `server/api/auth/login.post.ts` |

## Next steps

To view your analytics, visit your PostHog project and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Login Conversion Funnel** — funnel from `user_logged_in` → `server_login_succeeded` to measure auth conversion
2. **Daily Media Views** — trend of `media_viewed` events to track content engagement over time
3. **Search Activity Trend** — trend of `media_searched` to understand search usage patterns
4. **Video Plays Trend** — trend of `video_played` to see trailer engagement over time
5. **Login Success vs Failure** — compare `user_logged_in` vs `login_failed` counts to monitor auth health

You can access your PostHog project at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

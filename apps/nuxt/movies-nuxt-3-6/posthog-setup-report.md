<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies (Nuxt 3.6) application. The setup includes client-side analytics via `posthog-js`, server-side event tracking via `posthog-node`, user identification on login, session correlation between client and server, Vue error tracking, and environment variable configuration.

## Changes made

| File | Description |
|------|-------------|
| `nuxt.config.ts` | Added `posthog` block to `runtimeConfig.public` (publicKey, host, posthogDefaults) |
| `plugins/posthog.client.ts` | Created client-side PostHog plugin — initializes `posthog-js`, hooks into `vue:error` for error tracking, and provides `$posthog` to the app |
| `types/nuxt-app.d.ts` | Created TypeScript declaration file for `$posthog` on `NuxtApp` |
| `pages/login.vue` | Added `posthog.identify(username)` and `posthog.capture('user_logged_in')` on successful login |
| `components/NavBar.vue` | Added `posthog.capture('user_logged_out')` and `posthog.reset()` on logout |
| `pages/search.vue` | Added `posthog.capture('media_searched', { query })` when a search is performed |
| `pages/[type]/[id].vue` | Added `posthog.capture('media_details_viewed', { media_id, media_type, media_title })` on mount |
| `server/api/auth/login.post.ts` | Added server-side `server_user_logged_in` event using `posthog-node`, with session correlation via `x-posthog-session-id` / `x-posthog-distinct-id` headers |
| `.env` | Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Client-side: user successfully logged in; also calls `identify()` | `pages/login.vue` |
| `server_user_logged_in` | Server-side: login event correlated with client session | `server/api/auth/login.post.ts` |
| `user_logged_out` | Client-side: user logged out; calls `reset()` | `components/NavBar.vue` |
| `media_searched` | User submitted a search query (includes `query` property) | `pages/search.vue` |
| `media_details_viewed` | User viewed a movie or TV show details page (includes `media_id`, `media_type`, `media_title`) | `pages/[type]/[id].vue` |

## Next steps

To view and explore your analytics data, visit your PostHog project:

- **PostHog project**: https://us.posthog.com/project/238460

### Suggested dashboard: "Analytics basics"

Create a dashboard at https://us.posthog.com/project/238460/dashboard with the following insights:

1. **Login conversion trend** — Trend of `user_logged_in` over time
2. **Login → Media view funnel** — Funnel: `user_logged_in` → `media_details_viewed`
3. **Search behavior** — Trend of `media_searched` over time
4. **Content engagement** — Trend of `media_details_viewed` broken down by `media_type`
5. **Session churn** — Trend of `user_logged_out` over time (churn signal)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

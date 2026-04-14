<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app (Nuxt 3.x). The integration includes:

- **Client-side SDK** (`posthog-js`) initialized in a Nuxt plugin (`plugins/posthog.client.ts`) with automatic Vue error tracking via the `vue:error` hook, and `__add_tracing_headers` enabled so client sessions are correlated with server-side events.
- **Server-side SDK** (`posthog-node`) added to two API routes for critical server-side events (login and logout), using `withContext()` to associate events with the correct client session and distinct ID.
- **User identification** on successful login (`posthog.identify(username)` + `posthog.reset()` on logout).
- **Environment variables** set in `.env` using `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`, referenced via `runtimeConfig` in `nuxt.config.ts`.
- **TypeScript types** declared in `types/nuxt-app.d.ts` for the `$posthog` NuxtApp property.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify(username)` | `pages/login.vue` |
| `user_logged_out` | Fired on logout; also calls `posthog.reset()` | `components/NavBar.vue` |
| `search_performed` | Fired when user submits a search query | `pages/search.vue` |
| `media_viewed` | Fired when a movie or TV show detail page loads; top of discovery funnel | `pages/[type]/[id].vue` |
| `server_login` | Server-side login event correlated with client session | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event correlated with client session | `server/api/auth/logout.post.ts` |

## Next steps

Once events are flowing into PostHog, you can build insights and dashboards in your [PostHog project](https://us.posthog.com/project/2). Suggested insights:

- **Login funnel**: `user_logged_in` → `media_viewed` → `search_performed` (conversion funnel)
- **Daily active users**: unique users triggering `user_logged_in` per day
- **Search usage**: `search_performed` event volume over time with `query` property breakdown
- **Media engagement**: top `media_title` values from `media_viewed` events
- **Churn signal**: users who trigger `user_logged_out` without any `media_viewed` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies 3.6 application. The following changes were made:

- **`plugins/posthog.client.ts`** (new): Client-side PostHog plugin that initialises `posthog-js`, registers a `vue:error` hook for automatic exception capture, and exposes `$posthog` throughout the app.
- **`types/nuxt-app.d.ts`** (new): TypeScript declaration extending `NuxtApp` with the `$posthog` property.
- **`nuxt.config.ts`**: Added `runtimeConfig.public.posthog` block referencing `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`.env`**: Created with `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` values (covered by `.gitignore`).
- **`composables/useAuth.ts`**: Added `posthog.identify()` + `user_logged_in` capture on successful login; `user_logged_out` capture + `posthog.reset()` on logout.
- **`pages/login.vue`**: Added `user_login_failed` capture in the catch block.
- **`pages/[type]/[id].vue`**: Added `media_viewed` capture when a movie or TV show detail page loads.
- **`components/video/Card.vue`**: Added `video_played` capture when a user clicks to play a video/trailer.
- **`pages/search.vue`**: Added `search_performed` capture when a search query is submitted.
- **`error.vue`**: Added `error_displayed` capture when the error page is rendered.
- **`server/api/auth/login.post.ts`**: Added server-side `login_attempted` event using `posthog-node`, correlated with the client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `composables/useAuth.ts` |
| `user_login_failed` | Login attempt fails | `pages/login.vue` |
| `user_logged_out` | User logs out | `composables/useAuth.ts` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User plays a video or trailer | `components/video/Card.vue` |
| `search_performed` | User submits a search query | `pages/search.vue` |
| `error_displayed` | An error page is shown | `error.vue` |
| `login_attempted` | Server-side login endpoint hit (all attempts) | `server/api/auth/login.post.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **User logins over time** – Trend of `user_logged_in` events; tracks daily active users.
2. **Media engagement funnel** – Funnel from `media_viewed` → `video_played`; shows how many viewers convert to trailer watchers.
3. **Login success vs failure** – Side-by-side trend of `user_logged_in` and `user_login_failed`; flags auth issues.
4. **Top searches** – `search_performed` events broken down by `query` property; reveals what users look for.
5. **Error rate** – Trend of `error_displayed` and PostHog exception events; monitors application health.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

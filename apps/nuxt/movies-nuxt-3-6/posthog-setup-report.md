<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 3.6 movies application. The integration covers both client-side and server-side event tracking, user identification, automatic error capture via the Vue error hook, and environment-variable-based configuration.

**Changes made:**

- `nuxt.config.ts` — Added `runtimeConfig.public.posthog` block with `publicKey`, `host`, and `posthogDefaults` sourced from environment variables.
- `.env` — Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- `plugins/posthog.client.ts` — New client-side PostHog plugin: initialises `posthog-js`, registers the `vue:error` hook for automatic exception capture, and exposes `$posthog` to the whole app.
- `types/nuxt-app.d.ts` — TypeScript declaration for `$posthog` on `NuxtApp`.
- `pages/login.vue` — Calls `posthog.identify(username)` and captures `user_logged_in` on successful login.
- `components/NavBar.vue` — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- `pages/search.vue` — Captures `search_performed` with the query string each time a new search is issued.
- `pages/[type]/[id].vue` — Captures `media_viewed` with `media_id`, `media_type`, `title`, and `vote_average` when a movie or TV show detail page loads.
- `components/media/Hero.vue` — Captures `trailer_played` with `media_id` and `title` when the trailer button is clicked.
- `components/video/Card.vue` — Captures `video_played` with `video_name`, `video_type`, and `video_key` when a video card is clicked.
- `server/api/auth/login.post.ts` — Server-side `server_login` event using `posthog-node`, reading `x-posthog-session-id` and `x-posthog-distinct-id` headers for session correlation via `withContext()`.
- `server/api/auth/logout.post.ts` — Server-side `server_logout` event using the same `posthog-node` pattern.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `identify()` | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button; also calls `reset()` | `components/NavBar.vue` |
| `search_performed` | User issues a new search query | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User plays the trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User plays a video clip from the video grid | `components/video/Card.vue` |
| `server_login` | Server-side login event with session correlation | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event with session correlation | `server/api/auth/logout.post.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog ([https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)) with the following insights:

1. **Login trend** — Trend of `user_logged_in` over the last 30 days. Tracks daily active users / new sessions.
2. **Content discovery funnel** — Funnel: `user_logged_in` → `search_performed` → `media_viewed` → `trailer_played`. Shows how users discover and engage with content.
3. **Media views by type** — Breakdown of `media_viewed` by `media_type` property (`movie` vs `tv`). Reveals which content category is more popular.
4. **Churn signal** — Trend of `user_logged_out` over the last 30 days. A rising logout rate relative to logins is an early churn signal.
5. **Video engagement** — Combined trend of `trailer_played` and `video_played`. Measures depth of content engagement beyond browsing.

You can build these at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

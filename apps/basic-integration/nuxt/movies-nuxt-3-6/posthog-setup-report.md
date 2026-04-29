<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.6 Movies app. Here is a summary of every change made:

- **`plugins/posthog.client.ts`** (new): Client-side PostHog plugin that initializes `posthog-js` with the project token and host from runtime config. Hooks into `vue:error` for automatic Vue error capture and provides `$posthog` throughout the app.
- **`nuxt.config.ts`** (updated): Added `runtimeConfig.public.posthog` block with `publicKey`, `host`, and `posthogDefaults` sourced from environment variables.
- **`types/nuxt-app.d.ts`** (new): TypeScript declaration that adds `$posthog: PostHog` to the `NuxtApp` interface for full type safety.
- **`pages/login.vue`** (updated): Captures `user_logged_in` and calls `posthog.identify()` with the username on successful login. Captures exceptions on login failure.
- **`components/NavBar.vue`** (updated): Captures `user_logged_out` and calls `posthog.reset()` before logging the user out.
- **`pages/search.vue`** (updated): Captures `search_performed` with the `query` property each time a new search is committed.
- **`pages/[type]/[id].vue`** (updated): Captures `media_detail_viewed` with `media_id`, `media_type`, and `media_title` when a movie or TV show detail page is loaded.
- **`components/media/Hero.vue`** (updated): Captures `trailer_played` with `media_id` and `media_title` when the Watch Trailer button is clicked.
- **`components/video/Card.vue`** (updated): Captures `video_played` with `video_name`, `video_type`, and `video_key` when a video card is clicked.
- **`components/media/Details.vue`** (updated): Captures `media_tab_changed` with `tab`, `media_id`, and `media_title` when the user switches between Overview, Videos, and Photos tabs.
- **`server/api/auth/login.post.ts`** (updated): Uses `posthog-node` to fire `server_login` on every login request, extracting `x-posthog-session-id` and `x-posthog-distinct-id` headers to correlate with the client-side session.
- **`server/api/auth/logout.post.ts`** (updated): Uses `posthog-node` to fire `server_logout` when a user logs out, correlating via session headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button | `components/NavBar.vue` |
| `search_performed` | User submits a search query | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User clicks Watch Trailer on the hero section | `components/media/Hero.vue` |
| `video_played` | User clicks to play a video card | `components/video/Card.vue` |
| `media_tab_changed` | User switches between Overview, Videos, Photos tabs | `components/media/Details.vue` |
| `server_login` | Server-side login event | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event | `server/api/auth/logout.post.ts` |

## Next steps

We've suggested insights for an "Analytics basics" dashboard to keep an eye on user behavior. Create them in PostHog:

- [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard)
- [Login conversion funnel: user_logged_in → media_detail_viewed → video_played](https://us.posthog.com/project/2/insights/new#funnel)
- [Daily logins trend (user_logged_in)](https://us.posthog.com/project/2/insights/new#trends)
- [Search activity trend (search_performed)](https://us.posthog.com/project/2/insights/new#trends)
- [Top content viewed breakdown (media_detail_viewed by media_title)](https://us.posthog.com/project/2/insights/new#trends)
- [Video engagement trend (video_played + trailer_played)](https://us.posthog.com/project/2/insights/new#trends)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

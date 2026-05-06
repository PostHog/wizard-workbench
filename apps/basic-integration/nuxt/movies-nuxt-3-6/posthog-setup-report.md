<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.6 movies application. The following changes were made:

- **Installed packages**: `posthog-js` (client-side) and `posthog-node` (server-side) added to `package.json`.
- **Client plugin** (`plugins/posthog.client.ts`): Initializes PostHog with runtime config, enables debug mode in development, hooks into `vue:error` for automatic exception capture, and provides `$posthog` to all components.
- **TypeScript types** (`types/nuxt-app.d.ts`): Declares `$posthog` on the `NuxtApp` interface.
- **Nuxt config** (`nuxt.config.ts`): Added `posthog` block to `runtimeConfig.public` mapping to `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` environment variables.
- **Environment variables** (`.env`): `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` set.
- **Login page** (`pages/login.vue`): Calls `posthog.identify(username)` and captures `user_logged_in` on successful login.
- **NavBar** (`components/NavBar.vue`): Captures `user_logged_out` and calls `posthog.reset()` before logout.
- **Search page** (`pages/search.vue`): Captures `search_performed` with `query` and `result_count` on the first page of results.
- **Media detail page** (`pages/[type]/[id].vue`): Captures `media_viewed` with `media_id`, `media_type`, `title`, and `vote_average` on mount.
- **Video card** (`components/video/Card.vue`): Captures `video_played` with `video_name`, `video_type`, and `video_key` when a trailer is played.
- **Login API** (`server/api/auth/login.post.ts`): Server-side `server_login` event via `posthog-node`, correlated with client session using `x-posthog-session-id` and `x-posthog-distinct-id` headers.
- **Logout API** (`server/api/auth/logout.post.ts`): Server-side `server_logout` event via `posthog-node`, correlated with client session headers.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `user_logged_out` | User clicks logout in navigation | `components/NavBar.vue` |
| `search_performed` | User searches for movies or TV shows | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User plays a trailer or video clip | `components/video/Card.vue` |
| `server_login` | Server-side login event with session correlation | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event with session correlation | `server/api/auth/logout.post.ts` |

## Next steps

We've set up the event tracking. Here are some recommended insights to build in your PostHog dashboard ("Analytics basics"):

- **Login → Media view → Video play funnel**: Create a Funnel insight with steps `user_logged_in` → `media_viewed` → `video_played` to see your content engagement conversion rate.
- **Daily active users (logins)**: Trend of `user_logged_in` over time to track user retention.
- **Search volume and results**: Trend of `search_performed` — break down by `query` to see what users are looking for.
- **Most viewed content**: Trend of `media_viewed` broken down by `media_type` (movie vs tv) and `title`.
- **Video play rate**: Ratio of `video_played` to `media_viewed` to measure trailer engagement.

Visit your [PostHog project](https://us.posthog.com/project/2/insights) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

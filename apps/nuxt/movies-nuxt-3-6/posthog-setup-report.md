<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application (Nuxt 3.6). The integration uses `posthog-js` for client-side tracking and `posthog-node` for server-side tracking, following the official Nuxt 3.6 integration pattern.

**Changes made:**

- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public`, reading the project token and host from environment variables.
- **`plugins/posthog.client.ts`** _(new)_ — Initializes PostHog on the client, attaches a `vue:error` hook for automatic error capture, and provides `$posthog` to all components via `useNuxtApp()`.
- **`types/nuxt-app.d.ts`** _(new)_ — TypeScript declarations so `$posthog` is properly typed throughout the project.
- **`.env`** — `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` written (covered by `.gitignore`).
- **`pages/login.vue`** — Calls `posthog.identify(username)` and captures `user_logged_in` on successful login.
- **`components/NavBar.vue`** — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- **`pages/search.vue`** — Captures `search_performed` (with `query` property) when the search term changes.
- **`pages/[type]/[id].vue`** — Captures `media_detail_viewed` (with `media_type`, `media_id`, `media_title`) when a movie or TV detail page loads.
- **`components/media/Hero.vue`** — Captures `trailer_played` (with `media_id`, `media_title`) when the trailer play button is clicked.
- **`components/video/Card.vue`** — Captures `video_played` (with `video_name`, `video_type`, `video_key`) when any video clip is played.
- **`server/api/auth/login.post.ts`** — Captures `server_login` server-side using `posthog-node`, correlating the client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; user identity is set via `posthog.identify()` | `pages/login.vue` |
| `user_logged_out` | User clicks logout; PostHog identity is reset | `components/NavBar.vue` |
| `search_performed` | User submits a search query (includes `query` property) | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (top of engagement funnel) | `pages/[type]/[id].vue` |
| `trailer_played` | User plays the trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User plays a video clip or featurette | `components/video/Card.vue` |
| `server_login` | Server-side login event correlated to the client session | `server/api/auth/login.post.ts` |

## Next steps

To get the most out of this integration, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `media_detail_viewed` → `trailer_played`. Shows how many users go from login to engaged viewing.
2. **Search usage trend** — Trends: `search_performed` over time. Understand how often users search and track query volume.
3. **Top content (media views)** — Trends: `media_detail_viewed` broken down by `media_title`. Shows which movies and shows are most popular.
4. **Video engagement rate** — Trends: `trailer_played` + `video_played` over time. Tracks how often users engage with video content.
5. **Daily active users (logins)** — Trends: `user_logged_in` over time, unique users. A core retention/churn signal.

You can create this dashboard at: https://us.i.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

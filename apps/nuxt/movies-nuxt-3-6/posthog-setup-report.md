<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Nuxt Movies 3.6 application. The integration covers client-side event tracking, user identification, server-side analytics, and error tracking.

## What was added

### New files
- **`plugins/posthog.client.ts`** — Initializes `posthog-js` using runtime config (env vars). Hooks into `vue:error` to automatically capture Vue errors.
- **`types/nuxt-app.d.ts`** — TypeScript declaration so `useNuxtApp().$posthog` is fully typed across the app.
- **`.env`** — Created with `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`).

### Modified files
- **`nuxt.config.ts`** — Added `posthog.publicKey`, `posthog.host`, and `posthog.posthogDefaults` to `runtimeConfig.public`.
- **`pages/login.vue`** — Identifies the user (`posthog.identify()`) and captures `user_logged_in` on successful login.
- **`components/NavBar.vue`** — Captures `user_logged_out` and calls `posthog.reset()` before logging the user out.
- **`pages/search.vue`** — Captures `search_performed` with the search query whenever a new search is executed.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` (media id, title, type, rating) when a movie or TV show detail page mounts.
- **`components/video/Card.vue`** — Captures `video_played` (name, type, key) when a user clicks to play a trailer or clip.
- **`pages/person/[id].vue`** — Captures `person_viewed` (id, name) when an actor/director profile page mounts.
- **`server/api/auth/login.post.ts`** — Server-side `server_login` event using `posthog-node`, correlated to the client session via `X-PostHog-Session-ID` / `X-PostHog-Distinct-ID` headers.

### Packages installed
- `posthog-js` — Client-side analytics SDK
- `posthog-node` — Server-side analytics SDK

## Event tracking summary

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `posthog.identify()` | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button | `components/NavBar.vue` |
| `search_performed` | User performs a debounced search; captures `query` property | `pages/search.vue` |
| `media_viewed` | User opens a movie or TV show detail page; captures `media_id`, `media_title`, `media_type`, `vote_average` | `pages/[type]/[id].vue` |
| `video_played` | User clicks play on a trailer or clip; captures `video_name`, `video_type`, `video_key` | `components/video/Card.vue` |
| `person_viewed` | User opens an actor/director detail page; captures `person_id`, `person_name` | `pages/person/[id].vue` |
| `server_login` | Server-side login confirmation, correlated to client session | `server/api/auth/login.post.ts` |

## Next steps

To build a PostHog dashboard for these events, navigate to **Dashboards → New dashboard** in your PostHog project and add the following insights:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `media_viewed` → `video_played`
2. **Daily logins trend** — Trends: `user_logged_in` over time
3. **Top searches** — Trends: `search_performed` broken down by `query`
4. **Most viewed media** — Trends: `media_viewed` broken down by `media_type`
5. **Logout rate** — Trends: `user_logged_out` vs `user_logged_in` ratio over time

### PostHog project
Your events will appear in [PostHog Project 2](https://us.posthog.com/project/2).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application. Here's what was set up:

- **`posthog-js`** and **`posthog-node`** were installed as dependencies.
- A client-side Nuxt plugin (`plugins/posthog.client.ts`) initialises PostHog with the project key and host from environment variables, hooks into `vue:error` for automatic error tracking, and provides `$posthog` to all components.
- TypeScript types were declared in `types/nuxt-app.d.ts` so `useNuxtApp().$posthog` is fully typed.
- `nuxt.config.ts` was updated to expose `posthog.publicKey` and `posthog.host` through `runtimeConfig.public`.
- Environment variables (`NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`) were written to `.env` (git-ignored).
- 7 events are now tracked across client-side pages and components, plus one server-side event correlated to the client session via `X-PostHog-Session-ID` / `X-PostHog-Distinct-ID` headers.
- User identification (`posthog.identify()`) fires on login, and `posthog.reset()` fires on logout.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client when a user successfully logs in. Triggers `posthog.identify()` with the username. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when a user clicks the logout button. Also calls `posthog.reset()` to clear the session. | `components/NavBar.vue` |
| `server_login` | Server-side event fired in the login API route when authentication succeeds, correlated with the client session via `X-PostHog-*` headers. | `server/api/auth/login.post.ts` |
| `media_viewed` | Fired when a user views a movie or TV show detail page. Properties: `media_id`, `media_title`, `media_type`, `vote_average`. | `pages/[type]/[id].vue` |
| `search_performed` | Fired when the user performs a debounced search. Properties: `query`. | `pages/search.vue` |
| `video_played` | Fired when a user clicks play on a video/trailer. Properties: `video_name`, `video_type`, `video_key`. | `components/video/Card.vue` |
| `media_tab_changed` | Fired when a user switches between Overview, Videos, and Photos tabs. Properties: `tab`, `media_id`, `media_title`, `media_type`. | `components/media/Details.vue` |

## Next steps

We've suggested five insights for you to build a dashboard to keep an eye on user behaviour. Visit your PostHog project and create an **"Analytics basics"** dashboard with the following insights:

1. **Login-to-engagement funnel** — Funnel: `user_logged_in` → `media_viewed` → `video_played`
   - [Create insight](https://us.posthog.com/project/238460/insights/new)

2. **Daily active logins** — Trend of `user_logged_in` over time (daily)
   - [Create insight](https://us.posthog.com/project/238460/insights/new)

3. **Login vs logout retention** — Trend comparing `user_logged_in` vs `user_logged_out` daily
   - [Create insight](https://us.posthog.com/project/238460/insights/new)

4. **Top viewed media** — Table of `media_viewed` broken down by `media_title` property
   - [Create insight](https://us.posthog.com/project/238460/insights/new)

5. **Most searched queries** — Table of `search_performed` broken down by `query` property
   - [Create insight](https://us.posthog.com/project/238460/insights/new)

Your PostHog project: https://us.posthog.com/project/238460

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

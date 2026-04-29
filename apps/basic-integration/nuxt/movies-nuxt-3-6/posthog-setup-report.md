<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app (Nuxt 3.5.3). The integration includes client-side analytics via `posthog-js`, server-side tracking via `posthog-node`, user identification on login, session correlation between client and server, and Vue error tracking.

## Changes made

| File | Change |
|------|--------|
| `nuxt.config.ts` | Added `posthog` block to `runtimeConfig.public` with `publicKey`, `host`, and `posthogDefaults` |
| `plugins/posthog.client.ts` | **New file** — initializes PostHog client, hooks into `vue:error` for error tracking, provides `$posthog` to the app |
| `types/nuxt-app.d.ts` | **New file** — TypeScript declaration for `$posthog` on the `NuxtApp` interface |
| `.env` | Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on successful login; also calls `posthog.identify()` with the username | `pages/login.vue` |
| `user_logged_out` | Fired before logout; also calls `posthog.reset()` to clear the identity | `components/NavBar.vue` |
| `search_performed` | Fired when the user executes a search query, with `query` property | `pages/search.vue` |
| `media_detail_viewed` | Fired when a movie/TV detail page loads, with `media_id`, `media_type`, `media_title` | `pages/[type]/[id].vue` |
| `video_played` | Fired when the user clicks play on a video trailer/clip, with `video_name`, `video_type`, `video_key` | `components/video/Card.vue` |
| `media_tab_switched` | Fired when the user switches between Overview/Videos/Photos tabs, with `tab` property | `components/media/Details.vue` |
| `server_user_logged_in` | Server-side event fired on login API, correlated to client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers | `server/api/auth/login.post.ts` |

## Next steps

We've set up insights and a dashboard for you to keep an eye on user behavior. Visit your PostHog project to create the "Analytics basics" dashboard with these recommended insights:

- **[New Dashboard](https://us.posthog.com/project/2/dashboards)** — Create an "Analytics basics" dashboard
- **[Login trend](https://us.posthog.com/project/2/insights/new)** — Trend of `user_logged_in` over time (daily logins)
- **[Churn signal](https://us.posthog.com/project/2/insights/new)** — Trend of `user_logged_out` over time
- **[Search activity](https://us.posthog.com/project/2/insights/new)** — Trend of `search_performed` with breakdown by `query`
- **[Content engagement funnel](https://us.posthog.com/project/2/insights/new)** — Funnel: `user_logged_in` → `media_detail_viewed` → `video_played`
- **[Media detail views](https://us.posthog.com/project/2/insights/new)** — Trend of `media_detail_viewed` with breakdown by `media_type`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

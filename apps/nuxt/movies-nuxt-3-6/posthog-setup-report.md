<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app (Nuxt ^3.5.3). The integration includes client-side analytics via `posthog-js`, server-side tracking via `posthog-node`, user identification on login, session/distinct ID correlation between client and server, and comprehensive error tracking.

## Changes made

| File | Change |
|------|--------|
| `nuxt.config.ts` | Added `posthog` block to `runtimeConfig.public` (reads from env vars) |
| `plugins/posthog.client.ts` | **New file** — Initializes PostHog client, hooks into `vue:error` for error tracking, provides `$posthog` to the app |
| `types/nuxt-app.d.ts` | **New file** — TypeScript declarations for `$posthog` on `NuxtApp` |
| `pages/login.vue` | Calls `posthog.identify()` and captures `user_logged_in` on successful login; captures exceptions on error |
| `components/NavBar.vue` | Captures `user_logged_out` and calls `posthog.reset()` on logout |
| `server/api/auth/login.post.ts` | Captures `server_user_logged_in` server-side using `posthog-node`, correlating session/distinct ID from `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers |
| `pages/[type]/[id].vue` | Captures `media_viewed` with `media_type`, `media_id`, and `media_title` on mount |
| `pages/search.vue` | Captures `search_performed` with `query` and `result_count` on first page of results; captures search errors |
| `pages/person/[id].vue` | Captures `person_viewed` with `person_id` and `person_name` on mount |
| `app.vue` | Adds `onErrorCaptured` error boundary for global Vue component error tracking |
| `.env` | Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` |

## Events tracked

| Event name | Description | File |
|------------|-------------|------|
| `user_logged_in` | Fired client-side when a user successfully logs in. Also calls `posthog.identify()` with the username. | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks the logout button. Also calls `posthog.reset()` to clear identity. | `components/NavBar.vue` |
| `server_user_logged_in` | Fired server-side on the login API endpoint, correlated to the client session via request headers. | `server/api/auth/login.post.ts` |
| `media_viewed` | Fired when a user views a movie or TV show detail page. Properties: `media_type`, `media_id`, `media_title`. | `pages/[type]/[id].vue` |
| `search_performed` | Fired when a user performs a search and results load. Properties: `query`, `result_count`. | `pages/search.vue` |
| `person_viewed` | Fired when a user views an actor/person detail page. Properties: `person_id`, `person_name`. | `pages/person/[id].vue` |

## Next steps

To get started exploring your data, visit your PostHog project and create a dashboard with insights like:

- **Daily Logins** — Trends on `user_logged_in` to track daily active users
- **Login → Media View Funnel** — Funnel from `user_logged_in` → `media_viewed` to measure engagement after login
- **Search Activity** — Trends on `search_performed` to understand discovery behavior
- **Logout Events (Churn Signal)** — Trends on `user_logged_out` to monitor churn signals
- **Person Page Views** — Trends on `person_viewed` to understand actor/people interest

Visit your PostHog project at: https://us.posthog.com

> **Note:** Dashboard creation was skipped because the current PostHog API key does not have the `dashboard:write` scope. You can create the dashboard manually using the event names above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-3.6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

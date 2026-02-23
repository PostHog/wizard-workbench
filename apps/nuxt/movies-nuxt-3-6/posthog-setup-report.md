<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application (Nuxt ^3.5.3). The integration uses `posthog-js` for client-side tracking and `posthog-node` for server-side tracking.

**Key changes made:**

- **`nuxt.config.ts`** – Added PostHog `runtimeConfig.public.posthog` block with `publicKey`, `host`, and `posthogDefaults` values sourced from environment variables (`NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`)
- **`plugins/posthog.client.ts`** *(new)* – Client-side PostHog plugin that initializes `posthog-js`, provides it via `$posthog`, and hooks into Vue's error lifecycle to capture exceptions automatically
- **`types/nuxt-app.d.ts`** *(new)* – TypeScript declaration for `$posthog` in `NuxtApp`
- **`.env`** – PostHog API key and host written as environment variables
- **`pages/login.vue`** – Identifies the user with `posthog.identify()` on successful login; captures `user_logged_in` and `login_failed` events
- **`composables/useAuth.ts`** – Captures `user_logged_out` and calls `posthog.reset()` on logout to disassociate the user session
- **`pages/search.vue`** – Captures `media_searched` with the search query when the user performs a search
- **`pages/[type]/[id].vue`** – Captures `media_viewed` with media ID, type, and title when a detail page loads
- **`components/media/Details.vue`** – Captures `media_tab_changed` when the user switches between Overview/Videos/Photos tabs
- **`components/video/Card.vue`** – Captures `video_played` with video metadata when a trailer is played
- **`components/media/Card.vue`** – Captures `media_card_clicked` with media metadata when a card is clicked
- **`error.vue`** – Captures `error_displayed` with error context and calls `captureException` when an error page is shown
- **`server/api/auth/login.post.ts`** – Server-side tracking of `server_login_completed` using `posthog-node`, correlated with the client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers
- **`server/api/auth/logout.post.ts`** – Server-side tracking of `server_logout_completed` using `posthog-node`, correlated with the client session when headers are present

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in with username and password | `pages/login.vue` |
| `user_logged_out` | User logs out of their session | `composables/useAuth.ts` |
| `login_failed` | User login attempt failed (wrong credentials or validation error) | `pages/login.vue` |
| `media_searched` | User performs a search for movies or TV shows | `pages/search.vue` |
| `media_viewed` | User views a media detail page (movie or TV show) | `pages/[type]/[id].vue` |
| `media_tab_changed` | User switches tabs (Overview, Videos, Photos) on a media detail page | `components/media/Details.vue` |
| `video_played` | User clicks to play a video/trailer | `components/video/Card.vue` |
| `media_card_clicked` | User clicks on a media card to view details | `components/media/Card.vue` |
| `error_displayed` | An application error page is shown to the user | `error.vue` |
| `server_login_completed` | Server-side: login API endpoint successfully authenticated a user | `server/api/auth/login.post.ts` |
| `server_logout_completed` | Server-side: logout API endpoint successfully logged out a user | `server/api/auth/logout.post.ts` |

## Next steps

The PostHog API key provided does not have write scopes (`dashboard:write`, `insight:write`), so the dashboard and insights could not be created automatically. You can create them manually in your PostHog project:

1. **[Create a new dashboard](https://us.posthog.com/project/2/dashboards)** named "Analytics basics"
2. Add these recommended insights:
   - **Login Conversion Funnel** – Funnel: `user_logged_in` → `media_viewed`
   - **Daily Active Users** – Trends: unique users per day via `user_logged_in`
   - **Top Searched Content** – Trends: `media_searched` count over time
   - **Content Engagement by Media Type** – Trends: `media_viewed` broken down by `media_type` property
   - **Login Failure Rate** – Trends: `login_failed` vs `user_logged_in` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

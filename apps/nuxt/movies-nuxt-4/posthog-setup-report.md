<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 4 application. The following changes were made:

- **`nuxt.config.ts`**: Added `@posthog/nuxt` to the modules list, configured `runtimeConfig.public.posthog` with environment variable references, and added a `posthogConfig` block enabling client-side exception capture, server-side exception autocapture, and tracing headers for session correlation between client and server.
- **`server/utils/posthog.ts`** _(new file)_: Created a singleton PostHog Node client (`useServerPostHog()`) reused across server requests, reading credentials from `runtimeConfig.public.posthog`.
- **`server/api/auth/login.post.ts`**: Added server-side `server_user_logged_in` event after successful authentication, including `$session_id` and distinct ID extracted from `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` request headers for cross-domain correlation.
- **`pages/login.vue`**: Added `usePostHog()`, calls `posthog.identify(username)` and captures `user_logged_in` on successful login; captures `user_login_failed` with the error message on failure.
- **`components/NavBar.vue`**: Added `handleLogout` function that captures `user_logged_out` and calls `posthog.reset()` before delegating to the auth logout, ensuring the PostHog session is reset with the user.
- **`pages/search.vue`**: Added `search_performed` capture inside the `search()` function, including the query term as a property.
- **`pages/[type]/[id].vue`**: Added `media_viewed` capture in `onMounted`, with `media_type`, `media_id`, and `media_title` properties.
- **`components/video/Card.vue`**: Added `video_played` capture in the `play()` function, including `video_name`, `video_type`, and `video_key`.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired client-side when a user successfully logs in; also calls `posthog.identify()` | `pages/login.vue` |
| `user_login_failed` | Fired client-side when a login attempt fails, with the `error_message` property | `pages/login.vue` |
| `user_logged_out` | Fired client-side when a user clicks logout; resets the PostHog session | `components/NavBar.vue` |
| `search_performed` | Fired client-side when a search query is executed, with the `query` property | `pages/search.vue` |
| `media_viewed` | Fired client-side on mount of a movie/TV detail page, with `media_type`, `media_id`, `media_title` | `pages/[type]/[id].vue` |
| `video_played` | Fired client-side when a trailer or video clip is played, with `video_name`, `video_type`, `video_key` | `components/video/Card.vue` |
| `server_user_logged_in` | Fired server-side on the login API route with session correlation via `$session_id` | `server/api/auth/login.post.ts` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login conversion funnel** – Funnel from `user_logged_in` → `media_viewed` → `video_played`. Helps measure how many new users explore content after sign-in. Create at: https://us.posthog.com/project/2/insights/new
2. **Daily active users (logins)** – Trend chart of unique users who fired `user_logged_in` over time. Shows user retention and engagement trends.
3. **Top searches** – Table of `search_performed` grouped by `query` property. Reveals which movies/shows users are most interested in.
4. **Most-viewed media** – Table of `media_viewed` grouped by `media_title` and `media_type`. Shows which content drives the most engagement.
5. **Login failures** – Trend of `user_login_failed` over time. Acts as an alert for authentication problems.

Visit https://us.posthog.com/project/2/dashboard to create and populate the **"Analytics basics"** dashboard with these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

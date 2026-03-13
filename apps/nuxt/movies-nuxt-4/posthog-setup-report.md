<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured, enabling automatic client-side and server-side event capture, session replay, and error tracking. User identification is performed on login, and PostHog state is reset on logout. Server-side events use the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (automatically sent via `__add_tracing_headers`) to correlate client and server activity for the same user session.

**Files created or modified:**
- `nuxt.config.ts` — Added `@posthog/nuxt` module, `posthogConfig` block (client/server error tracking), and PostHog `runtimeConfig` entry
- `server/utils/posthog.ts` — New: singleton `useServerPostHog()` utility for server-side PostHog Node client
- `pages/login.vue` — Added `posthog.identify()` and `posthog.capture('user_logged_in')` on successful login
- `components/NavBar.vue` — Added `posthog.capture('user_logged_out')` and `posthog.reset()` before logout
- `pages/[type]/[id].vue` — Added `posthog.capture('media_viewed')` with `media_type`, `media_id`, and `title` on mount
- `pages/search.vue` — Added `posthog.capture('search_performed')` with `query` property on each new search
- `server/api/auth/login.post.ts` — Added server-side `server_login` event with session/distinct ID correlation
- `server/api/auth/logout.post.ts` — Added server-side `server_logout` event with session/distinct ID correlation
- `.env` — Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logged in via the login form | `pages/login.vue` |
| `user_logged_out` | User clicked the logout button in the navigation bar | `components/NavBar.vue` |
| `server_login` | Server-side login API processed a successful login request | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout API processed a logout request | `server/api/auth/logout.post.ts` |
| `media_viewed` | User viewed a movie or TV show detail page | `pages/[type]/[id].vue` |
| `search_performed` | User performed a search query | `pages/search.vue` |

## Next steps

Visit your PostHog project to explore these events and build insights:

- [PostHog Project](https://us.posthog.com/project/2)
- [Create a funnel: Login → Media Viewed](https://us.posthog.com/project/2/insights/new#funnel)
- [Trends: Daily logins (user_logged_in)](https://us.posthog.com/project/2/insights/new#trend)
- [Trends: Most searched queries (search_performed)](https://us.posthog.com/project/2/insights/new#trend)
- [Trends: Media views by type (media_viewed)](https://us.posthog.com/project/2/insights/new#trend)
- [Session Replay](https://us.posthog.com/project/2/replay)
- [Error Tracking](https://us.posthog.com/project/2/error_tracking)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

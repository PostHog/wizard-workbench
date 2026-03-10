<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application using the `@posthog/nuxt` module. The integration covers client-side event tracking, server-side event tracking with session correlation, user identification on login/logout, automatic error capture on both client and server, and environment variable configuration.

**Key changes made:**

- Installed `@posthog/nuxt` package
- Updated `nuxt.config.ts` to register the `@posthog/nuxt` module with `capture_exceptions`, `enableExceptionAutocapture`, and tracing header support
- Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env`
- Created `server/utils/posthog.ts` with a singleton PostHog Node client for server-side tracking
- Added `posthog.identify()` and `user_logged_in` capture in `pages/login.vue` on successful login
- Added `user_logged_out` capture and `posthog.reset()` in `components/NavBar.vue` on logout
- Added `media_viewed` capture with media metadata in `pages/[type]/[id].vue` on mount
- Added `media_searched` capture with the search query in `pages/search.vue` on each new search
- Added `video_played` capture with video metadata in `components/video/Card.vue` on play
- Added server-side `server_login` event in `server/api/auth/login.post.ts`, reading `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers to correlate with client sessions

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button | `components/NavBar.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `media_searched` | User submits a search query | `pages/search.vue` |
| `video_played` | User clicks play on a video | `components/video/Card.vue` |
| `server_login` | Server-side login event with session correlation | `server/api/auth/login.post.ts` |

## Next steps

To view your analytics, visit your PostHog project and create an "Analytics basics" dashboard. Suggested insights to add:

1. **Login conversion funnel** – Funnel: `user_logged_in` → `media_viewed` → `video_played`
2. **Daily active users** – Unique users who fired `user_logged_in` over time
3. **Most searched terms** – Breakdown of `media_searched` by `query` property
4. **Top viewed media** – Breakdown of `media_viewed` by `media_title` property
5. **Churn signal** – Trend of `user_logged_out` events over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

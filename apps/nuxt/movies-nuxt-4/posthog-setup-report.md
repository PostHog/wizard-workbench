<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt Movies application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side initialization, session replay, and built-in error tracking. A server-side PostHog Node client was set up for correlated server/client event tracking. Automatic exception capture is enabled on both the client (Vue) and server (Nitro) sides. User identification is performed on login, and PostHog identity is reset on logout.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also identifies the user in PostHog | `pages/login.vue` |
| `login_failed` | User login attempt failed | `pages/login.vue` |
| `user_logged_out` | User logs out via NavBar; also resets PostHog identity | `components/NavBar.vue` |
| `server_login` | Server-side login event correlated with client session via headers | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event | `server/api/auth/logout.post.ts` |
| `search_performed` | User performs a search query | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User clicks to play a trailer or video clip | `components/video/Card.vue` |
| `genre_browsed` | User browses movies by genre | `pages/genre/[no]/movie.vue` |

## Next steps

To explore these events and build insights, visit your PostHog project:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Events Explorer](https://us.posthog.com/project/2/events)
- [Session Replays](https://us.posthog.com/project/2/replay)

Suggested insights to create in your PostHog dashboard:

1. **Login funnel** — Trend of `user_logged_in` over time to track daily active users
2. **Search activity** — Trend of `search_performed` to see how often users search
3. **Content engagement funnel** — `user_logged_in` → `media_detail_viewed` → `video_played` to measure content engagement
4. **Churn signal** — Trend of `user_logged_out` relative to logins
5. **Genre popularity** — Breakdown of `genre_browsed` by `genre_name` property

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

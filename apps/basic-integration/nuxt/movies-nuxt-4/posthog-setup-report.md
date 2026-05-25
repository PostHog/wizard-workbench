<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured, providing automatic client-side and server-side error tracking, session replay, and a shared PostHog Node client for server-side event capture. Environment variables are stored in `.env` and referenced via `runtimeConfig`. Client-side events use the `usePostHog()` composable auto-provided by `@posthog/nuxt`; server-side events use a shared `useServerPostHog()` utility. Users are identified on login via `posthog.identify()` and the session is correlated with the server via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated and logged in | `pages/login.vue` |
| `user_logged_out` | User clicked the logout button | `components/NavBar.vue` |
| `search_performed` | User performed a search query for movies or TV shows | `pages/search.vue` |
| `media_detail_viewed` | User viewed the detail page for a movie or TV show | `pages/[type]/[id].vue` |
| `video_played` | User played a video trailer or clip | `components/video/Card.vue` |
| `category_browsed` | User browsed a specific media category listing | `pages/[type]/category/[query].vue` |
| `genre_browsed` | User browsed movies filtered by genre | `pages/genre/[no]/movie.vue` |
| `genre_browsed` | User browsed TV shows filtered by genre | `pages/genre/[no]/tv.vue` |
| `person_profile_viewed` | User viewed a person's profile page | `pages/person/[id].vue` |
| `server_user_logged_in` | Server-side capture of user login with session correlation | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side capture of user logout | `server/api/auth/logout.post.ts` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with these suggested insights:

1. **Login funnel** — Funnel from `user_logged_in` → `media_detail_viewed` → `video_played` to measure how many users progress from login to content engagement.
2. **Search conversion** — Trend of `search_performed` events over time, to understand discovery usage.
3. **Content engagement** — Trend of `media_detail_viewed` and `video_played` events over time, broken down by `media_type`.
4. **Genre & category popularity** — Trend of `genre_browsed` and `category_browsed` broken down by `genre_name` and `category` properties.
5. **User retention** — Retention insight showing how many users who fired `user_logged_in` return to fire `media_detail_viewed` in subsequent days.

Create your dashboard at: [New Dashboard](/dashboard)

View all events in Data Management: [Events](/data-management/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

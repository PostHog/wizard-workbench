<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 4 project. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking. A shared `useServerPostHog()` utility was created for server routes, and `usePostHog()` is used throughout client components. User identification occurs on login, and the PostHog session is reset on logout. Client–server correlation is maintained via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; PostHog identity is set | `pages/login.vue` |
| `user_logged_out` | User logs out; PostHog session is reset | `components/NavBar.vue` |
| `server_login` | Server-side login event with session correlation | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event with session correlation | `server/api/auth/logout.post.ts` |
| `media_detail_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User plays a trailer or video clip | `components/video/Card.vue` |
| `search_performed` | User executes a search query | `pages/search.vue` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Login funnel** — Funnel from `$pageview` (login page) → `user_logged_in` to measure login conversion rate
2. **Daily active users** — Unique users per day based on `user_logged_in`
3. **Content engagement** — Trend of `media_detail_viewed` broken down by `media_type` (movie vs TV)
4. **Video play rate** — Trend of `video_played` events over time, showing which content drives video engagement
5. **Search activity** — Trend of `search_performed` events, useful for understanding content discovery patterns

Visit [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new) to create these insights, or [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create the dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

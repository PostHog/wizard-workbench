<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 movies application. The `@posthog/nuxt` module was installed and configured to provide automatic client-side (Vue) and server-side (Nitro) error tracking, session replay, and product analytics. A shared server-side PostHog Node client was created for server API route tracking, enabling full client-server event correlation via the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers. Users are identified by username on login and their session is reset on logout.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on successful login. Calls `posthog.identify()` to link the session to the username. | `pages/login.vue` |
| `user_logged_out` | Fired when the user clicks logout. Calls `posthog.reset()` to clear the session. | `components/NavBar.vue` |
| `search_performed` | Fired when a debounced search query is submitted. Includes the search query text. | `pages/search.vue` |
| `media_viewed` | Fired on mount of a movie or TV show detail page. Includes media ID, type, and title. Top of the content engagement funnel. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks to play a trailer or video. Includes video name, type, and YouTube key. | `components/video/Card.vue` |
| `server_login` | Server-side event captured in the login API route. Correlates with `user_logged_in` via session/distinct ID headers. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event captured in the logout API route. | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1468475)
- [Login Funnel](https://us.posthog.com/insights/4GnVyL7Z) — Conversion funnel: login → media viewed → video played
- [Daily Active Users (Logins)](https://us.posthog.com/insights/oTKgvv87) — Daily login event counts
- [Top Searches](https://us.posthog.com/insights/T9QSyuJK) — Daily search activity
- [Content Engagement](https://us.posthog.com/insights/cb85qc8D) — Media views and video plays over time
- [User Churn (Logouts)](https://us.posthog.com/insights/QolbayvA) — Daily logout event counts

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured, a server-side PostHog utility was created, and event tracking was added to nine key files covering user authentication, content discovery, and engagement flows. Automatic exception capture was enabled on both the client (Vue) and server (Nitro) sides. User identification is performed client-side on login, and the distinct ID / session ID are forwarded to server-side API routes via `X-POSTHOG-DISTINCT-ID` / `X-POSTHOG-SESSION-ID` headers so all events for the same user are correlated.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired client-side after a successful login. Also calls `posthog.identify()` to link the session to the user. | `pages/login.vue` |
| `user_logged_out` | Fired client-side when the logout button is clicked. Also calls `posthog.reset()` to clear the session. | `components/NavBar.vue` |
| `server_login` | Server-side login event with session/distinct ID correlation, captured in the login API route. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event with session/distinct ID correlation, captured in the logout API route. | `server/api/auth/logout.post.ts` |
| `search_performed` | Fired when a user submits a search query (on the first page of results), including the query text and result count. | `pages/search.vue` |
| `media_detail_viewed` | Fired on mount when a user views a movie or TV show detail page — the entry point of the engagement funnel. | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks play on a video/trailer card. | `components/video/Card.vue` |
| `language_changed` | Fired when a user switches the display language, capturing the previous and new locale. | `components/LanguageSwitcher.vue` |
| `media_card_clicked` | Fired when a user clicks a media card to navigate to the detail page. | `components/media/Card.vue` |

## Next steps

We've prepared five insights for you to build an **"Analytics basics"** dashboard. Create the dashboard in PostHog, then add these insights to it:

1. **Login-to-Engagement Funnel** — Track conversion from login → media detail view → video play.
   [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)
   Steps: `user_logged_in` → `media_detail_viewed` → `video_played`

2. **Daily Active Users (Logins)** — Daily trend of `user_logged_in` to monitor user activity.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `user_logged_in`, aggregation: unique users, interval: day

3. **Search Volume Over Time** — Trend of `search_performed` to track search engagement.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `search_performed`, aggregation: total count, interval: day

4. **Most Viewed Media** — Breakdown of `media_detail_viewed` by `media_title` to see which titles drive the most engagement.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Event: `media_detail_viewed`, breakdown by property: `media_title`

5. **Churned Users (Logged Out vs Logged In)** — Compare `user_logged_out` vs `user_logged_in` over time to spot churn signals.
   [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)
   Events: `user_logged_in` and `user_logged_out` on the same chart

[Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 movies application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side and server-side error tracking, session replay, and product analytics. Six events were instrumented across four client-side files and two server API routes. User identification is performed on login so that all subsequent events are linked to a named user, and a `posthog.reset()` call on logout prevents session bleed-over. Server-side events correlate with client sessions via the automatically-injected `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client after a successful login. Also calls `posthog.identify()` with the username. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when the user clicks the logout button. Followed by `posthog.reset()`. | `components/NavBar.vue` |
| `media_searched` | Fired on the client when a search query returns page-1 results. Includes `query` and `result_count`. | `pages/search.vue` |
| `media_detail_viewed` | Fired on the client when a movie or TV show detail page mounts. Includes `media_type`, `media_id`, and `media_title`. | `pages/[type]/[id].vue` |
| `server_login` | Fired server-side on successful authentication, correlated to the client session via headers. | `server/api/auth/login.post.ts` |
| `server_logout` | Fired server-side when the logout endpoint is called, correlated to the client session via headers. | `server/api/auth/logout.post.ts` |

## Next steps

We've designed five insights for an **Analytics basics (wizard)** dashboard. Create them at the links below:

1. **Login funnel** — Funnel from `user_logged_in` → `media_detail_viewed`: measures how many users log in and then engage with content. [Create insight](https://us.posthog.com/project/2/insights/new)

2. **Search activity trend** — Trend of `media_searched` over time, broken down by nothing (volume) or with a `query` property table: shows content discovery patterns. [Create insight](https://us.posthog.com/project/2/insights/new)

3. **Most-viewed media** — Trend of `media_detail_viewed` broken down by `media_title`: reveals the most popular movies and TV shows. [Create insight](https://us.posthog.com/project/2/insights/new)

4. **Daily active users** — Trend of `user_logged_in` (unique users) over time: your core engagement metric. [Create insight](https://us.posthog.com/project/2/insights/new)

5. **Churn signal** — Trend of `user_logged_out` vs `user_logged_in` on the same chart: ratio indicates session completion and potential drop-off. [Create insight](https://us.posthog.com/project/2/insights/new)

Once insights are created, add them to a new dashboard named **Analytics basics (wizard)**: [Dashboards](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

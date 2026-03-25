<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies 4 application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side and server-side event tracking with error capture, session replay, and user identification. A shared server-side PostHog client utility was created, and 9 events were instrumented across 8 files covering authentication, search, media engagement, video interaction, and language switching.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `login_failed` | User login attempt failed with an error | `pages/login.vue` |
| `user_logged_out` | User logs out of the application | `composables/useAuth.ts` |
| `search_performed` | User submits a search query | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (top of engagement funnel) | `pages/[type]/[id].vue` |
| `video_played` | User clicks play on a video/trailer | `components/video/Card.vue` |
| `language_changed` | User switches the UI language | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side event capturing login with session correlation | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event capturing logout | `server/api/auth/logout.post.ts` |

## Next steps

Start exploring your data in PostHog as events come in. Here are some suggested insights to create:

- **[Login conversion funnel](https://us.posthog.com/project/238460/insights/new#funnel)** — Funnel: `user_logged_in` → `media_detail_viewed` → `video_played` to track the user engagement journey after login
- **[Search to media engagement](https://us.posthog.com/project/238460/insights/new#funnel)** — Funnel: `search_performed` → `media_detail_viewed` to measure search effectiveness
- **[Login success vs failure trend](https://us.posthog.com/project/238460/insights/new#trend)** — Trend comparing `user_logged_in` vs `login_failed` over time
- **[Video plays trend](https://us.posthog.com/project/238460/insights/new#trend)** — Trend of `video_played` events to measure content engagement
- **[User churn (logout events)](https://us.posthog.com/project/238460/insights/new#trend)** — Trend of `user_logged_out` events to monitor churn signals

Visit your [PostHog project](https://us.posthog.com/project/238460/dashboard) to create a dashboard with these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

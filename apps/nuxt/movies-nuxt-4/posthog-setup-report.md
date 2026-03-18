<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking. A `server/utils/posthog.ts` utility was created to provide a shared PostHog Node client for server-side event capture. Environment variables were set up in `.env` and referenced in `nuxt.config.ts`. Nine events were instrumented across seven files covering the full user journey — from authentication through media discovery, video playback, and language preferences.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated and logged in | `pages/login.vue` |
| `user_logged_out` | User clicked logout in the navigation bar | `components/NavBar.vue` |
| `media_searched` | User performed a search for movies or TV shows | `pages/search.vue` |
| `media_detail_viewed` | User viewed the detail page for a movie or TV show | `pages/[type]/[id].vue` |
| `video_played` | User clicked play on a trailer or video clip | `components/video/Card.vue` |
| `person_viewed` | User viewed the profile page for a person (actor/director) | `pages/person/[id].vue` |
| `language_changed` | User switched the UI language via the language switcher | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side login event with session context | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event | `server/api/auth/logout.post.ts` |

## Next steps

You can explore your analytics and build dashboards in your PostHog project:

- PostHog project: https://us.posthog.com/project/2

Suggested insights to create in your PostHog dashboard:

1. **Login funnel** — Trend of `user_logged_in` over time
2. **Content engagement funnel** — Funnel from `media_detail_viewed` → `video_played`
3. **Search adoption** — Trend of `media_searched` with query breakdown
4. **Churn indicator** — Trend of `user_logged_out` over time
5. **Content discovery** — Top `media_detail_viewed` events by `media_title` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

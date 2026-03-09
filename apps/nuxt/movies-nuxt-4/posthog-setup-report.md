<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured, providing automatic client-side initialization, session replay, and error tracking. A server-side PostHog Node client was set up for correlating server events with client sessions. Ten events were instrumented across authentication, content discovery, and engagement flows. Environment variables were written to `.env` and the project's `.gitignore` is covered.

## Changes summary

### New files
- `server/utils/posthog.ts` — Shared PostHog Node client singleton for server-side tracking

### Modified files
- `nuxt.config.ts` — Added `@posthog/nuxt` to modules, configured `posthogConfig` with env vars, client/server error tracking enabled
- `composables/useAuth.ts` — Added `posthog.identify()` on login, `posthog.capture('user_logged_in')`, `posthog.capture('login_failed')`, and `posthog.reset()` + `posthog.capture('user_logged_out')` on logout
- `server/api/auth/login.post.ts` — Added server-side `server_login` event with session/distinct ID correlation from request headers
- `pages/search.vue` — Added `media_searched` capture when a search is performed
- `pages/[type]/[id].vue` — Added `media_viewed` capture on mount with media type, title, and rating
- `pages/person/[id].vue` — Added `person_viewed` capture on mount with person name and ID
- `components/video/Card.vue` — Added `video_played` capture when a trailer/video is played
- `components/media/Card.vue` — Added `media_card_clicked` capture when a media card is clicked
- `components/LanguageSwitcher.vue` — Added `language_changed` capture with from/to locale
- `error.vue` — Added `error_displayed` capture and `captureException` for non-404 errors

## Event tracking table

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in | `composables/useAuth.ts` |
| `user_logged_out` | Fired when a user logs out | `composables/useAuth.ts` |
| `login_failed` | Fired when a login attempt fails | `composables/useAuth.ts` |
| `server_login` | Server-side login event with session correlation | `server/api/auth/login.post.ts` |
| `media_viewed` | Fired when a user views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `media_searched` | Fired when a user performs a search | `pages/search.vue` |
| `video_played` | Fired when a user plays a video/trailer | `components/video/Card.vue` |
| `media_card_clicked` | Fired when a user clicks on a media card | `components/media/Card.vue` |
| `language_changed` | Fired when a user changes the app language | `components/LanguageSwitcher.vue` |
| `person_viewed` | Fired when a user views a person detail page | `pages/person/[id].vue` |
| `error_displayed` | Fired when an application error is shown to the user | `error.vue` |

## Next steps

We've instrumented the key events. Build an "Analytics basics" dashboard in PostHog with these recommended insights:

1. **Login conversion funnel** — Funnel from `user_logged_in` → `media_viewed` → `video_played`
2. **Daily active users** — Unique users trend for `user_logged_in`
3. **Content engagement** — Event volume trend for `media_viewed`, `media_card_clicked`, and `video_played`
4. **Search usage** — Trend of `media_searched` unique users over time
5. **Login failure rate** — `login_failed` vs `user_logged_in` event counts

Create your dashboard at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

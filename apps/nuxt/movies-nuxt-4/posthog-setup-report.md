<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The `@posthog/nuxt` module was installed, providing automatic client-side and server-side tracking with built-in error capture, session replay, and the `usePostHog()` composable. Environment variables were configured, a server-side PostHog utility was created, and 11 events were instrumented across 11 files covering authentication, content discovery, and media engagement flows.

## Changes made

| File | Change |
|------|--------|
| `nuxt.config.ts` | Added `@posthog/nuxt` module with `posthogConfig` (client + server error tracking) |
| `server/utils/posthog.ts` | Created server-side PostHog singleton utility (`useServerPostHog()`) |
| `.env.local` | Added `NUXT_PUBLIC_POSTHOG_KEY` and `NUXT_PUBLIC_POSTHOG_HOST` |

## Instrumented events

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in; also calls `posthog.identify()` to associate the session with the user | `pages/login.vue` |
| `user_logged_out` | User clicks logout; PostHog session is reset via `posthog.reset()` | `components/NavBar.vue` |
| `media_searched` | User performs a search for movies or TV shows, with query and result count | `pages/search.vue` |
| `media_detail_viewed` | User views a movie or TV show detail page (top of engagement funnel) | `pages/[type]/[id].vue` |
| `trailer_played` | User clicks to play the official trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User clicks to play a video clip from the media detail page | `components/video/Card.vue` |
| `language_changed` | User switches the interface language, tracking from/to locale | `components/LanguageSwitcher.vue` |
| `category_browsed` | User views a media category listing (top of discovery funnel) | `pages/[type]/category/[query].vue` |
| `genre_browsed` | User views movies filtered by genre, with genre ID and name | `pages/genre/[no]/movie.vue` |
| `person_profile_viewed` | User views an actor/director profile page | `pages/person/[id].vue` |
| `server_login` | Server-side login event correlating session/distinct IDs from request headers | `server/api/auth/login.post.ts` |

## Suggested PostHog dashboard: "Analytics basics"

Create an **Analytics basics** dashboard in your PostHog project with these 5 insights:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `media_detail_viewed` → `trailer_played`
2. **Search engagement** — Trend: `media_searched` over time, broken down by `result_count`
3. **Content discovery** — Trend: `category_browsed` and `genre_browsed` events over time
4. **Media engagement** — Trend: `media_detail_viewed`, `trailer_played`, `video_played` compared over time
5. **Churn signal** — Trend: `user_logged_out` events over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboard/new

## Next steps

We've instrumented 11 events covering the core user journey — from discovery and browsing to login and content playback. Start reviewing user behavior in PostHog once events begin flowing:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [PostHog Events Explorer](https://us.posthog.com/project/2/events)
- [Create new dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

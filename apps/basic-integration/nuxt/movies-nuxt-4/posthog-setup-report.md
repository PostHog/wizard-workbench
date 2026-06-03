<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured, providing automatic client-side pageview capture, session replay, and Vue error tracking. A server-side PostHog Node client utility was created for API route tracking. Eleven custom events were instrumented across authentication, content discovery, and engagement flows, with user identification wired into the login flow.

**Files created:**
- `server/utils/posthog.ts` — Singleton PostHog Node.js client for server-side event capture

**Files modified:**
- `nuxt.config.ts` — Added `@posthog/nuxt` module, `posthogConfig`, and `runtimeConfig.public.posthog`
- `pages/login.vue` — User login tracking with `posthog.identify()` + error capture
- `components/NavBar.vue` — Logout tracking + `posthog.reset()`
- `pages/search.vue` — Search query tracking
- `pages/[type]/[id].vue` — Media detail view tracking
- `components/media/Hero.vue` — Trailer play tracking
- `components/video/Card.vue` — Video play tracking
- `components/photo/Modal.vue` — Photo gallery view tracking
- `components/media/Details.vue` — Tab switch tracking
- `pages/genre/[no]/movie.vue` — Genre browse tracking
- `server/api/auth/login.post.ts` — Server-side login tracking with session/distinct ID correlation

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logged in. Calls `posthog.identify()` with username. | `pages/login.vue` |
| `login_failed` | Login attempt failed. Includes error message. | `pages/login.vue` |
| `user_logged_out` | User clicked logout. Calls `posthog.reset()`. | `components/NavBar.vue` |
| `search_performed` | User performed a search query. Includes the query string. | `pages/search.vue` |
| `media_detail_viewed` | User viewed a movie or TV show detail page. Includes type, id, and title. | `pages/[type]/[id].vue` |
| `trailer_played` | User played the trailer from the hero section. Includes media id and title. | `components/media/Hero.vue` |
| `video_played` | User played a video clip from the Videos tab. Includes video name and type. | `components/video/Card.vue` |
| `photo_viewed` | User opened the photo gallery modal. Includes total photo count. | `components/photo/Modal.vue` |
| `media_tab_switched` | User switched between Overview, Videos, and Photos tabs. Includes tab name. | `components/media/Details.vue` |
| `genre_browsed` | User browsed a movie genre listing. Includes genre id and name. | `pages/genre/[no]/movie.vue` |
| `server_login` | Server-side login tracking with session/distinct ID correlation. | `server/api/auth/login.post.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these five insights to monitor user engagement:

1. **Login trends** — Trends chart for `user_logged_in` and `login_failed` over time. Helps track authentication health and funnel drop-offs.
   → [Create insight](/insights/new)

2. **Content engagement funnel** — Funnel from `media_detail_viewed` → `trailer_played` to measure how many users who view content go on to watch the trailer.
   → [Create funnel insight](/insights/new)

3. **Search to discovery funnel** — Funnel from `search_performed` → `media_detail_viewed` to measure search effectiveness.
   → [Create funnel insight](/insights/new)

4. **Engagement by content type** — Trends breakdown of `media_detail_viewed` broken down by `media_type` (movie vs TV) to see which content drives more views.
   → [Create insight](/insights/new)

5. **Video & trailer engagement** — Trends chart comparing `trailer_played` vs `video_played` over time to understand what media format resonates most.
   → [Create insight](/insights/new)

→ [Create a new dashboard](/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

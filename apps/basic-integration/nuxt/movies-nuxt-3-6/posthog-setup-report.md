<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Nuxt Movies app (Nuxt 3.5.3). This includes client-side analytics via `posthog-js`, server-side event tracking via `posthog-node`, user identification on login/logout, Vue error tracking, and 12 custom events across key user flows.

**Files created:**
- `plugins/posthog.client.ts` — PostHog plugin initializing the client-side SDK; also attaches a `vue:error` hook for automatic error capture
- `types/nuxt-app.d.ts` — TypeScript declaration extending `NuxtApp` with `$posthog`
- `.env` — PostHog token and host environment variables

**Files modified:**
- `nuxt.config.ts` — Added `runtimeConfig.public.posthog` with `publicKey`, `host`, and `posthogDefaults`
- `pages/login.vue` — `posthog.identify(username)` + `user_logged_in` capture on successful login
- `components/NavBar.vue` — `user_logged_out` capture + `posthog.reset()` on logout
- `components/media/Hero.vue` — `trailer_played` capture with media details when Play Trailer is clicked
- `components/video/Card.vue` — `video_played` capture with video metadata on card click
- `components/media/Details.vue` — `media_tab_changed` capture with tab name and media details on tab switch
- `pages/search.vue` — `search_performed` capture with query when debounced search fires
- `pages/[type]/[id].vue` — `media_detail_viewed` capture on mount (top of conversion funnel)
- `pages/person/[id].vue` — `person_detail_viewed` capture on mount
- `pages/[type]/category/[query].vue` — `category_browsed` capture on mount
- `pages/genre/[no]/movie.vue` — `genre_browsed` capture on mount (movie genre)
- `pages/genre/[no]/tv.vue` — `genre_browsed` capture on mount (TV genre)
- `server/api/auth/login.post.ts` — `server_login` event via `posthog-node` with session/distinct ID correlation headers
- `server/api/auth/logout.post.ts` — `server_logout` event via `posthog-node` with session/distinct ID correlation headers

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the app. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `trailer_played` | User clicks the Watch Trailer button on the media hero section. | `components/media/Hero.vue` |
| `video_played` | User clicks a video card to play a video clip. | `components/video/Card.vue` |
| `media_tab_changed` | User switches between the Overview, Videos, and Photos tabs on a media detail page. | `components/media/Details.vue` |
| `search_performed` | User types a search query and a debounced search is triggered. | `pages/search.vue` |
| `media_detail_viewed` | User views a specific movie or TV show detail page (top of conversion funnel). | `pages/[type]/[id].vue` |
| `person_detail_viewed` | User views an actor or person profile detail page. | `pages/person/[id].vue` |
| `server_login` | Server-side event captured when the login API processes a successful authentication. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event captured when the logout API processes a session termination. | `server/api/auth/logout.post.ts` |
| `category_browsed` | User browses a media category listing page. | `pages/[type]/category/[query].vue` |
| `genre_browsed` | User browses movies or TV shows filtered by genre. | `pages/genre/[no]/movie.vue`, `pages/genre/[no]/tv.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846824)
- **Daily logins**: [Daily logins (wizard)](https://us.posthog.com/project/483112/insights/38ycd458)
- **Conversion funnel**: [Login to media view funnel (wizard)](https://us.posthog.com/project/483112/insights/DZAgqlOF)
- **Content engagement**: [Content engagement trends (wizard)](https://us.posthog.com/project/483112/insights/sXbCSICh)
- **Media views by type**: [Media detail views by type (wizard)](https://us.posthog.com/project/483112/insights/pEQQEYJO)
- **User retention**: [User retention (wizard)](https://us.posthog.com/project/483112/insights/th1Q8MrA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `posthog.identify(user)` in `app.vue` when the user cookie is already set (returning visitor).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

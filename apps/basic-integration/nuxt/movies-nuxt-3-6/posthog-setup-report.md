# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The following changes were made:

- Installed `posthog-js` (client-side) and `posthog-node` (server-side) packages
- Created `plugins/posthog.client.ts` — initialises PostHog from runtime config, hooks into `vue:error` for automatic exception capture, and exposes `$posthog` via Nuxt's provide mechanism
- Created `types/nuxt-app.d.ts` — TypeScript declaration for `$posthog` on `NuxtApp`
- Updated `nuxt.config.ts` to expose `posthog.publicKey`, `posthog.host`, and `posthog.posthogDefaults` under `runtimeConfig.public`
- Added `.env` with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`
- Added `posthog.identify()` + `capture('user_logged_in')` on successful login (`pages/login.vue`)
- Added `capture('user_logged_out')` + `posthog.reset()` on logout (`components/NavBar.vue`)
- Added server-side `capture('server_login')` with session/distinct-ID correlation via `x-posthog-session-id` / `x-posthog-distinct-id` headers (`server/api/auth/login.post.ts`)
- Added event captures across content discovery: search, media detail pages, trailers, videos, tabs, person pages, and category browsing

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fires on the client side when a user successfully logs in. | `pages/login.vue` |
| `user_logged_out` | Fires when the user clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `search_performed` | Fires when the user executes a debounced search query. | `pages/search.vue` |
| `media_viewed` | Fires when a user navigates to a movie or TV show detail page. | `pages/[type]/[id].vue` |
| `trailer_played` | Fires when the user clicks the 'Watch Trailer' button on a media hero. | `components/media/Hero.vue` |
| `media_tab_changed` | Fires when the user switches between the Overview, Videos, and Photos tabs on a media detail page. | `components/media/Details.vue` |
| `video_played` | Fires when the user clicks a video card to play a clip or featurette. | `components/video/Card.vue` |
| `person_viewed` | Fires when the user navigates to an actor or crew member's detail page. | `pages/person/[id].vue` |
| `category_browsed` | Fires when the user opens a specific media category listing page. | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side event that fires on the login API route to correlate with client-side session. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818222)
- [Login funnel (wizard)](https://us.posthog.com/project/483112/insights/OPoaqGHQ) — Funnel from login → media viewed
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/w05GluYD) — DAU based on logins
- [Content engagement trends (wizard)](https://us.posthog.com/project/483112/insights/wSV8cXGw) — Media views, trailer plays, video plays over time
- [Search usage trend (wizard)](https://us.posthog.com/project/483112/insights/tpjlB4ZL) — Daily search volume
- [Media detail tab engagement (wizard)](https://us.posthog.com/project/483112/insights/0aeUq8He) — Tab switches broken down by tab name

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NUXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

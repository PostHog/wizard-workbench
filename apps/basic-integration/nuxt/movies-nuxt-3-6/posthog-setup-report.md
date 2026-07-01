<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The following changes were made:

- **`plugins/posthog.client.ts`** (new) — Client-side PostHog plugin that initializes `posthog-js`, enables debug mode in development, hooks Vue error capture via `captureException`, and provides `$posthog` to all components.
- **`types/nuxt-app.d.ts`** (new) — TypeScript declaration extending `NuxtApp` with `$posthog: PostHog`.
- **`nuxt.config.ts`** — Added `runtimeConfig.public.posthog` with `publicKey`, `host`, and `posthogDefaults` reading from environment variables.
- **`.env`** (new) — Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- **`pages/login.vue`** — On successful login: calls `posthog.identify(username)` and captures `user_logged_in`. On login error: calls `captureException`.
- **`components/NavBar.vue`** — Logout handler now captures `user_logged_out` and calls `posthog.reset()` before clearing session.
- **`server/api/auth/login.post.ts`** — Server-side PostHog Node client captures `server_login` with session correlation via `x-posthog-session-id` / `x-posthog-distinct-id` headers.
- **`pages/search.vue`** — Captures `search_performed` with the query string each time a new search is triggered.
- **`pages/[type]/[id].vue`** — Captures `media_detail_viewed` with `media_id`, `media_type`, and `media_title` on mount.
- **`components/media/Hero.vue`** — Captures `trailer_played` with `media_id` and `media_title` when the trailer button is clicked.
- **`components/video/Card.vue`** — Captures `video_played` with `video_key`, `video_name`, and `video_type` when a video is played.
- **`components/media/Details.vue`** — Captures `media_tab_changed` with the selected tab name when switching between Overview, Videos, and Photos.
- **`pages/person/[id].vue`** — Captures `person_viewed` with `person_id` and `person_name` on mount.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on the client when a user successfully completes login. | `pages/login.vue` |
| `user_logged_out` | Fired when the user clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `server_login` | Server-side event fired when a login request is processed successfully. | `server/api/auth/login.post.ts` |
| `search_performed` | Fired when the user submits a search query. | `pages/search.vue` |
| `media_detail_viewed` | Fired when a user views a movie or TV show detail page. | `pages/[type]/[id].vue` |
| `trailer_played` | Fired when the user clicks the play trailer button on a media hero section. | `components/media/Hero.vue` |
| `video_played` | Fired when the user plays a video from the videos grid. | `components/video/Card.vue` |
| `media_tab_changed` | Fired when the user switches between Overview, Videos, and Photos tabs on a detail page. | `components/media/Details.vue` |
| `person_viewed` | Fired when a user views a person's profile page. | `pages/person/[id].vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787439)
- [Login Conversion Funnel](https://us.posthog.com/project/483112/insights/9743656) — Funnel from `user_logged_in` → `media_detail_viewed`
- [Search Activity](https://us.posthog.com/project/483112/insights/9743661) — `search_performed` trends over time
- [Content Engagement](https://us.posthog.com/project/483112/insights/9743662) — `trailer_played` + `video_played` trends
- [Media Browsing](https://us.posthog.com/project/483112/insights/9743663) — `media_detail_viewed` broken down by `media_type`
- [User Retention](https://us.posthog.com/project/483112/insights/9743664) — `user_logged_out` trends

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

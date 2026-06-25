<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. The integration includes client-side tracking via `posthog-js`, server-side tracking via `posthog-node`, user identification on login, PostHog reset on logout, error tracking via Vue error hooks and an error boundary in `app.vue`, and cross-session correlation using `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers.

New files created:
- `plugins/posthog.client.ts` — initialises PostHog on the client, provides `$posthog` to the app, and wires the `vue:error` hook for automatic error capture
- `types/nuxt-app.d.ts` — TypeScript declaration extending `NuxtApp` with the `$posthog` property

Existing files modified:
- `nuxt.config.ts` — added `runtimeConfig.public.posthog` with `publicKey`, `host`, and `posthogDefaults`
- `pages/login.vue` — identifies the user and captures `user_logged_in` on successful login; captures exceptions on failure
- `components/NavBar.vue` — captures `user_logged_out` and calls `posthog.reset()` before logout
- `server/api/auth/login.post.ts` — captures `server_login` using `posthog-node` with session/distinct-ID correlation
- `server/api/auth/logout.post.ts` — captures `server_logout` using `posthog-node` with session/distinct-ID correlation
- `pages/[type]/[id].vue` — captures `media_detail_viewed` on mount with `media_type`, `media_id`, and `media_title`
- `components/media/Hero.vue` — captures `trailer_played` when the trailer button is clicked
- `components/video/Card.vue` — captures `video_played` when a video card is clicked
- `pages/search.vue` — captures `search_performed` with the search query on each debounced search
- `components/media/Details.vue` — captures `media_tab_changed` with the selected tab when the user switches tabs
- `pages/person/[id].vue` — captures `person_detail_viewed` on mount with `person_id` and `person_name`
- `app.vue` — added `onErrorCaptured` error boundary to capture component errors

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in with their credentials. | `pages/login.vue` |
| `user_logged_out` | User logs out from the application via the navbar. | `components/NavBar.vue` |
| `server_login` | Server-side capture of a successful login event. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side capture of a logout event. | `server/api/auth/logout.post.ts` |
| `media_detail_viewed` | User views the detail page for a movie or TV show. | `pages/[type]/[id].vue` |
| `trailer_played` | User clicks to play the trailer on the media hero section. | `components/media/Hero.vue` |
| `video_played` | User clicks to play a video from the media videos tab. | `components/video/Card.vue` |
| `search_performed` | User performs a search query for movies or TV shows. | `pages/search.vue` |
| `media_tab_changed` | User switches between Overview, Videos, and Photos tabs on a media detail page. | `components/media/Details.vue` |
| `person_detail_viewed` | User views the detail page for a person (actor, director, etc.). | `pages/person/[id].vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1760658)
- [Media Detail to Trailer Funnel](https://us.posthog.com/project/483112/insights/9TVNykTO)
- [User Logins Over Time](https://us.posthog.com/project/483112/insights/z8epHr0Q)
- [Search Performed Over Time](https://us.posthog.com/project/483112/insights/C1ZZOXHj)
- [Video Plays Over Time](https://us.posthog.com/project/483112/insights/VyaZduBo)
- [Media Tab Changes Over Time](https://us.posthog.com/project/483112/insights/MqFKrDr9)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NUXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

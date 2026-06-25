<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 4 movies application. The `@posthog/nuxt` module was installed and configured in `nuxt.config.ts`, providing automatic client-side and server-side error tracking. A shared `server/utils/posthog.ts` utility supplies a singleton PostHog Node client for all server-side event capture. Environment variables were written to `.env` and are referenced throughout the config. Twelve events across ten files capture the full user journey — from login and content discovery through video playback and logout — with client-side user identification on login and correlated server-side session tracking via `x-posthog-session-id` / `x-posthog-distinct-id` headers.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully completes the login form and is authenticated. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `search_performed` | User submits a search query and results are fetched. | `pages/search.vue` |
| `media_viewed` | User opens a movie or TV show detail page, entering the content engagement funnel. | `pages/[type]/[id].vue` |
| `video_played` | User clicks to play a video trailer or clip from a media detail page. | `components/video/Card.vue` |
| `media_tab_switched` | User switches between the Overview, Videos, or Photos tabs on a media detail page. | `components/media/Details.vue` |
| `person_viewed` | User opens an actor or director profile page. | `pages/person/[id].vue` |
| `genre_browsed` | User browses movies or TV shows filtered by a specific genre. | `pages/genre/[no]/movie.vue`, `pages/genre/[no]/tv.vue` |
| `category_browsed` | User browses a curated category list such as trending or top-rated content. | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side capture of a successful login event with session context. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side capture of a logout event. | `server/api/auth/logout.post.ts` |
| `error_page_viewed` | User encounters an application error page, capturing the status code and message. | `error.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1760690)
- [Login funnel](https://us.posthog.com/project/483112/insights/hqLSxnG2) — Conversion: login → media viewed → video played
- [Daily active users](https://us.posthog.com/project/483112/insights/kEvLvfsa) — Unique users per day over 30 days
- [Top searches](https://us.posthog.com/project/483112/insights/c7psBUAD) — Search volume trend
- [Content engagement](https://us.posthog.com/project/483112/insights/QX3NRuw9) — media_viewed, video_played, media_tab_switched trends
- [Churn signal: logouts](https://us.posthog.com/project/483112/insights/fNc1tDxta) — Logout events over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

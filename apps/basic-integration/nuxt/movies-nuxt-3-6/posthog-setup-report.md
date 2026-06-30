# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.6 movies app. The following changes were made:

- **Installed** `posthog-js` (client-side) and `posthog-node` (server-side) packages.
- **Created** `plugins/posthog.client.ts` — initialises PostHog on the client, provides `$posthog` to all components, and hooks into Vue's `vue:error` for automatic exception capture.
- **Created** `types/nuxt-app.d.ts` — TypeScript declarations so `$posthog` is typed across the app.
- **Updated** `nuxt.config.ts` — added `runtimeConfig.public.posthog` with `publicKey`, `host`, and `posthogDefaults` read from environment variables.
- **Set** environment variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env`.
- **Added** client-side event tracking to seven files (login, logout, media detail, trailer, video, search, tab change, person view, genre browse).
- **Added** server-side tracking to `server/api/auth/login.post.ts` using `posthog-node`, correlating client and server sessions via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.
- **Added** `posthog.identify()` in the login flow so user actions are tied to a persistent identity.
- **Added** `posthog.reset()` on logout to clear the PostHog identity.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button | `components/NavBar.vue` |
| `server_login` | Server-side successful login | `server/api/auth/login.post.ts` |
| `media_viewed` | User opens a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User plays the trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User plays a video from the Videos tab | `components/video/Card.vue` |
| `search_performed` | User submits a search query | `pages/search.vue` |
| `media_tab_changed` | User switches between Overview / Videos / Photos tabs | `components/media/Details.vue` |
| `person_viewed` | User opens a cast or crew member profile page | `pages/person/[id].vue` |
| `genre_browsed` | User browses movies by a specific genre | `pages/genre/[no]/movie.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1777454)
- [Login funnel: media viewed → trailer played](https://us.posthog.com/project/483112/insights/9685584)
- [Unique users who logged in over time](https://us.posthog.com/project/483112/insights/9685586)
- [Most popular media type viewed](https://us.posthog.com/project/483112/insights/9685591)
- [Search activity over time](https://us.posthog.com/project/483112/insights/9685595)
- [User churn: logout trend](https://us.posthog.com/project/483112/insights/9685596)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

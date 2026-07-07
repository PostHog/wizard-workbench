# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies app. A client-side plugin (`plugins/posthog.client.ts`) initializes PostHog with the project token and host from environment variables, hooks into Vue's error lifecycle for automatic exception capture, and provides `$posthog` to all components via `useNuxtApp()`. TypeScript declarations were added in `types/nuxt-app.d.ts`. The `nuxt.config.ts` was updated to expose the PostHog config under `runtimeConfig.public.posthog`. Server-side login tracking uses `posthog-node` to correlate client sessions with server events via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates and logs into the app. | `pages/login.vue` |
| `user_logged_out` | User logs out of the app. | `components/NavBar.vue` |
| `media_viewed` | User views the detail page of a movie or TV show. | `pages/[type]/[id].vue` |
| `media_searched` | User performs a search for movies or TV shows. | `pages/search.vue` |
| `trailer_played` | User clicks to play the trailer from the media hero section. | `components/media/Hero.vue` |
| `video_played` | User clicks to play a video from the media videos tab. | `components/video/Card.vue` |
| `media_tab_changed` | User switches between the Overview, Videos, and Photos tabs on a media detail page. | `components/media/Details.vue` |
| `person_viewed` | User views the profile page of an actor or crew member. | `pages/person/[id].vue` |
| `login_completed` | Server-side: login API successfully authenticates the user and sets the session cookie. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813043)
- [Daily user logins](https://us.posthog.com/project/483112/insights/LhdqFeqi)
- [Login to content view funnel](https://us.posthog.com/project/483112/insights/sn0Odvh3)
- [Media views by type](https://us.posthog.com/project/483112/insights/6q4Cyne4)
- [Search activity](https://us.posthog.com/project/483112/insights/HHOlbMeN)
- [Content engagement: trailers vs videos](https://us.posthog.com/project/483112/insights/9n5sxNxn)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called on fresh login only; returning users with an existing `auth-user` cookie will remain on anonymous distinct IDs until they log in again. Consider calling `identify` in `app.vue` or a middleware when `isAuthenticated` is true on load.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

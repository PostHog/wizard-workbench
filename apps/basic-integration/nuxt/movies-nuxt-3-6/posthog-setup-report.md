<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 3.6 movies application. A client-side PostHog plugin (`plugins/posthog.client.ts`) was created using `posthog-js`, wired into the Nuxt plugin system, and configured with environment variables for the project token and host. Server-side event tracking was added to the login API route using `posthog-node`, including session/distinct ID correlation via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. User identification via `posthog.identify()` is called at login. Error tracking is set up via the `vue:error` hook in the plugin and `onErrorCaptured` in `app.vue`. TypeScript types for `$posthog` were added in `types/nuxt-app.d.ts`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with their credentials. | `pages/login.vue` |
| `login_failed` | User login attempt results in an error. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button to end their session. | `components/NavBar.vue` |
| `media_searched` | User submits a search query for movies or TV shows. | `pages/search.vue` |
| `media_details_viewed` | User views the detail page for a movie or TV show. | `pages/[type]/[id].vue` |
| `media_tab_changed` | User switches between Overview, Videos, and Photos tabs on a media detail page. | `components/media/Details.vue` |
| `video_played` | User clicks to play a video trailer or clip. | `components/video/Card.vue` |
| `person_profile_viewed` | User views the profile page of an actor or director. | `pages/person/[id].vue` |
| `photo_modal_opened` | User opens a photo in the full-screen modal viewer. | `components/photo/Modal.vue` |
| `server_user_logged_in` | Server-side event capturing user login with session context. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1775127)
- [Login conversion funnel](https://us.i.posthog.com/project/483112/insights/eyvLBBOn)
- [Daily active searches](https://us.i.posthog.com/project/483112/insights/W5kesWDm)
- [Video plays by type](https://us.i.posthog.com/project/483112/insights/nek9cQlo)
- [Login failures](https://us.i.posthog.com/project/483112/insights/W1ygCaJS)
- [Content engagement breakdown](https://us.i.posthog.com/project/483112/insights/LzNB8OmE)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to the Nuxt app with the `@posthog/nuxt` module and `posthog-node` for server-side capture, environment variables were wired through Nuxt runtime config, returning authenticated sessions now call `identify`, logout resets the client identity, and targeted product analytics plus error capture were added across login, search, media engagement, gallery navigation, error display, auth API routes, and the TMDB proxy failure path.

| Event | Description | File |
| --- | --- | --- |
| `login_submitted` | Captures successful login attempts from the client-side login form. | `pages/login.vue` |
| `search_executed` | Captures when an authenticated user executes a media search. | `pages/search.vue` |
| `hero_media_opened` | Captures when a user opens featured media from a landing page hero. | `pages/index.vue` |
| `media_details_viewed` | Captures when a user views a movie or TV detail page. | `pages/[type]/[id].vue` |
| `media_card_selected` | Captures when a user opens a media item from a card grid or carousel. | `components/media/Card.vue` |
| `trailer_played` | Captures when a user starts a trailer or video clip. | `components/video/Card.vue` |
| `person_profile_opened` | Captures when a user opens a cast or crew profile. | `components/person/Card.vue` |
| `photo_gallery_navigated` | Captures when a user navigates between photos in the modal gallery. | `components/photo/Modal.vue` |
| `server_login_succeeded` | Captures successful login completion in the auth API route. | `server/api/auth/login.post.ts` |
| `server_logout_completed` | Captures logout completion in the auth API route. | `server/api/auth/logout.post.ts` |
| `tmdb_proxy_failed` | Captures TMDB proxy request failures on the server. | `proxy/routes/tmdb/[...path].ts` |
| `app_error_displayed` | Captures when the Nuxt error page is shown to a user. | `error.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831065)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/nk8qWJwb)
- [Searches over time (wizard)](https://us.posthog.com/project/483112/insights/3KSLDNzH)
- [Media engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/60RztpFE)
- [Hero media opens over time (wizard)](https://us.posthog.com/project/483112/insights/KYS3TgtF)
- [Media card selections over time (wizard)](https://us.posthog.com/project/483112/insights/I51Yj8le)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

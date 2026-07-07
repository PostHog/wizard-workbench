# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured in `nuxt.config.ts` with automatic client-side exception capture (`capture_exceptions: true`) and server-side exception capture (`enableExceptionAutocapture: true`). A server-side PostHog Node singleton (`server/utils/posthog.ts`) was added to handle API route tracking. Environment variables were written to `.env`. Ten events are now tracked across ten files, covering the full user journey from login through content discovery and media engagement.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client side when a user successfully logs in. | `pages/login.vue` |
| `user_logged_out` | Fired on the client side when a user logs out, followed by a PostHog reset. | `composables/useAuth.ts` |
| `search_performed` | Fired when a user submits a search query on the search page. | `pages/search.vue` |
| `media_viewed` | Fired when a user opens a movie or TV show detail page (top of the engagement funnel). | `pages/[type]/[id].vue` |
| `video_played` | Fired when a user clicks the play button on a video card. | `components/video/Card.vue` |
| `media_tab_switched` | Fired when a user switches between the Overview, Videos, or Photos tabs on a media detail page. | `components/media/Details.vue` |
| `person_viewed` | Fired when a user opens a person/actor detail page. | `pages/person/[id].vue` |
| `genre_browsed` | Fired when a user browses a movie genre listing page. | `pages/genre/[no]/movie.vue` |
| `language_changed` | Fired when a user changes the interface language via the language switcher. | `components/LanguageSwitcher.vue` |
| `server_login` | Server-side event captured when the login API handler processes a successful authentication. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1813045)
- [Login to engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/BIf1LDOt)
- [Daily logins (wizard)](https://us.posthog.com/project/483112/insights/oA4WVeza)
- [Search volume trend (wizard)](https://us.posthog.com/project/483112/insights/XV4K5Exw)
- [Video plays by type (wizard)](https://us.posthog.com/project/483112/insights/qzTLiSJa)
- [Genre browsing trend (wizard)](https://us.posthog.com/project/483112/insights/OOjt7Enh)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

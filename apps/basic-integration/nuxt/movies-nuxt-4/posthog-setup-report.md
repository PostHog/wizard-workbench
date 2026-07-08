# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies 4 application. The `@posthog/nuxt` module was installed and configured, providing automatic client-side and server-side error tracking, session replay, and user identification. Ten events were instrumented across eight files, covering the full user journey from login through content discovery, search, and video playback.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with their username and password. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. | `components/NavBar.vue` |
| `video_played` | User clicks play on a movie or TV show trailer video. | `components/video/Card.vue` |
| `search_performed` | User submits a search query in the search page. | `pages/search.vue` |
| `media_tab_changed` | User switches between the overview, videos, or photos tabs on a media detail page. | `components/media/Details.vue` |
| `movie_details_viewed` | User views the detail page of a specific movie or TV show. | `pages/[type]/[id].vue` |
| `person_details_viewed` | User views a person's profile page, representing interest in an actor or director. | `pages/person/[id].vue` |
| `language_changed` | User switches the app language using the language switcher. | `components/LanguageSwitcher.vue` |
| `server_user_logged_in` | Server-side event captured when a user successfully authenticates via the login API. | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side event captured when a user's session is invalidated via the logout API. | `server/api/auth/logout.post.ts` |

`posthog.identify()` is called on login with the username as the distinct ID, and `posthog.reset()` is called on logout. The `@posthog/nuxt` module automatically correlates client and server events via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (configured via `__add_tracing_headers`). Client-side Vue exceptions and server-side Nitro exceptions are captured automatically.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818224)
- [Login funnel (wizard)](https://us.posthog.com/project/483112/insights/CrjhTA4m)
- [User logins over time (wizard)](https://us.posthog.com/project/483112/insights/4lTJteGM)
- [Search queries over time (wizard)](https://us.posthog.com/project/483112/insights/Hwkysvkp)
- [Video plays over time (wizard)](https://us.posthog.com/project/483112/insights/kEctYizb)
- [Content engagement breakdown (wizard)](https://us.posthog.com/project/483112/insights/humnxIqF)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the `sourcemaps` option in `posthogConfig`) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `posthog?.identify(user.value)` in `app.vue` when a session is already present on mount.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

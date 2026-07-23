# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 4 application. The `@posthog/nuxt` module was installed and configured in `nuxt.config.ts` with both client-side (`capture_exceptions: true`) and server-side (`enableExceptionAutocapture: true`) settings. Environment variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` are read at runtime for flexible deployment. Seven client-side events are captured using `usePostHog()`, two server-side events are captured via `useServerPostHog()` (with `posthog.flush()` called after each to avoid dropped events in short-lived Nuxt server handlers), and user identity is established on login via `posthog.identify()` and cleared on logout via `posthog.reset()`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticates and logs into the application | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button and ends their session | `components/NavBar.vue` |
| `content_searched` | User submits a search query to find movies or TV shows | `pages/search.vue` |
| `media_viewed` | User navigates to a movie or TV show detail page | `pages/[type]/[id].vue` |
| `person_viewed` | User navigates to a person (actor/director) detail page | `pages/person/[id].vue` |
| `genre_browsed` | User browses movies or TV shows filtered by a specific genre | `pages/genre/[no]/movie.vue` |
| `category_browsed` | User browses a specific category list such as popular or top-rated | `pages/[type]/category/[query].vue` |
| `server_user_logged_in` | Server-side event captured when a user login request is processed | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side event captured when a user logout request is processed | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1897383)
- [Login funnel (wizard)](https://us.posthog.com/project/483112/insights/nuel9i1i)
- [Daily logins (wizard)](https://us.posthog.com/project/483112/insights/2sYKpiS0)
- [Media views by type (wizard)](https://us.posthog.com/project/483112/insights/irtYZZRi)
- [Top user actions (wizard)](https://us.posthog.com/project/483112/insights/atjlVSS1)
- [Login failures (wizard)](https://us.posthog.com/project/483112/insights/FNnUYv5e)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

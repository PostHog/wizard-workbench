<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies 4 application. The `@posthog/nuxt` module was installed and configured with client-side exception capture (`capture_exceptions: true`), server-side exception autocapture (`enableExceptionAutocapture: true`), and automatic tracing headers for client-server correlation. A server-side PostHog utility (`server/utils/posthog.ts`) was created to share a single PostHog Node client across all server requests. Nine events were instrumented across seven files, covering the full user journey from login through content discovery and logout — on both the client and server side. User identification is performed on successful login; `posthog.reset()` is called on logout to clear the session.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates and logs into the app | `pages/login.vue` |
| `login_failed` | A login attempt fails due to an error | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button and ends their session | `components/NavBar.vue` |
| `search_performed` | User submits a search query to find movies or TV shows | `pages/search.vue` |
| `media_viewed` | User opens the detail page for a movie or TV show | `pages/[type]/[id].vue` |
| `media_tab_changed` | User switches between Overview, Videos, or Photos tabs | `components/media/Details.vue` |
| `genre_browsed` | User browses movies filtered by a specific genre | `pages/genre/[no]/movie.vue` |
| `server_user_logged_in` | Server-side login event with session context | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side logout event with session context | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793501)
- [Logins over time](https://us.posthog.com/project/483112/insights/igRVLeRr)
- [Login to media view funnel](https://us.posthog.com/project/483112/insights/Psta88uF)
- [Searches performed](https://us.posthog.com/project/483112/insights/qskFywKb)
- [Login failures vs successes](https://us.posthog.com/project/483112/insights/L59uGHyC)
- [User logouts (churn signal)](https://us.posthog.com/project/483112/insights/TJrWyo5L)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (see `posthogConfig.sourcemaps` in `nuxt.config.ts`).
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login; returning sessions that resume via cookie will be on anonymous distinct IDs until the user logs in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

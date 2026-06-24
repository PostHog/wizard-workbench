# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 movies app. The `@posthog/nuxt` module was installed and configured with client-side error tracking (`capture_exceptions: true`), server-side error tracking (`enableExceptionAutocapture: true`), and automatic session/distinct ID header propagation (`__add_tracing_headers`). A shared server-side PostHog Node client utility was created, and nine events were instrumented across login, logout, media browsing, search, and category pages. Users are identified by username on successful login using `posthog.identify()`, and identity is reset on logout with `posthog.reset()`. The `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers are automatically forwarded to server API routes so client and server events stay correlated.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in with their username and password. | `pages/login.vue` |
| `login_failed` | User login attempt failed due to an error. | `pages/login.vue` |
| `user_logged_out` | User clicks logout button to end their session. | `components/NavBar.vue` |
| `media_viewed` | User opens the detail page for a specific movie or TV show. | `pages/[type]/[id].vue` |
| `media_tab_changed` | User switches between Overview, Videos, or Photos tabs on a media detail page. | `components/media/Details.vue` |
| `search_performed` | User performs a search query for movies or TV shows. | `pages/search.vue` |
| `media_category_viewed` | User browses a specific media category listing (e.g. trending, top rated). | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side event capturing a user login request with session context. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event capturing a user logout request. | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Your starter dashboard](https://us.i.posthog.com/project/483112/dashboard/1751155)
- [User Logins Over Time](https://us.i.posthog.com/project/483112/insights/asi0JEoh)
- [Login vs Logout Funnel](https://us.i.posthog.com/project/483112/insights/ELnr8ZmS)
- [Top Searched Terms](https://us.i.posthog.com/project/483112/insights/Bm5DgZnF)
- [Most Viewed Media](https://us.i.posthog.com/project/483112/insights/QblVG6nR)
- [Media Tab Engagement](https://us.i.posthog.com/project/483112/insights/nznje94H)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (`posthogConfig.sourcemaps` is pre-wired in `nuxt.config.ts` — set `PROJECT_ID` and `PERSONAL_API_KEY` env vars).
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login, which can leave returning sessions on anonymous distinct IDs until the user logs in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

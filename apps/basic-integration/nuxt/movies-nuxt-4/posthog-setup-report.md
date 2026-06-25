# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app. The `@posthog/nuxt` module was installed and configured, enabling automatic client-side error tracking (Vue exceptions), automatic server-side error tracking (Nitro), and the `usePostHog()` composable throughout the app. A singleton server-side PostHog Node client was added via `server/utils/posthog.ts`. Client–server session correlation is wired through `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers using the `__add_tracing_headers` option. Users are identified on login via `posthog.identify()`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired on the client when a user successfully completes the login form. | `pages/login.vue` |
| `login_failed` | Fired on the client when a login attempt fails. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when the user clicks the logout button in the nav. | `components/NavBar.vue` |
| `media_viewed` | Fired on the client when a user opens a movie or TV show detail page. | `pages/[type]/[id].vue` |
| `search_performed` | Fired on the client when a debounced search query is submitted. | `pages/search.vue` |
| `person_viewed` | Fired on the client when a user opens a person's detail page. | `pages/person/[id].vue` |
| `media_category_viewed` | Fired on the client when the user navigates to a specific media category listing. | `pages/[type]/category/[query].vue` |
| `server_user_logged_in` | Fired on the server when the login API route successfully authenticates a user. | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Fired on the server when the logout API route is called. | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior:

- [Analytics basics (wizard) — dashboard](https://us.posthog.com/project/483112/dashboards/1761216)
- [Media views trend](https://us.posthog.com/project/483112/insights/LAw6zcZH)
- [Daily user logins](https://us.posthog.com/project/483112/insights/FxkUyfzh)
- [Search activity](https://us.posthog.com/project/483112/insights/5U5GyQEy)
- [Login failures](https://us.posthog.com/project/483112/insights/5R9XvRS7)
- [User engagement overview](https://us.posthog.com/project/483112/insights/uwrLzqBg)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (configure `sourcemaps` in `posthogConfig` in `nuxt.config.ts` with your `PROJECT_ID` and `PERSONAL_API_KEY`).
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login; returning users restored from the cookie session are not re-identified on each visit.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

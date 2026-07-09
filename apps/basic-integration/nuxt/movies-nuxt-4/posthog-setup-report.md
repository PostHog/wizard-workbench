<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking enabled. A server-side PostHog utility was created to share a singleton `posthog-node` client across all API routes. User identification is called on login, and `posthog.reset()` is called on logout. Client-side events cover the key content-browsing actions; server-side events track authentication with session correlation headers.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully logs in via the login form | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks the logout button | `components/NavBar.vue` |
| `media_viewed` | Fired when a user navigates to a movie or TV show detail page | `pages/[type]/[id].vue` |
| `media_tab_changed` | Fired when a user switches between Overview, Videos, or Photos tabs | `components/media/Details.vue` |
| `search_performed` | Fired when a user submits a debounced search query | `pages/search.vue` |
| `category_browsed` | Fired when a user browses a category listing page | `pages/[type]/category/[query].vue` |
| `person_viewed` | Fired when a user navigates to a person (actor/director) detail page | `pages/person/[id].vue` |
| `server_login` | Server-side event fired on successful authentication | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event fired when the logout API route is called | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824559)
- **Login funnel**: [Login → Media View funnel](https://us.posthog.com/project/483112/insights/c1myhVlj)
- **Daily active users**: [DAU trend](https://us.posthog.com/project/483112/insights/vfGMr5t8)
- **Top searched queries**: [Search query breakdown](https://us.posthog.com/project/483112/insights/NfXpwwIu)
- **Media views by type**: [Movie vs TV breakdown](https://us.posthog.com/project/483112/insights/z8s8lShc)
- **User retention after login**: [Retention cohort](https://us.posthog.com/project/483112/insights/L1zBxKhe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify (run `posthog-cli sourcemap` or configure `posthogConfig.sourcemaps` in `nuxt.config.ts`).
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on login. If a user already has a session cookie when they refresh the page, add an `identify` call in `app.vue` or a global middleware using the `auth-user` cookie value so returning sessions are linked to the correct person.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

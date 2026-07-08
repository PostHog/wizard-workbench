<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Nuxt Movies app. The integration adds client-side analytics via `posthog-js` (initialized in a Nuxt client plugin), server-side analytics via `posthog-node` on the login API route, user identification on login, session reset on logout, and error capture via the `vue:error` hook. All PostHog configuration is driven by environment variables.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired on the client when a user successfully logs in. | `pages/login.vue` |
| `user_logged_out` | Fired on the client when a user clicks the logout button. | `components/NavBar.vue` |
| `media_searched` | Fired on the client when a user submits a search query. | `pages/search.vue` |
| `media_detail_viewed` | Fired on the client when a user views a movie or TV show detail page. | `pages/[type]/[id].vue` |
| `person_detail_viewed` | Fired on the client when a user views a person's profile page. | `pages/person/[id].vue` |
| `server_login` | Fired on the server when a login request is successfully processed. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818165)
- [Daily logins](https://us.posthog.com/project/483112/insights/COcpvOVi)
- [Login to media view funnel](https://us.posthog.com/project/483112/insights/x0s5CCRP)
- [Daily media searches](https://us.posthog.com/project/483112/insights/g4SLm9gi)
- [Media views by type](https://us.posthog.com/project/483112/insights/SFfwxJoH)
- [User retention after login](https://us.posthog.com/project/483112/insights/5zWj3lHD)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called only on fresh login; a returning user whose session restores from cookie won't be identified until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The integration includes client-side product analytics and session replay via `posthog-js`, server-side event tracking via `posthog-node`, user identification on login, and error tracking using the `vue:error` hook and `onErrorCaptured`. A PostHog plugin was created at `plugins/posthog.client.ts` and exposed throughout the app as `$posthog`. Environment variables are used throughout — no tokens are hardcoded. The Nuxt runtime config was extended to hold the PostHog public key and host, and a TypeScript declaration file was added so components get full type support for `$posthog`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and logged into Nuxt Movies. | `pages/login.vue` |
| `user_logged_out` | User clicked the logout button from the navigation bar. | `components/NavBar.vue` |
| `movie_searched` | User performed a search query for movies or TV shows. | `pages/search.vue` |
| `media_detail_viewed` | User opened a movie or TV show detail page to view its full info. | `pages/[type]/[id].vue` |
| `person_viewed` | User viewed the profile page of a cast or crew member. | `pages/person/[id].vue` |
| `category_browsed` | User navigated into a specific media category listing. | `pages/[type]/category/[query].vue` |
| `server_user_logged_in` | Server recorded a successful login request for the user. | `server/api/auth/login.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1792525)
- [User logins over time](https://us.i.posthog.com/project/483112/insights/rZ2fyBHq)
- [Login to content engagement funnel](https://us.i.posthog.com/project/483112/insights/pdoC76dB)
- [Search activity over time](https://us.i.posthog.com/project/483112/insights/r9MyxjnO)
- [Logins vs. logouts](https://us.i.posthog.com/project/483112/insights/3W4jPvcW)
- [Media detail views by type](https://us.i.posthog.com/project/483112/insights/c42NQg4D)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identification happens only on fresh login; returning users authenticated via cookie will be on anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

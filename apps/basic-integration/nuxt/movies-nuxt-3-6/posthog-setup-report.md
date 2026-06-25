<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies 3.6 application. Changes include:

- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public` with `publicKey`, `host`, and `posthogDefaults`, reading from environment variables.
- **`plugins/posthog.client.ts`** (new) — Client-side PostHog plugin that initialises `posthog-js`, attaches a `vue:error` hook for automatic exception capture, and exposes `$posthog` via Nuxt's provide system.
- **`types/nuxt-app.d.ts`** (new) — TypeScript declaration extending `NuxtApp` with `$posthog: PostHog` for full type safety.
- **`pages/login.vue`** — On successful login, calls `posthog.identify()` with the username and captures `user_logged_in`.
- **`components/NavBar.vue`** — Logout button now calls `posthog.capture('user_logged_out')` and `posthog.reset()` before signing out.
- **`pages/search.vue`** — Captures `search_performed` (with the query string) each time the user triggers a search.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` (with media type, ID, and title) when a movie or TV detail page loads.
- **`components/video/Card.vue`** — Captures `video_played` (with video name, type, and key) when the user clicks play on a trailer.
- **`components/media/Details.vue`** — Captures `media_tab_changed` (with the tab name, media type, ID, and title) when the user switches between Overview / Videos / Photos.
- **`pages/person/[id].vue`** — Captures `person_viewed` (with person ID and name) when a person's detail page loads.
- **`pages/[type]/category/[query].vue`** — Captures `media_category_viewed` (with category and media type) when a category listing page loads.
- **`server/api/auth/login.post.ts`** — Server-side `server_login` event using `posthog-node`, correlated to the client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers.
- **`server/api/auth/logout.post.ts`** — Server-side `server_logout` event using `posthog-node`, correlated to the client session in the same way.
- **`.env`** — Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully submitted the login form and was authenticated. | `pages/login.vue` |
| `user_logged_out` | User clicked the logout button in the navigation bar. | `components/NavBar.vue` |
| `search_performed` | User performed a search for movies or TV shows. | `pages/search.vue` |
| `media_viewed` | User viewed the detail page for a movie or TV show. | `pages/[type]/[id].vue` |
| `video_played` | User clicked play on a video trailer or clip. | `components/video/Card.vue` |
| `media_tab_changed` | User switched between the Overview, Videos, or Photos tabs on a media detail page. | `components/media/Details.vue` |
| `person_viewed` | User viewed the detail page for a cast or crew member. | `pages/person/[id].vue` |
| `media_category_viewed` | User browsed a specific media category listing (e.g. trending, top-rated). | `pages/[type]/category/[query].vue` |
| `server_login` | Server-side event captured when the login API endpoint processes a successful authentication. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event captured when the logout API endpoint processes a sign-out request. | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1761219)
- [User engagement funnel: Login → Browse → Watch](https://us.posthog.com/project/483112/insights/dG2Rx0GJ)
- [Search activity over time](https://us.posthog.com/project/483112/insights/BnAhnB0W)
- [Media views by type (movie vs TV)](https://us.posthog.com/project/483112/insights/hIWiXBlr)
- [Daily active users (logins)](https://us.posthog.com/project/483112/insights/FHafku34)
- [User churn: Logouts over time](https://us.posthog.com/project/483112/insights/fVf5rwTl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login; returning sessions that resume without logging in again will remain on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

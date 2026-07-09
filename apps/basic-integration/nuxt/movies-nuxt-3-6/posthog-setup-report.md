<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Nuxt Movies project with PostHog by installing the browser and server SDKs, initializing client-side analytics in a Nuxt plugin, wiring runtime config to environment variables, adding client and server authentication tracking, instrumenting search and content engagement events, and adding client/server exception capture hooks. A PostHog dashboard and five saved insights were also created for the new event set.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Tracks when a visitor submits the login form to start an authenticated session. | `pages/login.vue` |
| `login_succeeded` | Tracks when a visitor successfully signs in on the client after authentication completes. | `pages/login.vue` |
| `login_failed` | Tracks when a login attempt fails so authentication friction can be analyzed. | `pages/login.vue` |
| `server_login_succeeded` | Tracks successful authentication on the server for reliable sign-in measurement. | `server/api/auth/login.post.ts` |
| `logout_clicked` | Tracks when an authenticated user starts the logout flow from the navigation. | `components/NavBar.vue` |
| `server_logout_completed` | Tracks when the server clears the authenticated session during logout. | `server/api/auth/logout.post.ts` |
| `search_started` | Tracks when a user initiates a catalog search with a non-empty query. | `pages/search.vue` |
| `search_results_loaded` | Tracks when search results load successfully so discovery engagement can be measured. | `pages/search.vue` |
| `search_failed` | Tracks when a search request fails to surface discovery issues. | `pages/search.vue` |
| `media_detail_viewed` | Tracks when a user opens a movie or TV detail page as a key content-view funnel step. | `pages/[type]/[id].vue` |
| `media_trailer_played` | Tracks when a user chooses to watch a trailer from a media detail page. | `components/media/Hero.vue` |
| `media_detail_tab_selected` | Tracks when a user switches between overview, videos, and photos on a media page. | `components/media/Details.vue` |
| `person_detail_viewed` | Tracks when a user opens a person detail page to explore cast or crew information. | `pages/person/[id].vue` |
| `person_detail_tab_selected` | Tracks when a user switches between known-for, credits, and photos on a person page. | `components/person/Details.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825394
- Insight: Login funnel (wizard) — https://us.posthog.com/project/483112/insights/cEWfTvEp
- Insight: Search activity trend (wizard) — https://us.posthog.com/project/483112/insights/BjUhTrn1
- Insight: Media engagement mix (wizard) — https://us.posthog.com/project/483112/insights/qqKGHjrw
- Insight: Authentication outcomes (wizard) — https://us.posthog.com/project/483112/insights/xiGTD56B
- Insight: Person detail exploration (wizard) — https://us.posthog.com/project/483112/insights/E9xT4DHh

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

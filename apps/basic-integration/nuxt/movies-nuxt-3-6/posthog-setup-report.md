<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Nuxt Movies project by adding PostHog client and server initialization, wiring Nuxt runtime configuration to environment variables, identifying authenticated users on login and returning sessions, capturing key authentication and discovery events, adding error capture on the global error page, and creating a starter dashboard plus five saved insights in PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful sign-in from the login form. | `pages/login.vue` |
| `user_login_failed` | Captures failed sign-in attempts from the login form. | `pages/login.vue` |
| `server_login_succeeded` | Captures successful authentication on the server API route. | `server/api/auth/login.post.ts` |
| `user_logged_out` | Captures logout requests from authenticated users. | `server/api/auth/logout.post.ts` |
| `search_submitted` | Captures committed catalog searches with the entered query. | `pages/search.vue` |
| `media_detail_viewed` | Captures visits to movie and TV detail pages. | `pages/[type]/[id].vue` |
| `media_card_selected` | Captures clicks on media cards that open a movie or TV detail page. | `components/media/Card.vue` |
| `media_tab_selected` | Captures tab changes within media detail sections. | `components/media/Details.vue` |
| `person_tab_selected` | Captures tab changes within person detail sections. | `components/person/Details.vue` |
| `app_error_captured` | Captures rendered application errors through the global error page. | `error.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807679
- Insight: Login outcomes (wizard) — https://us.posthog.com/project/483112/insights/KNOvldYB
- Insight: Search activity over time (wizard) — https://us.posthog.com/project/483112/insights/bgLSwwoY
- Insight: Discovery funnel (wizard) — https://us.posthog.com/project/483112/insights/wp3yEXtI
- Insight: Engagement tabs by type (wizard) — https://us.posthog.com/project/483112/insights/GZdYlbST
- Insight: Application errors (wizard) — https://us.posthog.com/project/483112/insights/VcqDiVbn

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

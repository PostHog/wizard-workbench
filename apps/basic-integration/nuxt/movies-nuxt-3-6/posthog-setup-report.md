<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog client initialization was added for Nuxt 3.5 with runtime-config-backed environment variables, login and logout flows were instrumented on both client and server, and key engagement actions across search, media details, tabs, and trailer playback were captured. Error capture hooks were also added for Vue runtime errors, login failures, search failures, and the Nuxt error page. A PostHog dashboard plus five saved insights were created to monitor the new analytics surface.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful client-side logins after authentication completes. | `composables/useAuth.ts` |
| `auth_login_succeeded` | Captures successful server-side login requests for authenticated sessions. | `server/api/auth/login.post.ts` |
| `user_logged_out` | Captures client-side logout actions when an authenticated session ends. | `composables/useAuth.ts` |
| `auth_logout_completed` | Captures successful server-side logout requests when the auth cookie is cleared. | `server/api/auth/logout.post.ts` |
| `search_performed` | Captures searches when a user submits a new query from the search page. | `pages/search.vue` |
| `media_detail_viewed` | Captures visits to individual movie or TV detail pages for conversion analysis. | `pages/[type]/[id].vue` |
| `trailer_played` | Captures trailer launches from the hero section on media detail pages. | `components/media/Hero.vue` |
| `trailer_played` | Captures trailer launches from individual video cards in the media gallery. | `components/video/Card.vue` |
| `media_tab_selected` | Captures overview, videos, and photos tab changes on media detail pages. | `components/media/Details.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831062)
- [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/EOg0DPDk)
- [Login to media detail funnel (wizard)](https://us.posthog.com/project/483112/insights/jVPiOC5V)
- [Searches over time (wizard)](https://us.posthog.com/project/483112/insights/p1LJFseh)
- [Trailer plays by source (wizard)](https://us.posthog.com/project/483112/insights/12AgOjYA)
- [Logouts over time (wizard)](https://us.posthog.com/project/483112/insights/DvHVmwR1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

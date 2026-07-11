<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Nuxt 3.5 application with PostHog using `posthog-js` on the client and `posthog-node` in server routes. The integration adds runtime-config-based initialization, client-side identify and reset flows for authentication, server-side event capture with tracing context for login/logout endpoints, event tracking across core browsing and engagement paths, and browser plus application error capture. Environment variables were written to `.env`, and a dashboard with five saved insights was created in PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `login_submitted` | Captures when a visitor submits the login form. | `pages/login.vue` |
| `login_succeeded` | Captures when a visitor successfully signs in on the client. | `composables/useAuth.ts` |
| `logout_clicked` | Captures when an authenticated user chooses to sign out from navigation. | `components/NavBar.vue` |
| `server_login_succeeded` | Captures successful authentication on the login API route. | `server/api/auth/login.post.ts` |
| `server_logout_succeeded` | Captures successful logout on the logout API route. | `server/api/auth/logout.post.ts` |
| `home_hero_opened` | Captures when a visitor opens the featured title from the home page hero. | `pages/index.vue` |
| `catalog_section_explored` | Captures when a visitor opens a category from a carousel section. | `components/carousel/AutoQuery.vue` |
| `media_card_opened` | Captures when a visitor opens a movie or TV detail page from a media card. | `components/media/Card.vue` |
| `search_performed` | Captures when a visitor performs a title search. | `pages/search.vue` |
| `media_details_tab_selected` | Captures when a visitor switches between overview, videos, and photos tabs. | `components/media/Details.vue` |
| `person_details_tab_selected` | Captures when a visitor switches tabs on a person details page. | `components/person/Details.vue` |
| `video_modal_opened` | Captures when a visitor opens an embedded video modal. | `components/IframeModal.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831213)
- Insight: [Logout events by source (wizard)](https://us.posthog.com/project/483112/insights/ZsIR3RFu)
- Insight: [Logins over time (wizard)](https://us.posthog.com/project/483112/insights/ZeAO7BaM)
- Insight: [Login conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/CqykA0fY)
- Insight: [Searches over time (wizard)](https://us.posthog.com/project/483112/insights/mchdBaSu)
- Insight: [Media detail engagement by event (wizard)](https://us.posthog.com/project/483112/insights/VZdfdwIO)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

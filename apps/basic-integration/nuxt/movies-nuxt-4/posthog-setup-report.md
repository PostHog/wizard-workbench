<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Nuxt Movies project by installing `@posthog/nuxt` and `posthog-node`, configuring Nuxt to read PostHog credentials from environment variables, adding a shared server-side PostHog utility, identifying authenticated users on the client, and instrumenting client-side and server-side events across login, logout, search, navigation, and content discovery flows. Error capture was also added in relevant client and server paths. Verification was partially completed: the touched integration files were reviewed, but the repository's existing global TypeScript and lint issues still prevent clean full-project verification.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful client-side logins after authentication completes. | `pages/login.vue` |
| `user_login_failed` | Captures failed login attempts on client and server authentication paths. | `pages/login.vue`, `server/api/auth/login.post.ts` |
| `media_search_submitted` | Captures when a user submits a new media search query. | `pages/search.vue` |
| `media_result_selected` | Captures when a user selects a movie or show card from a listing. | `components/media/Card.vue` |
| `media_details_viewed` | Captures views of media details pages as a funnel entry event. | `pages/[type]/[id].vue` |
| `person_details_viewed` | Captures views of person details pages. | `pages/person/[id].vue` |
| `navigation_item_clicked` | Captures interactions with the primary navigation. | `components/NavBar.vue` |
| `user_logged_out` | Captures client-side logout actions for authenticated users. | `components/NavBar.vue` |
| `server_login_succeeded` | Captures successful authentication requests on the server. | `server/api/auth/login.post.ts` |
| `server_logout_succeeded` | Captures successful logout requests on the server. | `server/api/auth/logout.post.ts` |
| `api_root_requested` | Captures requests to the API root endpoint. | `server/api/index.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825398
- Insight: Logins over time (wizard) — https://us.posthog.com/project/483112/insights/xsBhGKhR
- Insight: Login funnel (wizard) — https://us.posthog.com/project/483112/insights/QzrohhBm
- Insight: Searches by query presence (wizard) — https://us.posthog.com/project/483112/insights/9avxp8Uu
- Insight: Media details viewed (wizard) — https://us.posthog.com/project/483112/insights/LxHxTGf8
- Insight: Logout rate (wizard) — https://us.posthog.com/project/483112/insights/FjfxATFA

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap documentation so collaborators know what to set: `NUXT_PUBLIC_POSTHOG_KEY`, `NUXT_PUBLIC_POSTHOG_HOST`.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` so previously authenticated sessions stay associated with the expected distinct ID.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

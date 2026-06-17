<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt 4 Movies application. The `@posthog/nuxt` module was installed and configured with automatic client-side and server-side error tracking. A singleton server-side PostHog Node client was added for API route tracking. User identification is performed on login, and `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` tracing headers are automatically propagated from client to server via the `__add_tracing_headers` option, allowing client and server events to be correlated by session and person.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired client-side when a user successfully logs in. Also calls `posthog.identify()` with the username. | `pages/login.vue` |
| `user_logged_out` | Fired client-side when a user clicks logout. Calls `posthog.reset()` to clear the identity. | `components/NavBar.vue` |
| `media_detail_viewed` | Fired client-side when a user opens a movie or TV show detail page. Top of the engagement funnel. Includes `media_type`, `media_id`, and `media_title`. | `pages/[type]/[id].vue` |
| `media_searched` | Fired client-side when a user performs a debounced search. Includes the `query` string. | `pages/search.vue` |
| `server_login` | Server-side login event captured in the login API route. Includes `$session_id`, `username`, and `distinctId` for client-server correlation. | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side logout event captured in the logout API route. Includes `$session_id` and `distinctId` for client-server correlation. | `server/api/auth/logout.post.ts` |

## Next steps

The PostHog MCP's dashboard creation tools require additional API scopes that were not available during this run. To create the recommended **"Analytics basics (wizard)"** dashboard, please follow these steps manually:

1. Go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) and create a new dashboard named **"Analytics basics (wizard)"**.
2. Add the following insights using [New Insight](https://us.posthog.com/project/2/insights/new):

   - **Login funnel** — Funnel insight with steps: `user_logged_in` → `media_detail_viewed` → `media_searched`. Shows how many users progress from login to browsing.
   - **Daily active users** — Trends insight for unique users firing `user_logged_in` over time.
   - **Top searches** — Trends insight for `media_searched` broken down by `query` property.
   - **Media engagement** — Trends insight for `media_detail_viewed` broken down by `media_type` (movie vs tv).
   - **Login-to-logout retention** — Retention insight: returning event `user_logged_in`, retention event `media_detail_viewed`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload into CI so production stack traces de-minify. The `@posthog/nuxt` module supports this via the `sourcemaps` config block in `nuxt.config.ts` — add `PROJECT_ID` and `PERSONAL_API_KEY` env vars (see the PostHog [environment settings](https://us.posthog.com/project/2/settings/environment#variables) and [user API keys](https://us.posthog.com/project/2/settings/user-api-keys)).
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies application. The integration includes client-side analytics with session replay and error tracking via `posthog-js`, server-side event tracking via `posthog-node`, user identification on login, and a Vue error hook for automatic exception capture.

**Files created:**
- `plugins/posthog.client.ts` — initializes PostHog on the client, hooks into Vue error handling, and provides `$posthog` to all components
- `types/nuxt-app.d.ts` — TypeScript declaration for `$posthog` on `NuxtApp`
- `.env` — populated with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`

**Files modified:**
- `nuxt.config.ts` — added `posthog` block to `runtimeConfig.public`
- `pages/login.vue` — identify user and capture `user_logged_in` on successful login
- `components/NavBar.vue` — capture `user_logged_out` and call `posthog.reset()` on logout
- `pages/search.vue` — capture `search_performed` with the query string
- `pages/[type]/[id].vue` — capture `media_viewed` on mount with media ID, type, and title
- `components/video/Card.vue` — capture `video_played` with video key, name, and type
- `server/api/auth/login.post.ts` — server-side `server_login` event with session/user correlation via tracing headers

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in. Also calls `identify()` to link the session to the username. | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar. Also calls `posthog.reset()`. | `components/NavBar.vue` |
| `search_performed` | User submits a search query. Includes the `query` property. | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page. Includes `media_id`, `media_type`, and `media_title`. | `pages/[type]/[id].vue` |
| `video_played` | User clicks play on a trailer or video clip. Includes `video_key`, `video_name`, and `video_type`. | `components/video/Card.vue` |
| `server_login` | Server-side login event linked to the client session via `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers. | `server/api/auth/login.post.ts` |

## Next steps

Create the "Analytics basics (wizard)" dashboard in PostHog using the events instrumented above. Suggested insights:

1. **Login trend** — Trends insight for `user_logged_in` over time
2. **Login → Media Viewed funnel** — Funnel from `user_logged_in` → `media_viewed` to measure onboarding completion
3. **Search volume** — Trends for `search_performed` with breakdown by `query` (top searches)
4. **Most-watched content** — Trends for `media_viewed` broken down by `media_title`
5. **Video engagement** — Trends for `video_played` to measure trailer engagement

- [Create a new insight](https://us.posthog.com/project/2/insights/new)
- [View all dashboards](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nuxt Movies 3.6 application. The following changes were made:

- **`plugins/posthog.client.ts`** (new): Client-side PostHog plugin initializing `posthog-js`, hooking into Vue errors via `vue:error` for automatic exception capture, and providing `$posthog` to all components.
- **`types/nuxt-app.d.ts`** (new): TypeScript declaration extending `NuxtApp` with `$posthog: PostHog` so all components get full type coverage.
- **`nuxt.config.ts`**: Added `runtimeConfig.public.posthog` block (`publicKey`, `host`, `posthogDefaults`) sourced from environment variables.
- **`pages/login.vue`**: On successful login, calls `posthog.identify(username)` to link the session to the user, then `posthog.capture('user_logged_in')`.
- **`components/NavBar.vue`**: On logout, captures `user_logged_out` and calls `posthog.reset()` to unlink the session before navigating away.
- **`pages/[type]/[id].vue`**: On mount, captures `media_viewed` with `media_type`, `media_id`, `media_title`, `genre_ids`, and `vote_average`.
- **`pages/search.vue`**: After each debounced search, captures `search_performed` with the `search_query`.
- **`components/video/Card.vue`**: On play click, captures `video_played` with `video_name`, `video_type`, `video_site`, and `video_key`.
- **`pages/person/[id].vue`**: On mount, captures `person_viewed` with `person_id`, `person_name`, and `known_for_department`.
- **`server/api/auth/login.post.ts`**: After successful cookie auth, instantiates a `posthog-node` client per request, reads `x-posthog-session-id` / `x-posthog-distinct-id` headers (set automatically by `posthog-js` via `__add_tracing_headers`), and fires `server_user_login` within `withContext()` so the server event is correlated with the browser session.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in; also identifies the user in PostHog. | `pages/login.vue` |
| `user_logged_out` | Fired when a user clicks logout; resets the PostHog session. | `components/NavBar.vue` |
| `media_viewed` | Fired when a user opens a movie or TV show detail page. | `pages/[type]/[id].vue` |
| `search_performed` | Fired when a user submits a search query. | `pages/search.vue` |
| `video_played` | Fired when a user plays a trailer or video. | `components/video/Card.vue` |
| `person_viewed` | Fired when a user opens a person/actor profile page. | `pages/person/[id].vue` |
| `server_user_login` | Server-side login event correlated to the browser session via headers. | `server/api/auth/login.post.ts` |

## Next steps

We've built five insights and a dashboard to monitor user behavior based on the events just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829270)
- **Insight**: [User Logins](https://us.posthog.com/project/483112/insights/0snNeJUs) — daily login count trend over 30 days.
- **Insight**: [Daily Active Users](https://us.posthog.com/project/483112/insights/yCAOgEUZ) — unique users who logged in each day.
- **Insight**: [Media Viewed by Type](https://us.posthog.com/project/483112/insights/44i7ONRR) — `media_viewed` broken down by `movie` vs `tv` over 30 days.
- **Insight**: [Content Discovery Funnel](https://us.posthog.com/project/483112/insights/IAdw7pNe) — conversion from `search_performed` → `media_viewed` → `video_played`.
- **Insight**: [Login to Engagement Funnel](https://us.posthog.com/project/483112/insights/4IiefAiV) — conversion from `user_logged_in` → `media_viewed` → `video_played` within 7 days.

Dashboard subscription and alerts were skipped — the interactive prompt was unavailable in this run. To add a weekly email digest or a funnel-drop alert, visit the dashboard and use the **Subscribe** / **Alerts** controls directly in PostHog.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on the login form submit. If a user is already authenticated on page refresh, `identify` should be called again (e.g., in a plugin that reads the `auth-user` cookie).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Nuxt 3.6 movies app. The integration adds client-side and server-side event tracking, user identification on login, session-correlated server events, and automatic Vue error tracking via a Nuxt plugin.

**New files created:**
- `plugins/posthog.client.ts` — initialises PostHog on the client, sets up the Vue error hook, and provides `$posthog` to all components
- `types/nuxt-app.d.ts` — TypeScript declaration that types `$posthog` on the Nuxt app instance

**Files modified:**
- `nuxt.config.ts` — added `posthog` block to `runtimeConfig.public` (reads from env vars)
- `pages/login.vue` — identifies user and captures `user_logged_in` on successful login
- `components/NavBar.vue` — captures `user_logged_out` and calls `posthog.reset()` before logout
- `pages/[type]/[id].vue` — captures `media_viewed` when a movie/TV detail page mounts
- `components/media/Hero.vue` — captures `trailer_played` when the trailer button is clicked
- `pages/search.vue` — captures `search_performed` when a search query fires
- `components/media/Details.vue` — captures `media_tab_changed` when the user switches tabs
- `components/video/Card.vue` — captures `video_played` when a video card is clicked
- `server/api/auth/login.post.ts` — captures `server_user_login` server-side with session/distinct-ID correlation

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in via the login form | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar | `components/NavBar.vue` |
| `media_viewed` | User opens a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User clicks to play the trailer from the hero section | `components/media/Hero.vue` |
| `search_performed` | User performs a search and results are fetched | `pages/search.vue` |
| `media_tab_changed` | User switches between Overview, Videos, and Photos tabs | `components/media/Details.vue` |
| `video_played` | User clicks a video card to play it | `components/video/Card.vue` |
| `server_user_login` | Server-side: user login API completes successfully | `server/api/auth/login.post.ts` |

## Next steps

The wizard was unable to auto-create a PostHog dashboard because the API key lacks the `dashboard:write` and `query:read` scopes. To build the recommended dashboard manually, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard named **"Analytics basics (wizard)"**, then add the following insights:

1. **Login funnel** — Funnel: `user_logged_in` → `media_viewed` → `trailer_played` (measures content engagement after login)
2. **Search-to-detail conversion** — Funnel: `search_performed` → `media_viewed` (measures search effectiveness)
3. **Daily active users** — Trends: unique users triggering `media_viewed` over time
4. **Content engagement breakdown** — Trends: `trailer_played` and `video_played` over time (shows video engagement)
5. **Login volume** — Trends: `user_logged_in` and `user_logged_out` over time (monitors session churn)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

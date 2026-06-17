<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Nuxt Movies application. PostHog is now tracking user interactions across client, server, and error boundaries. Here is a summary of all changes made:

- **`nuxt.config.ts`** — Added a `posthog` block to `runtimeConfig.public` that reads `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` from environment variables.
- **`.env`** — Created with `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` values.
- **`package.json`** — Added `posthog-js` and `posthog-node` as runtime dependencies.
- **`plugins/posthog.client.ts`** — New client-side PostHog plugin: initializes `posthog-js`, enables debug mode in development, hooks into `vue:error` for automatic Vue error capture, and provides `$posthog` to all components.
- **`types/nuxt-app.d.ts`** — New TypeScript declarations for `$posthog` on the `NuxtApp` interface.
- **`app.vue`** — Added `onErrorCaptured` hook to catch and report Vue component errors via `captureException`.
- **`pages/login.vue`** — Calls `posthog.identify(username)` and captures `user_logged_in` on successful login.
- **`components/NavBar.vue`** — Captures `user_logged_out` and calls `posthog.reset()` when the user logs out.
- **`pages/search.vue`** — Captures `search_performed` with the search query whenever the user submits a search.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` on mount with media ID, type, title, and vote average.
- **`components/media/Hero.vue`** — Captures `trailer_played` with media ID and title when the user plays a trailer.
- **`components/video/Card.vue`** — Captures `video_played` with video name, type, and key when the user plays a video.
- **`components/media/Details.vue`** — Captures `media_tab_changed` with media ID, title, and selected tab when the user switches between Overview/Videos/Photos tabs.
- **`server/api/auth/login.post.ts`** — Uses `posthog-node` to capture `server_user_logged_in` on the server side, correlating with the client session via `x-posthog-session-id` and `x-posthog-distinct-id` headers.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in; identifies the user | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button | `components/NavBar.vue` |
| `search_performed` | User submits a search query | `pages/search.vue` |
| `media_viewed` | User views a movie or TV show detail page | `pages/[type]/[id].vue` |
| `trailer_played` | User plays a trailer from the hero section | `components/media/Hero.vue` |
| `video_played` | User plays a video from the videos tab | `components/video/Card.vue` |
| `media_tab_changed` | User switches between Overview/Videos/Photos tabs | `components/media/Details.vue` |
| `server_user_logged_in` | Server-side login event correlated with client session | `server/api/auth/login.post.ts` |

## Next steps

The PostHog MCP token did not have dashboard write scope, so the dashboard was not created automatically. Create a dashboard named **"Analytics basics (wizard)"** in PostHog and add these suggested insights:

1. **Login trend** — Trends insight on `user_logged_in` over time
2. **Login conversion funnel** — Funnel from `media_viewed` → `trailer_played` to measure trailer engagement
3. **Search usage** — Trends insight on `search_performed` over time
4. **Content engagement** — Trends insight comparing `media_viewed`, `trailer_played`, and `video_played`
5. **Logout rate vs Login rate** — Trends formula comparing `user_logged_out` / `user_logged_in`

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is only called on login; consider calling it again on app load if a session cookie is already set.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-3-6/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

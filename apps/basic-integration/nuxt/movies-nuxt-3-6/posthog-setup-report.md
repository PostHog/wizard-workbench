# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Nuxt Movies app (Nuxt 3.6). The integration covers client-side analytics, server-side event tracking, user identification, and error tracking.

**Changes made:**

- **`nuxt.config.ts`** — Added `posthog` block to `runtimeConfig.public` so the token and host are available throughout the app via `useRuntimeConfig()`.
- **`plugins/posthog.client.ts`** _(new)_ — Initialises `posthog-js` on the client, registers a `vue:error` hook for automatic Vue error capture, and exposes `$posthog` to every component via `provide`.
- **`types/nuxt-app.d.ts`** _(new)_ — TypeScript module augmentation so `useNuxtApp().$posthog` is fully typed.
- **`pages/login.vue`** — Calls `posthog.identify()` and captures `user_logged_in` on successful login; captures exceptions on failure.
- **`components/NavBar.vue`** — Captures `user_logged_out` and calls `posthog.reset()` before logout to clear the identity.
- **`pages/search.vue`** — Captures `search_performed` (with `query` property) when a new search term is submitted.
- **`pages/[type]/[id].vue`** — Captures `media_viewed` (with `media_id`, `media_type`, `media_title`) in `onMounted`.
- **`components/video/Card.vue`** — Captures `video_played` (with `video_key`, `video_name`, `video_type`) when a trailer or clip is started.
- **`components/media/Details.vue`** — Captures `media_tab_changed` (with `tab`, `media_id`, `media_type`, `media_title`) when a user switches between Overview / Videos / Photos.
- **`server/api/auth/login.post.ts`** — Uses `posthog-node` to capture `server_login` server-side, correlating the event with the client session via `x-posthog-session-id` / `x-posthog-distinct-id` headers.
- **`server/api/auth/logout.post.ts`** — Uses `posthog-node` to capture `server_logout` server-side.
- **`.env`** — `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` written via wizard-tools (never hardcoded in source).

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in to the app | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button in the navigation bar | `components/NavBar.vue` |
| `search_performed` | User submits a search query and results are fetched | `pages/search.vue` |
| `media_viewed` | User opens a movie or TV show detail page | `pages/[type]/[id].vue` |
| `video_played` | User clicks play on a trailer or video clip | `components/video/Card.vue` |
| `media_tab_changed` | User switches between Overview, Videos, and Photos tabs | `components/media/Details.vue` |
| `server_login` | Server-side event when a login request is processed | `server/api/auth/login.post.ts` |
| `server_logout` | Server-side event when a logout request is processed | `server/api/auth/logout.post.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793509)
- [Daily Logins](https://us.posthog.com/project/483112/insights/ueMZBzZL)
- [Unique Viewers — Media Content](https://us.posthog.com/project/483112/insights/EaQG8ufF)
- [Search Activity](https://us.posthog.com/project/483112/insights/aWKxrZgq)
- [Video Plays](https://us.posthog.com/project/483112/insights/9eJucGYX)
- [Login → Media → Video Funnel](https://us.posthog.com/project/483112/insights/ETWvRK3E)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

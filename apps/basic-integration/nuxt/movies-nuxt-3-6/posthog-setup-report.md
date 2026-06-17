# PostHog Setup Report

PostHog is fully integrated into this Nuxt 3.6 movies app: SDK installed, client plugin initialized, 10 events instrumented, user identification wired, and global error tracking active.

---

## What was installed

| Package | Version |
|---|---|
| `posthog-js` | `^1.164.0` |
| `posthog-node` | `^5.10.0` |

> Note: `@posthog/nuxt` is not supported for Nuxt 3.0–3.6. The manual plugin approach is used instead.

---

## How PostHog was initialized

- **`plugins/posthog.client.ts`** — Nuxt client plugin that boots PostHog on app load, sets tracing headers (`__add_tracing_headers`), and captures Vue errors via the `vue:error` hook.
- **`nuxt.config.ts`** — `runtimeConfig.public` exposes `posthogProjectToken` and `posthogHost`.
- **`.env`** — `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` set (never hardcoded).
- **`types/nuxt-app.d.ts`** — TypeScript declaration for `$posthog` on `NuxtApp`.
- Components access PostHog via `useNuxtApp().$posthog`.

---

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | User successfully logs in | `pages/login.vue` |
| `login_failed` | Login attempt failed | `pages/login.vue` |
| `user_logged_out` | User clicks the logout button | `components/NavBar.vue` |
| `search_performed` | User submits a search query | `pages/search.vue` |
| `trailer_played` | User plays a movie or TV show trailer | `components/media/Hero.vue` |
| `video_played` | User plays a video from the videos tab | `components/video/Card.vue` |
| `media_detail_tab_changed` | User switches tabs on a media detail page | `components/media/Details.vue` |
| `media_card_clicked` | User clicks a media card to view its detail | `components/media/Card.vue` |
| `server_user_logged_in` | Server-side: login processed by auth API | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side: logout processed by auth API | `server/api/auth/logout.post.ts` |

Server-side events use `posthog-node`, read `x-posthog-session-id` and `x-posthog-distinct-id` headers (forwarded automatically by the client plugin), and pass `$session_id` as a property to link server and client events.

---

## User identification

**Wired.** `posthog.identify(username)` fires on successful login (`pages/login.vue`). `posthog.reset()` fires on logout (`components/NavBar.vue`) to disassociate the session from the user.

---

## Error tracking

Two complementary handlers cover the full component tree:

1. **`plugins/posthog.client.ts`** — `vue:error` Nuxt hook catches unhandled Vue errors globally.
2. **`app.vue`** — `onErrorCaptured` catches component tree errors and calls `posthog.captureException(error)`.

No additional packages were required.

---

## Dashboard

No dashboard was auto-created during this run. View your project's events and create insights at:

[PostHog Project Dashboards](https://us.posthog.com/project/2/dashboard)

---

## Build status

Build passed clean after the integration. Two pre-existing issues remain (not introduced by this integration):

- **Typecheck:** `proxy/nitro.config.ts(1,10)` — `TS2305: Module 'nitropack' has no exported member 'defineNitroConfig'`
- **Lint:** 11 errors in `composables/useAuth.ts` and `middleware/auth.global.ts`

All integration-touched files are lint and typecheck clean.

---

## Next steps

1. **Deploy and verify** — start the app (`pnpm dev`) and log in; confirm events appear in [PostHog Live Events](https://us.posthog.com/project/2/activity/explore).
2. **Build a dashboard** — go to [Dashboards](https://us.posthog.com/project/2/dashboard) and create insights for your key events (e.g. login funnel, search usage, media engagement).
3. **Session replay** — enable session recording in [Project Settings](https://us.posthog.com/project/2/settings) to replay user sessions alongside events.
4. **Add person properties** — extend `posthog.identify()` in `pages/login.vue` with a second argument `{ name, email, ... }` to enrich user profiles.
5. **Fix pre-existing issues** — resolve the `defineNitroConfig` typecheck error and the lint errors in `composables/useAuth.ts` / `middleware/auth.global.ts` when convenient (not related to this integration).

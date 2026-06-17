# PostHog Setup Report

PostHog product analytics has been integrated into this Nuxt 3 movies app with event tracking, user identification, and error capture.

---

## What was installed

| Package | Version |
|---|---|
| `posthog-js` | 1.188.0 (client-side) |
| `posthog-node` | 4.18.0 (server-side API routes) |

**Package manager:** npm

---

## Initialization

PostHog is initialized once in `plugins/posthog.client.ts` and injected into the Nuxt app as `$posthog`. Access it anywhere with `useNuxtApp().$posthog`.

**Files created or modified:**

- `.env` — `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` written via wizard tools (never hardcoded)
- `nuxt.config.ts` — `runtimeConfig.public.posthog` exposes the token and host
- `plugins/posthog.client.ts` — SDK init with debug mode in development
- `types/nuxt-app.d.ts` — TypeScript declarations extending `NuxtApp` with `$posthog`

---

## Events instrumented

11 events total across 8 files.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | User submits login form and is authenticated | `pages/login.vue` |
| `user_logged_out` | User clicks logout in the navbar | `components/NavBar.vue` |
| `server_user_logged_in` | Server-side: login API processes a successful auth | `server/api/auth/login.post.ts` |
| `server_user_logged_out` | Server-side: logout API processes a session termination | `server/api/auth/logout.post.ts` |
| `media_searched` | User submits a debounced search query | `pages/search.vue` |
| `video_played` | User clicks play on a video or trailer card | `components/video/Card.vue` |
| `video_modal_opened` | The iframe video modal becomes visible | `components/IframeModal.vue` |
| `media_details_tab_changed` | User switches between Overview / Videos / Photos tabs | `components/media/Details.vue` |
| `language_changed` | User selects a different locale | `components/LanguageSwitcher.vue` |
| `photo_modal_opened` | User opens the photo gallery modal | `components/photo/Modal.vue` |
| `photo_modal_navigated` | User navigates prev/next inside the photo modal | `components/photo/Modal.vue` |

---

## User identification

**Wired.** `posthog.identify()` fires in `pages/login.vue` immediately after a successful login response, using the username as the distinct ID. `posthog.reset()` fires in `components/NavBar.vue` before the logout API call.

**Note on server-side session stitching:** The client plugin does not set `__add_tracing_headers: true`, so the server-side `server_user_logged_in` / `server_user_logged_out` events fall back to the username as `distinctId` rather than the client session ID. This is safe and functional — if you want full session stitching between client and server events, add `__add_tracing_headers: true` to `posthog.init()` in `plugins/posthog.client.ts`.

---

## Error tracking

Wired at two levels:

1. **Global Vue hook** — `vue:error` in `plugins/posthog.client.ts` catches all Vue component errors and forwards them to `posthog.captureException`.
2. **Root error boundary** — `onErrorCaptured` in `app.vue` catches errors at the app root and forwards them to `posthog.captureException`. Errors also propagate to the global handler (`return false`).

---

## PostHog project

View your events and build insights in PostHog:
[PostHog Project — Events](https://us.posthog.com/project/2/activity/explore)

No dashboard was created as part of this run. See **Next steps** below to build one.

---

## Build results

- **Install:** `npm install` succeeded — 1277 packages, posthog-js@1.188.0 and posthog-node@4.18.0 added.
- **Typecheck:** Integration files pass. Two pre-existing errors remain in files not touched by this integration (`components/video/Card.nuxt.test.ts`, `unocss.config.ts`).
- **Lint:** All integration files pass with 0 errors. Full `npm run lint` exits non-zero only because `.posthog-wizard-cache/` scaffolding files are in the lint scope — not project source.
- **Tests:** 61 passed, 1 pre-existing failure in `composables/utils.nuxt.test.ts` (case sensitivity in `formatVote`) — unrelated to this integration.

### Build conflict (resolved)

The `capture` step used `posthog.withContext()` from `posthog-node`, which does not exist in the installed version (v4.18.0). The `build` step replaced both call sites in `server/api/auth/login.post.ts` and `server/api/auth/logout.post.ts` with direct `posthog.capture()` calls, passing `$session_id` as an event property instead.

---

## Next steps

1. **Verify events are arriving** — Log in, search for a movie, open a video. Open the [PostHog Live Events](https://us.posthog.com/project/2/activity/explore) view and confirm `user_logged_in`, `media_searched`, and `video_played` appear.

2. **Build a dashboard** — Go to [Dashboards](https://us.posthog.com/project/2/dashboard) and create a new dashboard. Add trend charts for `media_searched`, `video_played`, and `user_logged_in` to get a view of core engagement.

3. **Enable session replay** *(optional)* — Add `session_recording: { ... }` to `posthog.init()` in `plugins/posthog.client.ts` to record user sessions alongside events.

4. **Add server-side session stitching** *(optional)* — Set `__add_tracing_headers: true` in `posthog.init()` so server-side events share the same session ID as client events, enabling full funnel analysis across the client/server boundary.

5. **Fix pre-existing test failure** — `composables/utils.nuxt.test.ts > formatVote` expects `'1.2K'` but the implementation returns `'1.2k'`. This is unrelated to PostHog but worth fixing before your next CI run.

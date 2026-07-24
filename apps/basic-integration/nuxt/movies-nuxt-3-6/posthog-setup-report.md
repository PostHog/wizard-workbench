# PostHog setup report

PostHog product analytics and client-side error tracking were added to the Nuxt 3.6 movie application, with a starter dashboard and seven personless action events.

## Installed and initialized

- Installed `posthog-js` **1.407.2** and `posthog-node` **5.46.1** as runtime dependencies using pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Added public runtime configuration in `nuxt.config.ts` and documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`.
- Added `.env` configuration using the project's configured PostHog values. The client-only `plugins/posthog.client.ts` initializes the singleton once, enables tracing headers and development debugging, captures Vue errors, and exposes `$posthog` through `useNuxtApp()`.
- Missing configuration is guarded: development reports a clear configuration error, while production remains a no-op.

## Events instrumented

These are instrumented call sites, not confirmed deliveries. The run did not observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `login_failed` | A visitor submits the sign-in form but the flow returns an error. | `pages/login.vue` |
| `logout_requested` | A visitor explicitly starts the sign-out flow. | `components/NavBar.vue` |
| `media_search_performed` | A visitor submits a media search; only query length is recorded. | `pages/search.vue` |
| `media_selected` | A visitor opens a movie or TV show from a media card. | `components/media/Card.vue` |
| `media_tab_selected` | A visitor switches among overview, videos, and photos on a media detail page. | `components/media/Details.vue` |
| `video_played` | A visitor chooses a trailer or other media video to play. | `components/video/Card.vue` |

The event properties intentionally exclude usernames, search text, media titles, and other user-entered content.

## User identification

Identification was **skipped**. The demo authentication flow exposes only a user-entered username and has no stable non-PII user ID, UUID, primary key, or other account identifier. Using the username as a PostHog distinct ID would violate the identity contract. Events therefore remain personless until authentication provides a stable non-PII identifier.

### Follow-up issue: unresolved attribution

The application cannot currently attribute events to authenticated people. If this remains unresolved, the dashboard can show aggregate activity but cannot reliably answer user-level questions or connect activity across authenticated sessions. When a stable ID is available, identify it after successful login and on authenticated-session hydration, and reset during logout. No `DISTINCT_ID` placeholder was introduced at any call site.

## Error tracking

- The existing centralized `vue:error` hook in `plugins/posthog.client.ts` captures Vue errors with `captureException()`.
- `error.vue` now captures the Nuxt global error boundary's client-side error with `captureException()`.
- No manual route/component error captures or server-side error tracking were added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902660) contains four saved tiles: Authentication activity, Media discovery activity, Search to media selection funnel, and Playback engagement. It is configured for the last 30 days and is expected to populate as events arrive; the run did not verify event delivery or populated results.

## Verification and conflicts

- `pnpm install` completed successfully.
- `pnpm build` completed successfully after the integration fixes. This proves the project builds; it does not prove that events flow to PostHog.
- `pnpm typecheck` remains blocked by a pre-existing `proxy/nitro.config.ts` error: it imports missing `defineNitroConfig` from `nitropack`.
- `pnpm lint` still reports pre-existing issues in `composables/useAuth.ts`, `middleware/auth.global.ts`, and `server/api/auth/login.post.ts`, plus pre-existing markup whitespace warnings in `pages/login.vue`. The review reported no remaining lint errors in the PostHog plugin, navigation, media-card, media-details, error boundary, or manifest.
- No browser delivery test was run, so event arrival, error delivery, and session linkage remain unconfirmed.
- No CSP was found in project files; no CSP changes were needed.

## Next steps

1. Provide authentication with a stable, non-PII user identifier, then wire identify on login and session hydration and reset on logout.
2. Run the application in a real browser and exercise login, logout, search, media selection, tab selection, and playback; confirm the seven events arrive in PostHog.
3. Trigger a representative client error and confirm it appears in PostHog Error Tracking.
4. Resolve the pre-existing typecheck and lint issues before merging, or document them separately from this integration.
5. Set the documented environment variables in every deployment environment, not only the local `.env` file.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by generated code. The recorded build passed, but typecheck and lint retain the pre-existing conflicts listed above. Check `proxy/nitro.config.ts`, `composables/useAuth.ts`, `middleware/auth.global.ts`, `server/api/auth/login.post.ts`, and the whitespace warnings in `pages/login.vue`.
- [ ] Run the test suite and update mocks or fixtures for the new PostHog calls. No test suite was run during this integration.
- [ ] Confirm `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in each deployment environment. Check `.env.example` and `nuxt.config.ts`.
- [ ] Exercise each instrumented action in a real browser and confirm events arrive in PostHog. Check the capture handlers in `pages/login.vue` (lines 15 and 18), `components/NavBar.vue` (line 6), `pages/search.vue` (line 19), `components/media/Card.vue` (line 12), `components/media/Details.vue` (line 14), and `components/video/Card.vue` (line 12).
- [ ] Trigger a client-side error and confirm exception delivery. Check `error.vue` (line 12) and the `vue:error` hook in `plugins/posthog.client.ts`.
- [ ] Before relying on user-level attribution, add a stable non-PII identifier and wire identify on login/session hydration plus reset on logout. Check `pages/login.vue`, `composables/useAuth.ts`, and `components/NavBar.vue`.

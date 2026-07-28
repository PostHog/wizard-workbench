# PostHog setup report

PostHog product analytics and browser error tracking were added to the Nuxt 3.6 Movies app, with a starter dashboard for the instrumented events.

## Installed and initialized

- Installed `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with pnpm at the workspace root.
- Initialized the browser-only `posthog-js` client once in `plugins/posthog.client.ts` through a Nuxt client plugin.
- Exposed the initialized client as `$posthog`, with TypeScript support in `types/nuxt-app.d.ts`.
- Configured public runtime variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `nuxt.config.ts` and documented them in `.env.example`. The real values are configured in the local `.env` through wizard tooling.
- No server-side events were added: the existing API routes did not provide a stable authenticated identifier for attribution.

## Events instrumented

The run verified that these `capture()` calls were placed at the corresponding interaction handlers. It did **not** exercise the app in a browser or observe events arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A user successfully completes the demo sign-in flow. | `pages/login.vue` |
| `logout_initiated` | An authenticated user starts logging out. | `components/NavBar.vue` |
| `search_submitted` | A visitor submits a new movie or TV search. | `pages/search.vue` |
| `media_selected` | A visitor opens a movie or TV title from a media card. | `components/media/Card.vue` |
| `media_tab_selected` | A visitor switches between overview, videos, and photos for a title. | `components/media/Details.vue` |
| `video_play_requested` | A visitor requests playback of a title video. | `components/video/Card.vue` |

## User identification

User identification was skipped. The authentication flow exposes only a mutable username; it does not provide a stable user ID, UUID, resource identifier, or email at the client boundary. The integration therefore keeps events personless and does not use the username or a placeholder as a distinct ID.

This is an unresolved attribution issue: until authentication exposes a stable identifier, events cannot be reliably associated with returning authenticated users, and logout cannot safely reset an identified PostHog person. A future auth/schema change should expose that stable ID, call `identify()` after successful login and authenticated session hydration, and call `reset()` when logout begins. No `DISTINCT_ID` placeholder was added to any call site.

## Error tracking

Browser exception autocapture is enabled with `capture_exceptions: true` in `plugins/posthog.client.ts`. The existing Nuxt `vue:error` hook also forwards Vue errors through `captureException`. The run verified the configuration and build integration, but did not trigger an exception or observe an error event in PostHog.

## Dashboard

[Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918297)

The dashboard contains four insight tiles: Discovery activity, Content engagement, Authentication activity, and Login to discovery funnel. They use the planned event names over the last 30 days and may initially be empty until events are ingested.

## Verification and conflicts

- `pnpm install` completed successfully with an up-to-date lockfile.
- `pnpm build` passed after the review fixes.
- `pnpm typecheck` remains blocked by a pre-existing `proxy/nitro.config.ts` error: it imports missing `defineNitroConfig`. The rerun showed only this unrelated error after integration-specific plugin errors were fixed.
- `pnpm lint` remains blocked by pre-existing style violations outside the integration changeset. The rerun reported no integration-file errors.
- No browser test was run, so event delivery, exception delivery, and dashboard population are unconfirmed.
- No Content-Security-Policy was found, so no CSP changes were required.

## Before you merge

- [ ] Run the full production build in the deployment environment and confirm the PostHog variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` are configured from `.env.example`, not only locally; inspect `nuxt.config.ts` and `plugins/posthog.client.ts`.
- [ ] Run the test suite and update any mocks or fixtures affected by the new captures in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, and `components/video/Card.vue`.
- [ ] Resolve the pre-existing typecheck error in `proxy/nitro.config.ts` and the pre-existing lint violations outside the integration changeset.
- [ ] Exercise login, logout, search, media selection, tab selection, and video playback in a real browser, then confirm the six events arrive in PostHog and populate the dashboard.
- [ ] Add a stable authenticated user ID to the auth response/state, then wire `identify()` after login and authenticated refresh and `reset()` when logout begins before relying on person-level attribution.
- [ ] Trigger a browser/Vue error and confirm exception events arrive in PostHog; inspect `plugins/posthog.client.ts` if they do not.

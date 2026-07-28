# PostHog setup report

PostHog product analytics and client-side error tracking were added to the Nuxt 3.6 Movies app, with five interaction events and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.5 with pnpm. `posthog-node` was initially installed but removed during review because no server-side PostHog instrumentation uses it.
- Added environment-driven runtime configuration in `nuxt.config.ts` using `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`; the names are documented in `.env.example` and the configured values were present during the run.
- Added the browser-only client plugin at `plugins/posthog.client.ts`, exposing the shared client through `useNuxtApp().$posthog`, with tracing headers and the existing default capture behavior preserved.
- No CSP changes were needed because the app has no Content-Security-Policy configuration.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor successfully signs in through the demo login form. | `composables/useAuth.ts` |
| `user_logged_out` | An authenticated visitor starts the logout flow. | `composables/useAuth.ts` |
| `search_submitted` | A visitor submits a new media search; only numeric `query_length` is sent. | `pages/search.vue` |
| `media_details_viewed` | A visitor selects a movie or TV item to open its details. | `components/media/Card.vue` |
| `video_played` | A visitor starts playback of a media video. | `components/video/Card.vue` |

These events were verified by static inspection at their interaction handlers. The run did **not** observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

## User identification

Identification was skipped. The demo authentication model exposes only a mutable username and no stable, safe non-PII identifier. The events therefore use PostHog's anonymous client identity and do not send the username or user-entered search text. This leaves attribution unresolved: analytics cannot reliably follow a person across anonymous sessions until the auth model provides a stable identifier.

Before identity can be meaningful, add a stable non-PII ID to the auth model and successful login response, then identify on login and restored authenticated state and reset before logout state is cleared. Relevant current call sites are `composables/useAuth.ts` (login and logout handlers); no `DISTINCT_ID` placeholder was introduced.

## Error tracking

`plugins/posthog.client.ts` retains the `vue:error` handler and adds a Nuxt `app:error` handler, both forwarding errors through `posthogClient.captureException`. The run verified this wiring by inspection only; production error delivery was not exercised.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919800)

The dashboard contains four tagged insights covering daily login activity, daily search submissions, combined media/video engagement, and a login-to-video-playback funnel. The dashboard and insight definitions are live, but may remain empty until events arrive.

## Verification and conflicts

- `pnpm install` completed successfully after manifest reconciliation.
- `pnpm build` passed after the review changes.
- `pnpm typecheck` remains blocked solely by the pre-existing `proxy/nitro.config.ts` error: it imports unavailable `defineNitroConfig`.
- `pnpm lint` remains blocked by pre-existing errors in `composables/useAuth.ts`, `middleware/auth.global.ts`, `pages/login.vue`, and `server/api/auth/login.post.ts`, plus warnings in `NavBar.vue`. No final plugin or package findings remained.
- No automated runtime event-delivery test was run; production event flow is unconfirmed.

## Before you merge

- [ ] Run a full production build in the target environment and confirm the PostHog environment variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` are set in deployment configuration, not only locally; see `nuxt.config.ts` and `.env.example`.
- [ ] Run the test suite and update any mocks or fixtures affected by captures in `composables/useAuth.ts`, `pages/search.vue`, `components/media/Card.vue`, and `components/video/Card.vue`.
- [ ] Resolve the pre-existing typecheck conflict in `proxy/nitro.config.ts` and the pre-existing lint findings in `composables/useAuth.ts`, `middleware/auth.global.ts`, `pages/login.vue`, `server/api/auth/login.post.ts`, and `NavBar.vue`.
- [ ] Exercise login, logout, search, media-details, and video-playback flows in a real browser and confirm the five named events arrive in PostHog; the run itself did not verify delivery.
- [ ] Add a stable non-PII authenticated user identifier and wire identify/reset in `composables/useAuth.ts` before relying on cross-session user attribution.

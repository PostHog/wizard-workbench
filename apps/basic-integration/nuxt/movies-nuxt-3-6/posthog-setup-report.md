# PostHog setup report

PostHog was added to the Nuxt movie app with browser initialization, six anonymous product events, client-side error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.8 and `posthog-node` 5.46.1 with pnpm; the dependencies and lockfile were updated.
- Added the Nuxt client plugin in `plugins/posthog.client.ts`. It initializes one browser client from runtime configuration, enables tracing headers and development debugging, captures Vue errors, and exposes the client through `useNuxtApp().$posthog`.
- Added public runtime configuration in `nuxt.config.ts` and documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`. The configured values are present in the local `.env`; no token or host is embedded in source code.
- Added the injected-client type declaration in `types/nuxt-app.d.ts`.

## Events instrumented

These are planned and instrumented call sites from `.posthog-wizard-cache/.posthog-events.json`. The run did not perform a browser delivery test, so none of these events was observed arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor successfully signs in to the movie app. | `pages/login.vue` |
| `logout_completed` | A signed-in visitor completes logout. | `components/NavBar.vue` |
| `media_search_submitted` | A visitor submits a new media search. | `pages/search.vue` |
| `trailer_played` | A visitor starts a featured media trailer. | `components/media/Hero.vue` |
| `video_played` | A visitor starts playback of a media video. | `components/video/Card.vue` |
| `media_section_selected` | A visitor switches among overview, videos, or photos on a media detail page. | `components/media/Details.vue` |

The captures are intentionally personless and use the browser SDK's anonymous identity. No server routes were instrumented because the available authentication value is a user-entered username, which is not an acceptable stable PostHog distinct ID.

## Identification status

User identification was skipped. The inspected login API, auth composable, serialized auth state, and logout flow expose only a username; no stable non-PII primary key, UUID, or resource identifier reaches the browser. If authentication later exposes a stable ID, identification still needs to be added after successful login and on authenticated refresh, with `reset()` during logout. Until then, the six events and captured errors remain anonymous.

## Error tracking

- `plugins/posthog.client.ts` retains the framework-level Vue error hook.
- `error.vue` captures non-404 global application errors with `captureException` through the initialized client. Expected 404 errors are excluded.
- No runtime error delivery was observed.

## Dashboard

The dashboard `Analytics basics (wizard)` exists with five tagged insights covering media engagement over time, the login-to-search funnel, trailer starts by media, detail-section engagement, and logout activity:

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1924686)

The dashboard and insight definitions were created successfully, but their tiles may remain empty until the app sends events. The run did not verify ingestion.

## Verification and unresolved issues

- Verified: dependency installation completed; `nuxi prepare` generated Nuxt types; `pnpm build` passed and produced the Nitro output; the PostHog plugin and capture call shapes compile.
- Verified: no PostHog-plugin, NavBar, or package-manifest lint errors remained after review.
- Not verified: browser delivery, event ingestion, error delivery, dashboard population, or runtime behavior with deployed environment variables.
- Build conflict: `pnpm typecheck` and `pnpm lint` remain non-green because of pre-existing errors outside the PostHog integration, principally the `proxy/nitro.config.ts` `defineNitroConfig` export error, existing errors in `composables/useAuth.ts`, `middleware/auth.global.ts`, and `server/api/auth/login.post.ts`, plus pre-existing login-template formatting warnings/errors in `pages/login.vue`. These were not introduced by the integration and were not changed.
- Unresolved attribution issue: the app has no stable non-PII authenticated identifier, so events cannot currently be attributed across anonymous and authenticated sessions. Leaving this unresolved means user-level funnels and returning-user analysis remain fragmented until the auth model exposes a suitable ID.

## Before you merge

- [ ] Run the deployed app through login, logout, search, trailer playback, video playback, and detail-section selection, then confirm the six named events arrive in PostHog; inspect the handlers in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Hero.vue`, `components/video/Card.vue`, and `components/media/Details.vue`.
- [ ] Confirm `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` are set in every deployment environment, not only `.env`; check the names in `.env.example` and the runtime mapping in `nuxt.config.ts`.
- [ ] Run the full production build and test suite, and fix any errors introduced by generated or instrumented code; the recorded build passed, but no test suite or browser test was run.
- [ ] Resolve or explicitly accept the pre-existing typecheck and lint failures in `proxy/nitro.config.ts`, `composables/useAuth.ts`, `middleware/auth.global.ts`, `server/api/auth/login.post.ts`, and the existing formatting issues in `pages/login.vue` before merging.
- [ ] If authentication gains a stable non-PII user ID, wire `identify()` after login and refresh and `reset()` on logout; review the auth boundary in `composables/useAuth.ts`, `pages/login.vue`, and `components/NavBar.vue` without using the current username.

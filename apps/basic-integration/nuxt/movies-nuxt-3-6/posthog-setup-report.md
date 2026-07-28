# PostHog setup report

PostHog browser analytics is initialized for Nuxt, six product events are instrumented, global Vue error capture is enabled, and a starter dashboard is available.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with pnpm; the lockfile resolves both SDKs.
- Added public runtime configuration in `nuxt.config.ts` and documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`.
- `plugins/posthog.client.ts` initializes one browser `posthog-js` client with the configured host, keeps default autocapture behavior, and exposes it through `useNuxtApp().$posthog`.
- Missing configuration throws a development diagnostic and leaves production as a no-op. The configured `.env` values were written through the wizard environment tooling.
- The six event captures use the anonymous browser distinct ID. No stable, non-PII account identifier is currently available.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor successfully completes the demo sign-in flow. | `composables/useAuth.ts` |
| `media_selected` | A visitor opens a movie or TV title from a media card. | `components/media/Card.vue` |
| `search_performed` | A visitor submits a media search without recording the entered query. | `pages/search.vue` |
| `media_tab_selected` | A visitor changes the content section on a media detail page. | `components/media/Details.vue` |
| `trailer_played` | A visitor starts a trailer from the media hero. | `components/media/Hero.vue` |
| `video_played` | A visitor starts a video from the videos tab. | `components/video/Card.vue` |

These events were verified as static capture call sites and recorded in the event plan. The run did **not** exercise the application or observe events arriving in PostHog, so delivery is unconfirmed.

## Identification status

User identification was skipped. The authentication response exposes only a user-entered, mutable username and no stable non-PII identifier. Using that username as a distinct ID would violate the identity contract. Until the auth model exposes a stable ID, events remain personless and use PostHog's anonymous browser ID. A future auth change should identify after login and on refresh, and reset before logout.

## Error tracking

`plugins/posthog.client.ts` registers Nuxt's global `vue:error` hook after initialization and calls `captureException(error)`. This wiring was reviewed, but runtime error delivery was not exercised.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918880) contains four tagged insights for media engagement, search activity, the login-to-media-to-trailer funnel, and detail-tab engagement. It is configured for the last 30 days and may initially be empty until events arrive.

## Verification and unresolved issues

- `pnpm build` passed before and after the review fixes.
- `pnpm typecheck` still fails on the pre-existing `proxy/nitro.config.ts(1,10): Module 'nitropack' has no exported member 'defineNitroConfig'` incompatibility.
- `pnpm lint` still fails on pre-existing style violations in `composables/useAuth.ts`, `pages/login.vue`, `middleware/auth.global.ts`, and `server/api/auth/login.post.ts`; the reviewed PostHog plugin and package manifest no longer report lint errors.
- No CSP was found, so no CSP changes were made.
- The unresolved auth attribution issue costs reliable user-level funnels and retention analysis: events cannot currently be tied to a stable authenticated account.
- No `DISTINCT_ID` placeholder was introduced; there is no placeholder call site to replace.

## Before you merge

- [ ] Run the full production build and confirm the generated integration remains clean; inspect `plugins/posthog.client.ts` and the instrumented files listed in the event table.
- [ ] Run the test suite and update mocks or fixtures for captures in `composables/useAuth.ts`, `pages/login.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, `components/media/Hero.vue`, and `components/video/Card.vue` if needed.
- [ ] Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in every deploy environment, matching `.env.example`; verify the runtime mapping in `nuxt.config.ts`.
- [ ] Resolve the existing typecheck conflict at `proxy/nitro.config.ts:1` and existing lint failures before treating CI as green.
- [ ] Trigger each instrumented action in a real browser and confirm the six named events arrive in PostHog; the run only verified code and definitions, not ingestion.
- [ ] If the auth model gains a stable account ID, wire identify on login and refresh and reset on logout at the auth boundaries in `composables/useAuth.ts` and the related login/logout flow.

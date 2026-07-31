# PostHog setup report

PostHog product analytics and client-side error tracking were added to the Nuxt 3.6 application, with seven planned interaction events and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.409.5` and `posthog-node` `^5.47.2` in `package.json`; the lockfile records resolved versions `1.409.5` and `5.47.2`.
- Added `runtimeConfig.public.posthog` in `nuxt.config.ts`, sourced from `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- Added the client-only singleton in `plugins/posthog.client.ts`, exposed through `useNuxtApp().$posthog`. Missing configuration remains a production no-op and reports the missing variable during development.
- Documented the environment variable names in `.env.example`; the configured local `.env` contains both keys.
- Default PostHog capture behavior remains enabled. No CSP changes were needed because the project has no CSP configuration.

## Events instrumented

These are instrumented event definitions, not confirmed deliveries. The run did not perform a browser runtime test or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `user_logged_out` | An authenticated visitor starts the logout flow. | `components/NavBar.vue` |
| `search_performed` | A visitor submits a movie or television search. | `pages/search.vue` |
| `media_detail_opened` | A visitor opens a movie or television title detail page; the same contract is also used for credit-list navigation. | `components/media/Card.vue` (also `components/person/CreditsList.vue`) |
| `media_tab_selected` | A visitor selects a detail tab for a movie or television title. | `components/media/Details.vue` |
| `video_played` | A visitor starts playback of a title video. | `components/video/Card.vue` |
| `photo_viewed` | A visitor opens a title or person photo in the image modal. | `components/photo/Modal.vue` |

Event properties were kept bounded and free of user-entered text or PII. The server API routes were not instrumented in this run.

## User identification

Identification was **skipped**. The login API and client auth state expose only a mutable username; the inspected flow has no immutable user ID, UUID, or resource identifier suitable for a stable distinct ID. Events therefore use the anonymous browser SDK identity, with no placeholder ID. If auth later exposes a stable ID, wire `identify()` after login and on authenticated refresh, and `reset()` before logout state is cleared.

This unresolved identity issue should be followed up rather than treated as a minor caveat: without a stable identifier, authenticated activity cannot reliably be attributed to a returning account, and cross-session/account-level analysis may fragment across anonymous IDs. The relevant auth sources are `server/api/auth/login.post.ts`, `composables/useAuth.ts`, `pages/login.vue`, `components/NavBar.vue`, and `server/api/auth/logout.post.ts`.

## Error tracking

`plugins/posthog.client.ts` registers Nuxt’s global `vue:error` hook after initialization and forwards uncaught Vue errors with `posthogClient.captureException(error)`. No separate `app.vue` boundary or manual component wrappers were added.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1935660)

The dashboard contains five wizard-tagged insights: sign-in activity, search activity, media-detail engagement, an ordered sign-in-to-search-to-detail funnel, and rich video/photo engagement. The insights are configured against the planned event names; their event data was not observed during this run.

## Verification and conflicts

- `pnpm install` completed successfully, the lockfile was current, and Nuxt preparation succeeded.
- `pnpm build` passed after the final review fixes. This verifies compilation and production build generation only; it does not verify that events flow to PostHog.
- `pnpm typecheck` remains blocked by an unrelated existing error in `proxy/nitro.config.ts`: `nitropack` does not export `defineNitroConfig`.
- `pnpm lint` remains blocked by existing style errors in `composables/useAuth.ts`, `middleware/auth.global.ts`, `pages/login.vue`, and `server/api/auth/login.post.ts`. The final review found no lint errors in the PostHog plugin or `package.json`.
- No browser startup, event-delivery check, or PostHog event-arrival observation was performed.

## Next steps

1. Provide an immutable account identifier in the auth response and persisted client state, then add login/refresh identification and logout reset.
2. Run the app in a real browser and exercise login, logout, search, detail, tab, video, and photo flows; confirm the seven event names arrive in PostHog.
3. Resolve the existing typecheck and lint failures, then rerun the full production build, typecheck, lint, and test suite.
4. Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`.

## Before you merge

- [ ] Run the full production build and confirm no integration-introduced errors; inspect `plugins/posthog.client.ts` and `nuxt.config.ts`.
- [ ] Run the test suite and update mocks or fixtures for the capture call sites in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, `components/video/Card.vue`, `components/photo/Modal.vue`, and `components/person/CreditsList.vue`.
- [ ] Configure `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in deployment environments; compare them with `.env.example` lines 1–2.
- [ ] Resolve the existing typecheck error at `proxy/nitro.config.ts` and existing lint errors in `composables/useAuth.ts`, `middleware/auth.global.ts`, `pages/login.vue`, and `server/api/auth/login.post.ts`.
- [ ] Add and verify stable user identification across `server/api/auth/login.post.ts`, `composables/useAuth.ts`, `pages/login.vue`, `components/NavBar.vue`, and `server/api/auth/logout.post.ts` before relying on account-level attribution.
- [ ] Exercise each instrumented interaction in a real browser and verify event arrival in PostHog; the passing build alone does not establish delivery.

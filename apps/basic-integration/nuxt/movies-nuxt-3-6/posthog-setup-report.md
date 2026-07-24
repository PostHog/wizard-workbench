# PostHog setup report

PostHog product analytics and browser error tracking were added to the Nuxt application, with five anonymous, non-PII product events and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.2 and `posthog-node` 5.46.1 with pnpm; the manifest and lockfile were updated.
- PostHog is initialized once in the browser-only `plugins/posthog.client.ts` plugin using the public runtime variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`, documented in `.env.example` and configured locally in `.env`.
- Client call sites use the shared `useNuxtApp().$posthog` instance. Autocapture remains at the SDK default, and exception autocapture is enabled.
- `posthog-node` is installed but is not imported by the current implementation; no server-side event capture was added.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `logout_requested` | An authenticated visitor initiates sign-out. | `components/NavBar.vue` |
| `search_submitted` | A visitor submits a media search without recording the entered query. | `pages/search.vue` |
| `media_selected` | A visitor opens a movie or television title from a media card. | `components/media/Card.vue` |
| `video_played` | A visitor starts a video trailer or clip from a media detail page. | `components/video/Card.vue` |

The run verified that these capture calls are present at the intended action boundaries and that their properties are limited to non-PII technical/media metadata. It did **not** observe events arriving in PostHog, so event delivery and populated insight results remain unconfirmed.

## User identification

Identification was skipped. The demo authentication state exposes only a mutable username and no stable account ID, UUID, or resource identifier suitable for a PostHog distinct ID. The captures therefore use anonymous browser attribution. Before account-level analytics can be trusted, the application needs a stable user ID; then identify it after successful login and on authenticated refresh, and reset before logout state is cleared. This unresolved attribution issue costs reliable cross-session user journeys and account-level conversion/retention analysis if left unresolved.

## Error tracking

The browser plugin now normalizes and captures errors from Nuxt's global `app:error` hook and Vue's `vue:error` hook. The run verified the integration code is present; it did not trigger an application error and observe an error event in PostHog, so delivery is unconfirmed. Server-side route error capture was not added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1901841)

The dashboard was created with four wizard-tagged insights: Core actions over time, Login to search engagement funnel, Search submissions by day, and Media and video engagement. The dashboard uses exactly the five instrumented event names. It is expected to remain empty until events arrive; the run did not verify populated data.

## Verification and build conflicts

- `pnpm install` completed successfully.
- `pnpm build` completed successfully and generated the Nitro server output. This proves the code compiles and builds; it does not prove that events or exceptions flow to PostHog.
- `pnpm typecheck` remains blocked by a pre-existing `proxy/nitro.config.ts` error importing unavailable `defineNitroConfig`.
- Lint has no remaining errors in the PostHog plugin, navigation component, media card, or manifest. Remaining failures are pre-existing in `composables/useAuth.ts`, `middleware/auth.global.ts`, and `server/api/auth/login.post.ts`, plus pre-existing whitespace/void-element warnings in `pages/login.vue`.
- No source-defined CSP was found. Deployment-level CSP headers were not inspectable, so CSP compatibility remains unconfirmed.

## Next steps

1. Provide a stable application-owned user ID at the login and authenticated-refresh boundaries, then add identify/reset without using the username.
2. Run the app through login, logout, search, media selection, and video playback, then confirm each event arrives in PostHog and that the dashboard populates.
3. Trigger a controlled client error and confirm error tracking receives it.
4. Check deployment CSP headers and browser console output for blocked PostHog requests.
5. Resolve the pre-existing typecheck and lint failures before merging.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by generated integration code; review `plugins/posthog.client.ts`, `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, and `components/video/Card.vue`.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, and `components/video/Card.vue`.
- [ ] Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in every deploy environment, not only `.env`; confirm the names in `.env.example` and `nuxt.config.ts`.
- [ ] If deployment CSP headers are enabled, load the app and check the browser console for CSP violations that could block the SDK.
- [ ] Replace the unresolved anonymous attribution with a stable user ID in the authentication flow before relying on account-level analytics; review the login and authenticated-refresh boundaries in `pages/login.vue` and the auth state in `composables/useAuth.ts`.

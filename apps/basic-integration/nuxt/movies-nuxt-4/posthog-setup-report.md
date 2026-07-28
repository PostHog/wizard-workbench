# PostHog setup report

PostHog was initialized for the Nuxt movie app with browser event tracking, global client-side Vue error capture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with npm; `package.json` and `package-lock.json` were updated.
- Added public runtime configuration in `nuxt.config.ts` using `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`.
- Added the browser-only client plugin at `plugins/posthog.client.ts`. It makes one `posthog.init` call, enables tracing headers, enables debug mode in development, and fails clearly for missing configuration in development while remaining a production no-op when configuration is absent.
- Added the required variable names to `.env.example` and configured the real values in the local `.env` file.
- No Content-Security-Policy was found in the inspected project files, so no CSP changes were made.

## Events instrumented

These captures were added to the browser action points. The run verified the call sites and event plan, but did **not** observe events arriving in PostHog; the dashboard is expected to remain empty until the app is exercised and events are ingested.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A demo user successfully completes the sign-in flow. | `pages/login.vue` |
| `logout_completed` | A signed-in user initiates logout. | `composables/useAuth.ts` |
| `search_submitted` | A visitor submits a changed movie or TV search. | `pages/search.vue` |
| `media_selected` | A visitor opens a movie or TV title from a media card. | `components/media/Card.vue` |
| `person_selected` | A visitor opens a person profile from a person card. | `components/person/Card.vue` |
| `video_played` | A visitor starts a title video in the embedded player. | `components/video/Card.vue` |

The event properties are limited to non-PII identifiers or categorical metadata (`media_id`, `media_type`, `person_id`, and `video_type`). Search text, titles, usernames, and other user-entered or content text are not sent as event properties.

## User identification

Identification was **skipped**. The authentication flow exposes only a user-entered username; no stable app-owned non-PII ID, UUID, or primary key was available. The username must not be used as a PostHog distinct ID. Consequently, the new captures remain anonymous/personless.

If the authentication model later exposes a stable user ID, wire `identify(userId)` after successful login and session hydration, and call `reset()` during logout before clearing identity. Until then, attribution across authenticated sessions cannot be established.

## Error tracking

`plugins/posthog.client.ts` registers Nuxt's global `vue:error` hook after initialization and sends exceptions through `posthogClient.captureException(error)`. This configures client-side Vue exception capture without adding manual error calls across components. No server-side error handling was added in this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918892)

The dashboard contains five `(wizard)`-tagged insights: a login-to-search funnel, search trend, media selections by type, people and titles explored trend, and video plays by type. The dashboard was created successfully, but no current event volume was required or observed.

## Verification and unresolved issues

- `npm install` completed successfully and Nuxt types were regenerated.
- Scoped lint for `plugins/posthog.client.ts` passed.
- The review found the PostHog initialization, error capture, and event calls type-safe. No event delivery was tested.
- `npm run typecheck` still reports two pre-existing errors: invalid emitted-event typing in `components/video/Card.nuxt.test.ts` and an invalid UnoCSS dynamic-rule shape in `unocss.config.ts`.
- `npm run lint` still reports cache/reference-file issues and other pre-existing source lint errors. Scoped review found pre-existing style errors in `pages/login.vue` and `composables/useAuth.ts`, not introduced by the PostHog calls.
- `npm run build` is blocked by a pre-existing dependency incompatibility in `node_modules/@nuxtjs/i18n`: the installed `unhead` package does not export `getActiveHead`. This prevents confirming a production build, and the conflict must be resolved before treating the application as build-verified.

## Before you merge

- [ ] Run a full production build and resolve the existing `@nuxtjs/i18n` / `unhead` `getActiveHead` incompatibility; the integration run could not verify a production build.
- [ ] Run the full test suite, including the instrumented call sites; review `components/video/Card.nuxt.test.ts` if its emitted-event typing still fails.
- [ ] Run lint and address the pre-existing style errors at the instrumented call sites, especially `pages/login.vue` and `composables/useAuth.ts`, as well as cache/reference-file lint configuration if appropriate.
- [ ] Confirm `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env`.
- [ ] Exercise login, logout, search, media selection, person selection, and video playback in a deployed or local app and confirm the corresponding events arrive in PostHog; the run itself observed no event delivery.
- [ ] If a stable non-PII account ID becomes available, add identification after login and session hydration and reset on logout; do not use the username in `composables/useAuth.ts` or `pages/login.vue` as the distinct ID.

# PostHog setup report

PostHog product analytics and client-side error tracking were initialized for the Nuxt app, with seven user-action events instrumented and a starter dashboard created.

## What was installed and initialized

- Installed `posthog-js` `^1.407.8` and `posthog-node` `^5.46.1` using npm; the packages were added to `package.json` and `package-lock.json`.
- Added public runtime configuration in `nuxt.config.ts` and documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`. Both environment keys were configured locally during the run.
- Added the client-only initializer in `plugins/posthog.client.ts`. It initializes `posthog-js` once, uses tracing headers for same-origin requests, exposes `$posthog` through `useNuxtApp()`, and keeps missing configuration from breaking production while reporting missing configuration during development.
- Added the Nuxt app type declaration in `types/nuxt-app.d.ts`.
- No Content-Security-Policy was present, so no CSP changes were needed.

## Events instrumented

These capture calls were added at real browser action points. The run verified that each manifest event has a corresponding capture call; it did **not** exercise the browser or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `search_submitted` | A visitor submits a media search from the search page. | `pages/search.vue` |
| `media_selected` | A visitor opens a movie or TV media detail page. | `components/media/Card.vue` |
| `trailer_played` | A visitor opens a featured media trailer. | `components/media/Hero.vue` |
| `video_played` | A visitor opens a video from a media detail page. | `components/video/Card.vue` |
| `locale_changed` | A visitor changes the application language. | `components/LanguageSwitcher.vue` |
| `logout_completed` | A visitor chooses to leave the demo session. | `components/NavBar.vue` |

Event properties are limited to bounded media/video type values. No usernames, search terms, titles, or other user-entered content are sent as event properties.

## User identification

User identification was **skipped**. The authentication flow exposes only a username string through the `auth-user` cookie and login response; no stable, non-PII account identifier, UUID, or resource ID is available. The username was not used as a PostHog distinct ID. Events therefore use PostHog's anonymous/session context. If authentication later exposes a stable user ID, wire identification on successful login and hydration, and call `reset()` on logout.

## Error tracking

`plugins/posthog.client.ts` captures both Nuxt `vue:error` and `app:error` errors with `posthogClient.captureException(error)`. The run verified the hooks are present in the plugin; it did not observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924685) was created with five insight tiles covering core activity, search submissions, media engagement, content playback, and locale changes. The dashboard is configured to populate as events arrive; the run did not confirm event data in those tiles.

## Verification and unresolved issues

- `npm install` completed successfully, including Nuxt prepare.
- The production build was **not successful**: it reached client transformation (297 modules) and then failed on the pre-existing `@nuxtjs/i18n`/`unhead` compatibility error: `getActiveHead is not exported by unhead`.
- Typecheck failed only at pre-existing `components/video/Card.nuxt.test.ts` and `unocss.config.ts` errors.
- Lint failed on existing repository violations and wizard cache/reference files. The changed PostHog plugin no longer appeared among lint errors after its import-order and development-debug-style fix.
- No automated browser run or live PostHog delivery verification was performed. A passing install or partial build would not prove that events are captured.
- `posthog-node` was installed but remains unused because no server-side event capture was implemented.

The unresolved build, typecheck, and lint conflicts cost release verification: the integration's compilation and repository cleanliness cannot be certified until those pre-existing failures are addressed or excluded appropriately.

## Before you merge

- [ ] Run a full production build and resolve the pre-existing `@nuxtjs/i18n`/`unhead` error (`getActiveHead is not exported by unhead`); the relevant dependency/configuration issue should be reviewed alongside the build output.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures, especially around `pages/login.vue`, `pages/search.vue`, and the media/video components listed above.
- [ ] Confirm `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`.
- [ ] Manually exercise the seven action handlers in `pages/login.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Hero.vue`, `components/video/Card.vue`, `components/LanguageSwitcher.vue`, and `components/NavBar.vue`, then confirm the corresponding events appear in PostHog.
- [ ] If authentication gains a stable non-PII user ID, update the login/session and logout paths to identify on login and hydration and reset on logout; currently identification is intentionally skipped.

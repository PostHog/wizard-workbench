# PostHog setup report

PostHog product analytics and error tracking were added to the Nuxt Movies app, with eight client events planned, a starter dashboard created, and configuration documented for deployment.

## Installed and initialized

- Installed `posthog-js` `^1.407.3` and `posthog-node` `^5.46.1` with npm. The lockfile resolves both published versions.
- Added public runtime configuration in `nuxt.config.ts` and a browser-only `plugins/posthog.client.ts` plugin. The app exposes the initialized singleton through `useNuxtApp().$posthog`, with PostHog tracing headers enabled.
- Added the `types/nuxt-app.d.ts` type augmentation.
- Added `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` to `.env.example`; both keys were confirmed present in the local `.env` using the environment-key check.
- No CSP directives were found in the searched project files, so no CSP changes were needed.

## Events instrumented

These are instrumented in code according to `.posthog-wizard-cache/.posthog-events.json`. The run did not start the app or observe events arriving in PostHog, so capture is **not verified**.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor successfully completes the demo login form. | `pages/login.vue` |
| `login_failed` | A visitor submits the login form but authentication fails. | `pages/login.vue` |
| `search_submitted` | A visitor submits a new media search without recording the search text. | `pages/search.vue` |
| `trailer_played` | A visitor opens a featured media trailer. | `components/media/Hero.vue` |
| `video_played` | A visitor opens a video from a media video list. | `components/video/Card.vue` |
| `media_details_tab_selected` | A visitor switches tabs on a media detail page. | `components/media/Details.vue` |
| `person_details_tab_selected` | A visitor switches tabs on a person detail page. | `components/person/Details.vue` |
| `logout_completed` | A visitor completes the demo logout action. | `components/NavBar.vue` |

Event properties are limited to non-PII categorical values: `media_type`, `video_type`, and `tab`. Search text and usernames are not captured.

## Identity status and unresolved issue

User identification was skipped. The demo authentication flow only exposes a mutable username and does not provide a stable primary key, UUID, or other durable client-side identifier. Events are therefore currently anonymous/personless.

**Follow-up issue:** if the authentication model remains username-only, event attribution cannot reliably distinguish returning users or account changes. When a stable user ID becomes available, wire `identify(stableUserId, personProperties)` after successful login and authenticated initial hydration, and call `reset()` during logout before clearing user state. No `DISTINCT_ID` placeholder was added anywhere.

## Error tracking

- `plugins/posthog.client.ts` captures Vue errors through Nuxt's global `vue:error` hook.
- `error.vue` captures the global Nuxt error-page error once on mount using `captureException`.
- The run did not start the app or observe an error event in PostHog; error delivery is therefore unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914280) was created in PostHog project `483112` with four wizard-tagged insights: authentication activity, media discovery activity, media detail engagement, and a login-to-media-exploration funnel. The insights intentionally use the planned event names and may be empty until events arrive.

## Verification and build conflict

Verified by the run:

- npm installation completed successfully.
- Nuxt prepare generated types.
- The edited integration files were reviewed, and the client plugin no longer produced lint findings after two style fixes.
- Event names use lower snake case, captures are in user-action handlers rather than page load, and capture properties contain no PII.
- PostHog environment-key presence was confirmed.

Not verified:

- No app startup, browser flow, live event delivery, or PostHog Error Tracking delivery was observed.
- No stable user identification was wired.

Build and validation remain blocked by existing project issues:

- `npm run build` fails before application integration compilation because `@nuxtjs/i18n` imports `getActiveHead`, which the installed `unhead` package does not export.
- `npm run typecheck` fails in pre-existing `components/video/Card.nuxt.test.ts` and `unocss.config.ts`.
- `npm run lint` fails across pre-existing project files and wizard-cache scaffolding/reference files, including `queue.json`, reference markdown, `useAuth.ts`, `unocss.config.ts`, and an existing Card test. The PostHog plugin itself no longer reports a lint finding.

The review classified the Nuxt/i18n/unhead incompatibility and unrelated typecheck/lint findings as pre-existing because their reported source files are outside the integration changeset.

## Next steps

1. Resolve the `@nuxtjs/i18n` and `unhead` compatibility issue, then run a full production build.
2. Run the test suite and fix any mocks or fixtures affected by the instrumented call sites.
3. Exercise login success/failure, search, trailer/video playback, detail tabs, and logout in a real browser session, then confirm the eight events arrive in PostHog and populate the dashboard.
4. Trigger the global error boundary and confirm the error appears in PostHog Error Tracking.
5. Decide how the authentication model will expose a stable user ID before adding `identify` and logout `reset`.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; the current build is blocked by the `@nuxtjs/i18n`/`unhead` conflict documented above. Review `nuxt.config.ts`, `plugins/posthog.client.ts`, and the instrumented Vue files if failures point there.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites, especially the files listed in `.posthog-wizard-cache/.posthog-events.json`.
- [ ] Confirm the exact variables `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`.
- [ ] Exercise every instrumented action and verify event delivery in PostHog; inspect the capture calls in `pages/login.vue`, `pages/search.vue`, `components/NavBar.vue`, `components/media/Hero.vue`, `components/video/Card.vue`, `components/media/Details.vue`, and `components/person/Details.vue`.
- [ ] If authentication gains a stable ID, add identification after login and authenticated hydration and reset on logout; review `pages/login.vue`, `components/NavBar.vue`, and `composables/useAuth.ts`.
- [ ] Trigger the Nuxt global error page and verify Error Tracking; review `error.vue` and `plugins/posthog.client.ts`.

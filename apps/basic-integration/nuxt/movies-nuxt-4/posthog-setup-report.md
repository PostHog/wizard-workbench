# PostHog setup report

PostHog product analytics was initialized for the Nuxt application with six client-side action events, global client error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with npm; the versions are recorded in `package.json` and `package-lock.json`.
- Added public runtime configuration in `nuxt.config.ts` and initialized the browser SDK once in `plugins/posthog.client.ts` through `useNuxtApp().$posthog`.
- The configured environment keys are `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`, documented in `.env.example` and present in the local environment. The SDK uses runtime configuration, tracing headers, and development debug logging.
- Captures intentionally exclude usernames, search text, titles, and other user-entered or identifying content.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `logout_completed` | A signed-in visitor initiates logout. | `components/NavBar.vue` |
| `search_submitted` | A visitor submits a media search without recording the entered query. | `pages/search.vue` |
| `media_opened` | A visitor opens a movie or TV media detail page. | `components/media/Card.vue` |
| `media_tab_selected` | A visitor selects a media detail tab. | `components/media/Details.vue` |
| `video_played` | A visitor starts a trailer or other media video. | `components/video/Card.vue` |

These event names and call sites were verified in the run. The run did **not** observe events arriving in PostHog; the passing targeted lint and the typecheck result only establish code-level validation, not event delivery.

## Identification status

User identification was skipped. The application exposes only a mutable username and no immutable account ID, UUID, or other stable identifier to the client. All events therefore remain anonymous/personless. Do not use the username as a distinct ID. Once a genuine stable user ID is available, wire `identify` on login and session restoration and `reset` before logout state is cleared, following the identify handoff.

## Error tracking

`plugins/posthog.client.ts` captures both Nuxt `vue:error` and `app:error` hook failures with `captureException` through the initialized client. Server-side error tracking was not added. The run did not trigger an error and confirm ingestion.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918301)

The dashboard contains three `(wizard)` insights: engagement events over time, a sign-in-to-media-discovery funnel, and media detail tabs selected. They were created from the event contract and are expected to populate as events arrive; the run did not verify populated data.

## Verification and unresolved issues

- SDK installation completed successfully, and the package manifest and lockfile contain both dependencies.
- The PostHog-specific type errors were fixed; targeted ESLint for `plugins/posthog.client.ts` completed with no output.
- Typecheck still reports pre-existing errors in `components/video/Card.nuxt.test.ts` and `unocss.config.ts`.
- The production build failed before compiling the application integration because of the pre-existing `@nuxtjs/i18n`/`unhead` incompatibility. Repository-wide lint also reports existing violations, including wizard-cache inputs and unrelated source files. These failures were not caused by the PostHog changes according to the review handoff.
- **Unresolved attribution:** no stable authenticated-user identifier reaches the client. If left unresolved, authenticated activity cannot be reliably tied to a person across sessions and remains fragmented across anonymous IDs. The affected auth sources are `server/api/auth/login.post.ts` and `composables/useAuth.ts`; the identification call sites to add later are the login/session-restoration and logout paths described in those handoffs.

## Before you merge

- [ ] Run a full production build and resolve any errors introduced by the integration; inspect `plugins/posthog.client.ts` and distinguish PostHog errors from the existing `@nuxtjs/i18n`/`unhead` conflict.
- [ ] Run the test suite and update mocks or fixtures for the capture calls in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, and `components/video/Card.vue` if needed.
- [ ] Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names in `.env.example` and `nuxt.config.ts`.
- [ ] Decide on and expose an immutable authenticated-user ID in `server/api/auth/login.post.ts` and `composables/useAuth.ts`, then add `identify` on login/session restoration and `reset` before logout; do not substitute the mutable username.
- [ ] After deployment, exercise each instrumented action and confirm the six named events arrive in PostHog; the run itself did not verify ingestion.

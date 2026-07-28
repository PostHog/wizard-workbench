# PostHog setup report

PostHog was installed and initialized for the Nuxt Movies application, with four anonymous product events, client-side error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` 1.407.5 and `posthog-node` 5.46.1 with npm; both are recorded in `package.json` and `package-lock.json`.
- Added the single client-side initialization point in `plugins/posthog.client.ts`. It reads the public project token and host through Nuxt runtime configuration, initializes PostHog once, provides the shared client as `$posthog`, and captures Vue and global Nuxt application errors.
- Added `posthog.projectToken` and `posthog.host` public runtime configuration in `nuxt.config.ts`.
- Documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`; the configured values were also present in the local environment during the run.
- No Content-Security-Policy was present, so no CSP changes were needed.

## Events instrumented

These call sites were added and verified by code review. The run did **not** browser-test delivery, so no event is claimed as captured or observed in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `logout_completed` | A visitor completes the logout flow. | `components/NavBar.vue` |
| `search_submitted` | A visitor submits a non-empty media search. | `pages/search.vue` |
| `trailer_played` | A visitor starts playing a trailer or other video. | `components/video/Card.vue` |

Event properties contain only bounded video-type metadata for `trailer_played`; no user-entered content or PII was added to event properties.

## User identification

Identification was skipped. The application currently exposes only a mutable, user-entered username through its authentication flow; no stable, non-PII account ID, UUID, or resource ID reaches client state. The four product events therefore remain intentionally anonymous, and captured errors cannot inherit an authenticated person identity.

### Follow-up issue: stable attribution is unresolved

The authentication contract must expose a deliberate stable, non-PII user ID before these events can be meaningfully attributed. Leaving this unresolved fragments authenticated activity into anonymous identities and prevents reliable user-level analysis. After that change, wire `identify()` after successful login and on restored authenticated client sessions, and call `reset()` during logout. The relevant integration call sites are `pages/login.vue`, `components/NavBar.vue`, and the shared initialization point `plugins/posthog.client.ts`.

## Error tracking

`plugins/posthog.client.ts` captures both Nuxt `vue:error` and global `app:error` exceptions through PostHog's `captureException`. This configuration was verified by code review; runtime delivery of errors was not browser-tested.

## Dashboard

The **Analytics basics (wizard)** dashboard is live with four attached insights: daily successful logins, daily search submissions, daily trailer plays, and a login-to-search conversion funnel. The insights use a 30-day range and may be empty until events arrive.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1919799)

## Verification and conflicts

- npm installation completed successfully, and Nuxt prepare generated types.
- The PostHog-specific TypeScript errors were fixed by explicitly typing the provided client as `PostHog | undefined` in `plugins/posthog.client.ts`.
- No browser session was run, so event delivery, exception delivery, and dashboard population remain unconfirmed.
- The production build fails because `@nuxtjs/i18n` imports missing `getActiveHead` from `unhead`; the review recorded this as a pre-existing incompatibility outside the PostHog changeset.
- Typecheck still reports pre-existing errors in `components/video/Card.nuxt.test.ts` and `unocss.config.ts`.
- Repository-wide lint still fails on pre-existing project and wizard-cache files; the changed PostHog plugin has no remaining lint errors.
- npm installation emitted a pre-existing optional peer-dependency warning involving `@bomb.sh/tab` and `citty`, but installation completed.

## Next steps

1. Expose a stable, non-PII identifier from authentication and add identify/reset behavior at the login, restored-session, and logout boundaries.
2. Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; keep the names documented in `.env.example`.
3. Run the app in a browser, exercise login, search, trailer playback, and logout, and confirm the four named events arrive in PostHog and populate the dashboard.
4. Trigger a controlled client error and confirm it appears in PostHog Error Tracking.
5. Resolve the existing build, typecheck, and lint failures before treating the integration as production-ready.

## Before you merge

- [ ] Run a full production build and resolve the pre-existing `@nuxtjs/i18n`/`unhead` `getActiveHead` conflict.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` are set in deployment environments and remain documented in `.env.example`.
- [ ] Resolve the pre-existing typecheck errors in `components/video/Card.nuxt.test.ts` and `unocss.config.ts`, plus repository-wide lint failures.
- [ ] In a browser, verify the four event call sites in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, and `components/video/Card.vue` send events to PostHog.
- [ ] If authenticated attribution is required, expose a stable user ID and update `pages/login.vue`, `components/NavBar.vue`, and `plugins/posthog.client.ts` with identify/reset and restored-session identification before merging.

# PostHog setup report

PostHog product analytics, browser error tracking, and a starter analytics dashboard were added to the Nuxt application.

## Installed and initialized

- Installed `posthog-js` (`^1.407.2`) and `posthog-node` (`^5.46.1`) with npm; both are recorded in `package.json` and `package-lock.json`.
- Added the client-only initialization in `plugins/posthog.client.ts`. It reads the public project token and host from Nuxt runtime configuration, initializes `posthog-js` once, enables tracing headers, provides `$posthog` to Nuxt call sites, and preserves the development missing-configuration error guard with a production no-op.
- Added public runtime configuration in `nuxt.config.ts` and documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`. The real values were configured in `.env` during the run.
- The SDK plugin passed targeted ESLint. No browser session was run, so event delivery was not observed.

## Instrumented events

| Event | Measures | File |
|---|---|---|
| `login_completed` | A visitor successfully completes the demo sign-in flow. | `pages/login.vue` |
| `logout_completed` | An authenticated visitor initiates the logout flow. | `components/NavBar.vue` |
| `search_submitted` | A visitor submits a new title search. | `pages/search.vue` |
| `media_selected` | A visitor selects a movie or television title from a media card. | `components/media/Card.vue` |
| `media_detail_tab_selected` | A visitor switches between overview, videos, and photos on a title detail page. | `components/media/Details.vue` |
| `video_playback_started` | A visitor starts a trailer or other video from a title detail page. | `components/video/Card.vue` |
| `person_detail_tab_selected` | A visitor switches between known-for, credits, and photos on a person detail page. | `components/person/Details.vue` |

The event properties are limited to non-PII TMDB identifiers, media type, video type, and selected tab. No user-entered search text, username, password, title, or person name is sent in event properties.

## Identity status

User identification and reset were **not wired**. The authentication flow currently exposes only a user-entered, mutable username (`composables/useAuth.ts` and `server/api/auth/login.post.ts`), not a stable non-PII account identifier. The seven browser events therefore remain personless rather than using a fabricated or mutable distinct ID. A stable internal ID or UUID must be exposed before adding `identify()` after login and persisted-session restoration, or `reset()` on logout.

## Error tracking

`plugins/posthog.client.ts` registers Nuxt's global `vue:error` hook after initialization and calls `captureException(error)`. This covers client-side Vue errors centrally. Server-side uncaught exception handling was not added. The run verified the hook in the source; it did not trigger an error and observe an Error Tracking event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902662) contains four `(wizard)` insights covering core activity, media engagement by type, discovery-to-detail conversion, and detail exploration. The dashboard and insight definitions were created successfully, but the run did not observe newly instrumented events populating them.

## Verification and conflicts

- `npm install` completed successfully; the declared SDK dependencies resolved.
- `npx eslint plugins/posthog.client.ts` completed successfully.
- `npm run build` failed before application integration compilation because `@nuxtjs/i18n` imports missing `getActiveHead` from `unhead`.
- `npm run typecheck` failed on pre-existing errors in `components/video/Card.nuxt.test.ts` and `unocss.config.ts`.
- `npm run lint` reported extensive pre-existing errors in wizard-cache and application files.
- No event capture, error arrival, or dashboard data ingestion was observed during this run.

## Open issue

The authentication attribution remains unresolved: there is no stable non-PII user ID available to connect events across sessions. If left unresolved, the dashboard will retain anonymous/personless activity rather than reliable authenticated-user attribution. Resolve this in `composables/useAuth.ts` and `server/api/auth/login.post.ts` before adding identity calls.

## Next steps

1. Fix the existing `@nuxtjs/i18n`/`unhead` export mismatch, then rerun the production build.
2. Fix the pre-existing typecheck and whole-project lint failures and rerun both checks.
3. Run the test suite and update mocks or fixtures for the instrumented call sites.
4. Set both documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` values in every deployment environment, not only local `.env`.
5. Add a stable non-PII account identifier to the auth response/state, then wire login/session `identify()` and logout `reset()`.
6. Exercise login, search, selection, playback, tabs, and logout in a real browser and confirm the seven events arrive in PostHog and populate the dashboard.
7. Trigger a client Vue error and confirm it appears in PostHog Error Tracking.

## Before you merge

- [ ] Run the full production build and resolve the existing `@nuxtjs/i18n`/`unhead` failure; inspect `nuxt.config.ts` and the dependency versions in `package.json`.
- [ ] Run the test suite and update any affected mocks or fixtures at the instrumented handlers in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, `components/video/Card.vue`, and `components/person/Details.vue`.
- [ ] Run full typecheck and lint, fixing errors while confirming the generated integration remains clean; inspect `components/video/Card.nuxt.test.ts`, `unocss.config.ts`, and the changed PostHog files.
- [ ] Configure `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in deployment environments as documented in `.env.example` and consumed by `nuxt.config.ts`.
- [ ] If authenticated attribution is required, add a stable non-PII identifier through `composables/useAuth.ts` and `server/api/auth/login.post.ts`, then add identify/reset behavior before merging.
- [ ] Exercise the changed event handlers and the `vue:error` hook in a browser, then verify event and error arrival in PostHog rather than relying on a passing build.

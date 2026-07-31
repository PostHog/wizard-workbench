# PostHog setup report

**Summary:** PostHog browser analytics was initialized for Nuxt, six anonymous product events were instrumented, global Vue error capture was enabled, and a starter dashboard was created.

## Installed and initialized

- Installed `posthog-js` `^1.409.5` and `posthog-node` `^5.47.2` with npm; the lockfile was updated successfully.
- Added public runtime configuration in `nuxt.config.ts` and documented `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in `.env.example`. The configured values are present in the local `.env` through the wizard environment flow.
- Added the browser-only `plugins/posthog.client.ts` plugin. It initializes the client once, provides it as `$posthog`, adds same-origin tracing headers, and guards missing configuration.
- The run verified instrumentation and source changes, but did **not** observe events arriving in PostHog because no application/browser delivery test was run.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | Successful sign-in through the demo login form | `pages/login.vue` |
| `logout_requested` | An authenticated visitor selecting logout | `components/NavBar.vue` |
| `media_search_performed` | A completed media search, without recording search text | `pages/search.vue` |
| `trailer_opened` | Opening a featured media trailer | `components/media/Hero.vue` |
| `video_opened` | Opening a media video | `components/video/Card.vue` |
| `media_details_tab_selected` | Switching between overview, videos, and photos on media details | `components/media/Details.vue` |

The capture plan uses non-PII media identifiers/types and selected tabs. User-entered search text and usernames are not event properties.

## Identity

User identification was **skipped**. The authentication flow exposes only a mutable username and no stable app-owned ID, UUID, or resource identifier. The events therefore remain personless/anonymous. If a stable identifier becomes available, wire `identify` after successful login and during hydration for an existing session, and call `reset` before clearing auth state on logout. Do not use the username as the distinct ID.

## Error tracking

Global client-side Vue error tracking is present in `plugins/posthog.client.ts` via Nuxt’s `vue:error` hook and `posthogClient.captureException(error)`. This was already present and required no additional change. Server-route error instrumentation was not added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935656)

The dashboard contains four starter insights: Login activity, Media search activity, Media engagement actions, and Login to search funnel. They use the planned event names and a 30-day range. The dashboard was created successfully, but its population from this run is unconfirmed because event delivery was not exercised.

## Verification and conflicts

- `npm install` completed successfully.
- The production build was run twice and failed both times in untouched `@nuxtjs/i18n` runtime code because `unhead` does not export `getActiveHead`.
- Typecheck failed on the pre-existing `components/video/Card.nuxt.test.ts` emitted-event typing and `unocss.config.ts` `Rule` typing.
- Lint reported the fixed PostHog plugin issues plus numerous pre-existing errors in scaffold/reference files and unrelated application files. No PostHog integration event/capture error was reported after the plugin fix.
- These build, typecheck, and lint failures were not attributable to the reviewed PostHog integration.
- No direct PostHog event delivery was observed, and no CSP check was needed because the review found no Content-Security-Policy.

## Unresolved issues to follow up

1. **Stable attribution is unresolved.** The login flow has no stable identifier, so all six events can only be attributed to anonymous browser identities. Leaving this unresolved prevents reliable user-level login/search journeys and returning-user attribution. Review `composables/useAuth.ts`, `pages/login.vue`, `components/NavBar.vue`, and `server/api/auth/login.post.ts` before adding a stable ID to the auth response and wiring `identify`/`reset`.
2. **Event delivery is unconfirmed.** The run did not start the app or execute browser tests, so successful compilation/source review does not prove captures reach PostHog. Exercise the handlers and inspect the dashboard before relying on the metrics.

## Next steps

- Resolve the existing `@nuxtjs/i18n`/`unhead` build conflict and unrelated type/lint failures.
- Set the documented public environment variables in every deployment environment, not only local `.env`.
- Run the app and trigger each instrumented action; confirm the six event names appear in PostHog and that dashboard tiles populate.
- Add a stable authentication identifier, then wire identification for login and returning sessions plus reset on logout.

## Before you merge

- [ ] Run a full production build and fix any errors introduced by the integration; separately resolve the existing `@nuxtjs/i18n`/`unhead` `getActiveHead` conflict.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Confirm `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` from `.env.example` are set in each deploy environment.
- [ ] Start the app, trigger all six actions, and verify events arrive in PostHog and populate the dashboard.
- [ ] If stable auth identity is added, update `composables/useAuth.ts`, `pages/login.vue`, `components/NavBar.vue`, and `server/api/auth/login.post.ts` consistently, then verify `identify` on login/returning sessions and `reset` on logout.

# PostHog setup report

PostHog was added to the Nuxt Movies app with browser initialization, seven client-side event contracts, centralized client error capture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.408.0` and `posthog-node` `^5.46.1` with npm; `package.json` and `package-lock.json` were updated.
- `plugins/posthog.client.ts` initializes `posthog-js` once in the browser from `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST`, enables tracing headers, and exposes the client through `useNuxtApp()`.
- The same plugin guards missing configuration: development fails with a descriptive error, while production provides no PostHog client. The real values were stored in local `.env`; `.env.example` documents the variable names.
- No CSP changes were made because this project does not ship a Content-Security-Policy.

## Events instrumented

These events are implemented at the listed action boundaries. The run did not start the app or observe events arriving in PostHog, so ingestion is **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor successfully signs in through the demo login form. | `pages/login.vue` |
| `user_login_failed` | A sign-in attempt is rejected by the authentication flow. | `pages/login.vue` |
| `user_logged_out` | An authenticated visitor signs out from navigation. | `components/NavBar.vue` |
| `search_submitted` | A visitor submits a movie or TV search without recording search text. | `pages/search.vue` |
| `media_opened` | A visitor opens a movie or TV title detail page from a media card. | `components/media/Card.vue` |
| `media_tab_selected` | A visitor changes the selected tab on a media detail page. | `components/media/Details.vue` |
| `video_played` | A visitor starts playback of a media video. | `components/video/Card.vue` |

Event properties are limited to non-PII contextual values such as media identifiers, media type, video type, and the selected tab; user-entered search text, titles, video names, and usernames are excluded.

## Identification status

User identification was **skipped**. The current authentication flow exposes only a mutable username to the browser and provides no stable non-PII user ID, UUID, or equivalent identifier. The seven events are therefore intentionally personless browser events. No `identify()` or logout `reset()` wiring was added.

### Follow-up issue: stable attribution is unresolved

The application has no stable non-PII identifier available to the client. If this remains unresolved, authenticated activity can remain fragmented across anonymous PostHog identities and cannot be reliably attributed to application users. A future auth-model/API change should expose a stable ID, then wire identification on successful login and authenticated hydration/refresh, with reset during logout. No `DISTINCT_ID` placeholder was introduced at any call site.

## Error tracking

`plugins/posthog.client.ts` captures exceptions through both Nuxt's global `vue:error` and `app:error` hooks using `posthogClient.captureException(error)`. The run verified the code path and typecheck behavior, but did not run the app or observe an exception arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926623) was created with four saved insights: daily user activity, media engagement by `media_type`, video plays by `video_type`, and a search-to-media-to-video funnel. The dashboard and insights were confirmed saved by PostHog; their charts may initially be empty until events are ingested.

## Verification and conflicts

- npm installation completed successfully; npm reported pre-existing peer/deprecation warnings.
- Typecheck completed with PostHog-related errors resolved. Remaining typecheck errors were pre-existing in `components/video/Card.nuxt.test.ts` and `unocss.config.ts`.
- Production build was not clean: it failed because `@nuxtjs/i18n` imports missing `getActiveHead` from `unhead`. The review identified this as a pre-existing `@nuxtjs/i18n`/`unhead` dependency incompatibility, not an integration error.
- Lint remained blocked by pre-existing errors in `.posthog-wizard-cache` reference/skill files and unrelated project files.
- No browser startup, test suite, or live event-delivery verification was run. A passing typecheck does not prove events flow.

## Next steps

1. Resolve the existing `@nuxtjs/i18n`/`unhead` build incompatibility, then run a full production build.
2. Run the test suite and address any mock or fixture changes required by the new `$posthog` calls.
3. Configure the documented environment variables in every deployment environment, not only local `.env`.
4. Deliberately add a stable non-PII auth identifier before wiring `identify()`/`reset()`.
5. Exercise each instrumented action in a real browser session and confirm the seven event names arrive in PostHog; then inspect the dashboard.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors generated by the integration; the recorded build is still blocked by the pre-existing `@nuxtjs/i18n`/`unhead` incompatibility. Look at `package.json`, `nuxt.config.ts`, and `plugins/posthog.client.ts`.
- [ ] Run the test suite and update mocks or fixtures if needed. Review the instrumented call sites in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, and `components/video/Card.vue`.
- [ ] Set `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NUXT_PUBLIC_POSTHOG_HOST` in deployment environments, matching `.env.example`; do not rely on local `.env`.
- [ ] Confirm the seven events arrive in PostHog by exercising their action boundaries in `pages/login.vue`, `components/NavBar.vue`, `pages/search.vue`, `components/media/Card.vue`, `components/media/Details.vue`, and `components/video/Card.vue`.
- [ ] Decide how to expose a stable non-PII user ID in the auth response/state, then implement identification and logout reset in `pages/login.vue`, `composables/useAuth.ts`, and `components/NavBar.vue` if reliable attribution is required.

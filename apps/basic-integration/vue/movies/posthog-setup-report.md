# PostHog setup report

PostHog product analytics and Vue error tracking were added to the Vue Movies app, with five interaction events and a starter dashboard configured.

## What was installed and initialized

- Installed `posthog-js` 1.407.5 with npm; the dependency is recorded in `package.json` and `package-lock.json`.
- Initialized the browser singleton once in `src/main.js`, before the Vue app mounts, using `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST`.
- Added `.env.example` documenting both environment variable names. The real values are configured locally in `.env`.
- Missing configuration remains a production no-op and emits an actionable, per-variable development error rather than silently disabling analytics.
- PostHog's default capture behavior was retained. No Content-Security-Policy was found in `index.html`.

## Events instrumented

These are the planned and instrumented event contracts recorded by the run. The run did not browser-test delivery, so none of these should be treated as confirmed received by PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A visitor successfully signs in through the demo login form. | `src/views/LoginView.vue` |
| `logout_completed` | A signed-in visitor explicitly ends their session. | `src/components/NavBar.vue` |
| `media_search_completed` | A visitor submits a search that returns movie or TV results. | `src/views/SearchView.vue` |
| `media_selected` | A visitor opens a movie or TV title from a media card. | `src/components/media/MediaCard.vue` |
| `media_trailer_opened` | A visitor opens a trailer for a movie or TV title. | `src/components/media/MediaHero.vue` |

The shared media-card event also covers selections from search, carousels, and recommendations. Trailer captures share one contract across supported placements. Event properties were kept personless and limited to media identifiers/types, result count, source, or placement.

## User identification

Identification was intentionally skipped. The demo authentication flow only provides a mutable, user-entered username in local storage and no stable account ID, UUID, or other acceptable identifier. Using the username as the PostHog distinct ID would violate the analytics identity contract.

**Follow-up issue:** Until the app supplies a stable user identifier, events and errors cannot be reliably attributed across sessions or accounts. When one exists, wire `posthog.identify(stableUserId, personProperties)` after login and session restoration, and `posthog.reset()` on logout; do not use the username as the distinct ID.

## Error tracking

Vue's global `app.config.errorHandler` was added in `src/main.js`. It calls `posthog.captureException(error)` when PostHog has valid configuration and preserves the production no-op behavior when configuration is absent. No manual component or route wrappers were added. Error delivery was not browser-tested.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919867) contains four saved insight tiles:

- Media discovery activity trends
- Authentication-to-trailer conversion funnel
- Media selections by type
- Trailer engagement by placement

The dashboard and insights were created successfully, but may initially be empty because event delivery was not observed during this run.

## Verification and conflicts

- `npm install` completed successfully.
- `npm run build` completed successfully: Vite transformed 59 modules and produced the `dist` assets.
- The build verifies compilation only; it does not prove that events or exceptions arrive in PostHog.
- No lint or typecheck scripts are defined in `package.json`, so neither was run.
- No build conflict was reported. npm did report existing audit vulnerabilities and pending install-script approvals; these were unrelated to the PostHog integration.
- Production event delivery, browser behavior, and exception delivery remain unconfirmed.

## Next steps

1. Set `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` in every deployment environment, not only the local `.env` file.
2. Exercise login, logout, search, media selection, and trailer flows in a real browser and confirm the five event names appear in PostHog.
3. Trigger a controlled Vue error in a safe environment and confirm the exception arrives in PostHog.
4. Provide a stable authenticated user ID before wiring identification and account-level attribution.
5. Review the dashboard after real traffic arrives and validate the insight filters and funnel behavior.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the instrumentation (`package.json` scripts; the run verified `npm run build` but found no lint/typecheck scripts).
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites; no test script is defined in `package.json`, so confirm the repository's CI/test setup separately.
- [ ] Confirm `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not just `.env`.
- [ ] Because the app ships browser build assets in `dist/`, wire source-map upload into CI if production stack traces need de-minifying; review the PostHog error tracking source maps documentation before release.
- [ ] Replace the unresolved identity approach only after a stable account identifier is available, updating the login/session-restoration and logout flows described in `src/composables/useAuth.ts`, `src/views/LoginView.vue`, and `src/components/NavBar.vue`.
- [ ] Browser-test each capture call in `src/views/LoginView.vue`, `src/components/NavBar.vue`, `src/views/SearchView.vue`, `src/components/media/MediaCard.vue`, and `src/components/media/MediaHero.vue`, and confirm receipt in PostHog rather than relying on the successful build.

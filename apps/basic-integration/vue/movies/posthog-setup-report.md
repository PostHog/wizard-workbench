# PostHog setup report

PostHog product analytics and Vue global error tracking were added to the browser app, with a starter dashboard and five action-event contracts.

## What was installed and initialized

- Installed the `posthog-js` browser SDK with npm; `package.json` and `package-lock.json` were updated.
- Added `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` to the local environment through the wizard, and documented the variable names in `.env.example`.
- `src/main.js` imports the `posthog-js` singleton and calls `posthog.init()` once, before the Vue app mounts, only when both environment variables are present. In development, a missing variable logs the required configuration error; production remains a no-op when configuration is absent.
- Autocapture and the SDK defaults were left enabled. No CSP changes were made because this app has no CSP configuration.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A visitor successfully completes the demo sign-in form. | `src/views/LoginView.vue` |
| `search_completed` | A visitor submits a movie or TV search and results return successfully. | `src/views/SearchView.vue` |
| `media_selected` | A visitor selects a movie or TV show from a listing, search result, or recommendation. | `src/components/media/MediaCard.vue` |
| `trailer_started` | A visitor opens a trailer from a media-detail page or listing-page hero. | `src/views/MediaDetailView.vue`; `src/components/media/MediaHero.vue` |
| `user_logged_out` | A visitor ends the current demo session using the logout control. | `src/components/NavBar.vue` |

The captures are personless and use operational metadata only. The run did not observe events arriving in PostHog, so event delivery remains unconfirmed.

## Identity

User identification was skipped. The demo stores only a user-entered username in local storage and exposes no stable, non-PII user ID. The username must not be used as a PostHog distinct ID. A future identity implementation should use a real stable non-PII ID at successful login, identify returning authenticated sessions, and call `posthog.reset()` on logout.

## Error tracking

`src/main.js` registers Vue's global `app.config.errorHandler` after PostHog initialization and before mounting. It sends uncaught Vue errors through `posthog.captureException(error)` when PostHog is configured. No component- or route-level wrappers were added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914331)

The dashboard was created with five daily, 30-day trends and a `media_type` breakdown for media selections. However, the dashboard handoff says it used `search_performed`, `trailer_opened`, and the other event names assumed during dashboard creation, while the recorded event plan and source files use `search_completed` and `trailer_started`. This naming mismatch is unresolved and may leave dashboard tiles empty or disconnected from the instrumented events. It should be corrected before relying on the dashboard.

## Verification and limitations

- `npm install` completed successfully.
- `npm run build` completed successfully with Vite 6.4.1, transforming 59 modules and emitting production assets. This proves the code compiles; it does not prove that events flow to PostHog.
- No typecheck or lint scripts are defined in `package.json`, so neither was run.
- No production event delivery or live error capture was exercised.
- npm reported 10 pre-existing audit vulnerabilities and pending install-script approval warnings. They did not prevent installation or the successful production build and were not caused by this integration.

## Follow-up issues

1. **Dashboard event attribution is unresolved.** The dashboard handoff records `search_performed` and `trailer_opened`, but the instrumented contracts are `search_completed` and `trailer_started`. If left unresolved, dashboard tiles may not measure the events emitted by the app.
2. **Stable identity is unavailable.** No stable non-PII identifier reaches the login boundary. If left unresolved, events remain anonymous/personless and cannot be reliably attributed to returning users.

## Before you merge

- [ ] In `src/main.js`, confirm `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` are set in every deploy environment, not only in the local `.env`; the exact names are documented in `.env.example`.
- [ ] Run the full production build in the merge/deploy environment and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite and update mocks or fixtures for the instrumented handlers if needed.
- [ ] In `src/views/SearchView.vue`, `src/views/MediaDetailView.vue`, and `src/components/media/MediaHero.vue`, verify the dashboard uses `search_completed` and `trailer_started` rather than the mismatched names recorded by the dashboard step.
- [ ] In `src/views/LoginView.vue` and `src/components/NavBar.vue`, provide a stable non-PII user ID before adding `identify()` and `reset()`; do not identify with the user-entered username.
- [ ] Exercise the login, search, media-selection, trailer, and logout paths in a real browser and confirm the corresponding events arrive in PostHog.

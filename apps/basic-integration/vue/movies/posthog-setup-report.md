# PostHog setup report

PostHog was installed and initialized for the Vue browser app, with six personless product events, Vue error tracking, and a starter dashboard configured.

## Installed and initialized

- Installed `posthog-js` `^1.408.0` with npm; `package.json` and `package-lock.json` were updated.
- PostHog is initialized once in `src/lib/posthog.js` using `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` from Vite environment variables, and imported before app mounting from `src/main.js`.
- The real environment values were configured in `.env` through wizard tooling, and the variable names are documented in `.env.example`.
- The production build completed successfully with Vite 6.4.1, transforming 60 modules. This verifies compilation only; event delivery was not exercised.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A visitor successfully signs in to the demo app. | `src/views/LoginView.vue` |
| `login_failed` | A visitor submits invalid demo login credentials. | `src/views/LoginView.vue` |
| `search_submitted` | A visitor submits a media search; records query length and result count, not query text. | `src/views/SearchView.vue` |
| `trailer_started` | A visitor opens a trailer from the hero media UI. | `src/components/media/MediaHero.vue` |
| `trailer_started` | A visitor opens a trailer from a media detail page. | `src/views/MediaDetailView.vue` |
| `logout_completed` | A visitor completes logout from the app. | `src/components/NavBar.vue` |

These events were instrumented in code, but the run did not observe them arrive in PostHog. The dashboard insights may therefore remain empty until the app is exercised with valid configuration.

## Identification

User identification was skipped. The demo authentication stores only a mutable, user-entered username under `auth-user`; it does not expose a stable account ID, UUID, resource ID, or email suitable for a distinct ID. The events intentionally remain personless. If a stable account ID is introduced later, wire `identify` after successful login and authenticated restoration, and retain `reset` during logout. Do not use the username as the distinct ID.

## Error tracking

`src/main.js` registers Vue's global `app.config.errorHandler` and forwards uncaught Vue errors through `posthog.captureException(err)`. No component-level error capture was added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926674) contains five `(wizard)` insights covering login outcomes, search activity, trailer engagement, the login-to-trailer funnel, and logout activity. The dashboard and insight definitions were created successfully; their event data was not confirmed during this run.

## Unresolved issue to follow up

The application has no stable user identifier at its authentication boundary. If this remains unresolved, events cannot be attributed to authenticated accounts or joined reliably across sessions. This is intentional rather than a failed implementation, because using the mutable username would risk treating user-entered identity data as a stable identifier.

## Build conflict

`npm` reported 10 dependency audit vulnerabilities and pending install-script approvals for existing dependencies. Neither affected the completed PostHog build verification. No lint or typecheck script is defined in `package.json`, so those checks were unavailable.

## Before you merge

- [ ] Run a full production build again after integrating the branch and fix any lint or type errors introduced by the generated code; the run verified `npm run build`, but no lint or typecheck script exists in `package.json`.
- [ ] Run the test suite, if one is added or configured; the instrumented call sites in `src/views/LoginView.vue`, `src/views/SearchView.vue`, `src/components/media/MediaHero.vue`, `src/views/MediaDetailView.vue`, and `src/components/NavBar.vue` may require updated mocks or fixtures.
- [ ] Confirm `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` from `.env.example` are set in each deployment environment, not only in local `.env`.
- [ ] Exercise login, failed login, search, trailer, and logout flows in a configured deployment and confirm the six event names appear in PostHog; the run verified code placement and compilation, not ingestion.
- [ ] Decide whether the authentication model will gain a stable account ID before relying on account-level attribution; if so, update the auth boundary and the singleton usage in `src/lib/posthog.js` call sites without using the mutable username.

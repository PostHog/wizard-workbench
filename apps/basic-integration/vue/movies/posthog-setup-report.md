# PostHog setup report

PostHog browser analytics was added to the Vue Movies app with five custom events, Vue error forwarding, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` at `^1.407.5` using npm; `package.json` and `package-lock.json` were updated.
- Added a single initialization point in `src/lib/posthog.js`, reading `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` from Vite environment variables and initializing before app mount.
- Imported initialization from `src/main.js` before mounting the Vue app.
- Configured both variables in `.env` and documented the keys in `.env.example`.
- No server-side SDK was added; this is a client-side Vue app.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A visitor successfully completes the demo sign-in flow. | `src/views/LoginView.vue` |
| `login_failed` | A visitor submits the sign-in form without the required credentials. | `src/views/LoginView.vue` |
| `logout_completed` | A signed-in visitor completes the logout action. | `src/components/NavBar.vue` |
| `media_search_completed` | A visitor submits a media search and receives filtered results. | `src/views/SearchView.vue` |
| `trailer_started` | A visitor opens a trailer from a media detail page or media-list hero. | `src/views/MediaDetailView.vue`, `src/components/media/MediaHero.vue` |

The captures are intentionally personless. The event plan uses only non-PII properties, including numeric `result_count` for searches and non-PII `media_id` / `media_type` for trailer starts.

**Verification boundary:** The run verified the capture call sites and event definitions, but did not observe events arriving in PostHog. The passing production build proves compilation only, not runtime event delivery.

## User identification

Identification was skipped. The demo authentication model persists only a mutable, user-entered username and exposes no stable non-PII user identifier. Using that username as a distinct ID would violate the identity contract. Consequently, captures remain anonymous/personless, and logout does not call `posthog.reset()`.

### Follow-up issue

A stable non-PII identifier is unresolved in the auth model. Until one is created and exposed, events cannot be reliably attributed to returning users or connected across sessions. When available, wire `posthog.identify(stableUserId, { username })` after successful login and session restoration, and `posthog.reset()` during logout before navigation. Relevant boundaries are `src/composables/useAuth.ts`, `src/views/LoginView.vue`, and `src/components/NavBar.vue`.

## Error tracking

`src/main.js` registers Vue's global `app.config.errorHandler` before mount and forwards uncaught Vue errors with `posthog.captureException(error)`. No runtime error delivery was observed; the run verified the handler wiring and build compilation only.

## Dashboard

Created **Analytics basics (wizard)** with four tagged insights covering login activity, login failures, media engagement, and a login-to-search funnel. The dashboard may initially be empty until events arrive:

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1918382)

## Build and dependency status

- `npm install` completed successfully and the dependency tree was current.
- `npm run build` passed with Vite v6.4.1, transforming 60 modules and producing the production `dist` output in 2.72 seconds.
- No lint or typecheck scripts are defined, so neither was run.
- No build conflict was reported. npm did report 10 existing audit vulnerabilities and pending install-script approvals; the review did not attribute those to this integration.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the integration; the verified build command is `npm run build`.
- [ ] Run the test suite and update any mocks or fixtures affected by the new captures or error handler; no test command was available in `package.json` during review.
- [ ] Confirm `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env` (`.env.example`, `src/lib/posthog.js`).
- [ ] Add a stable non-PII auth identifier and wire identify on login/session restore plus reset on logout before relying on person-level attribution (`src/composables/useAuth.ts`, `src/views/LoginView.vue`, `src/components/NavBar.vue`).
- [ ] Exercise login, logout, search, and trailer flows in a running deployment and confirm the five named events arrive in PostHog; the run did not perform runtime delivery verification (`src/views/LoginView.vue`, `src/components/NavBar.vue`, `src/views/SearchView.vue`, `src/views/MediaDetailView.vue`, `src/components/media/MediaHero.vue`).

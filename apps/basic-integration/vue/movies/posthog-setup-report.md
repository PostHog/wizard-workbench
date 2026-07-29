# PostHog setup report

PostHog product analytics and Vue error tracking were added to the Vue Movies client, with environment-backed configuration and a starter dashboard.

## What was set up

- **Installed:** `posthog-js` `1.407.8` with `npm add posthog-js`; `package.json` and `package-lock.json` were updated.
- **Initialized:** `src/lib/posthog.js` reads `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST`, initializes the browser singleton only when both are present, and reports missing configuration during development without breaking production boot. `src/main.js` imports that module before mounting the Vue app.
- **Configuration:** `.env.example` documents both variable names, and the run confirmed both real keys are present in `.env`. The report does not reproduce secret values.
- **Error tracking:** `src/main.js` registers Vue's global `app.config.errorHandler` and sends uncaught Vue errors through `posthog.captureException(error)` when PostHog is configured.

## Events instrumented

These are the events recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified that capture calls exist at the listed interaction boundaries; it did **not** browser-exercise the app or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A demo user successfully signs in. | `src/views/LoginView.vue` |
| `login_failed` | A sign-in attempt rejected by client-side validation. | `src/views/LoginView.vue` |
| `logout_completed` | A signed-in user chooses to end their session. | `src/components/NavBar.vue` |
| `media_search_submitted` | A non-empty media search is submitted, with result count but not the query. | `src/views/SearchView.vue` |
| `media_opened` | A movie or TV-show detail page is opened from a media card. | `src/components/media/MediaCard.vue` |
| `trailer_started` | A trailer starts from a media hero. | `src/components/media/MediaHero.vue` |
| `trailer_started` | A trailer starts from a media detail page. | `src/views/MediaDetailView.vue` |

The two `trailer_started` rows are separate instrumented locations for the same event contract. Login, logout, search, media, and trailer captures are intentionally personless because no compliant stable identity is available.

## Identity status and unresolved issue

User identification and reset were **skipped**. The demo authentication flow stores only a mutable username in local storage and exposes no stable non-PII user ID, UUID, resource identifier, or email fallback. The identify step therefore made no code changes rather than identifying users by username.

This remains an explicit follow-up issue: add `posthog.identify(stableId, personProperties)` for login and refresh, and `posthog.reset()` on logout, only after authentication supplies a stable non-PII identifier. The unresolved identity attribution means current custom events cannot be reliably tied to authenticated users or account journeys; no `DISTINCT_ID` placeholder was introduced.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924810) contains four saved insights: login outcomes, media discovery activity, trailer engagement, and a media search-to-open-to-trailer funnel. The definitions were created from the exact event names, but the run did not verify populated data because the browser was not exercised.

## Verification and limits

- `npm install` completed and resolved `posthog-js` `1.407.8`.
- `npm run build` passed; Vite transformed 60 modules and produced the production bundle. This proves the code compiles, not that events flow.
- No browser delivery test was performed, so event arrival, dashboard population, and error delivery remain unconfirmed.
- No lint or typecheck script exists in `package.json`, so those checks were not available.
- No CSP was present in the inspected app files, so no CSP change was required.
- The full build review reported an existing dependency warning: npm reported **10 audit vulnerabilities and pending allow-scripts warnings**. This is the only build/dependency conflict recorded; the integration build itself passed.

## Before you merge

- [ ] Run `npm run build` again after integrating surrounding changes and fix any compile errors introduced by the instrumentation; the relevant script is in `package.json`.
- [ ] Run the project test suite (if one is added or supplied by the application) and update mocks or fixtures for captures in `src/views/LoginView.vue`, `src/views/SearchView.vue`, `src/components/NavBar.vue`, `src/components/media/MediaCard.vue`, `src/components/media/MediaHero.vue`, and `src/views/MediaDetailView.vue`.
- [ ] Set `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` in every deploy environment, not only local `.env`; confirm the names documented in `.env.example`.
- [ ] Manually exercise login, logout, search, media opening, and both trailer paths, then confirm the seven planned capture locations arrive in PostHog; the run itself did not observe delivery.
- [ ] Resolve stable identity attribution in `src/composables/useAuth.ts` and the auth boundaries in `src/views/LoginView.vue` and `src/components/NavBar.vue` before relying on user-level funnels; do not use the current mutable username as a distinct ID.
- [ ] Review and remediate the 10 npm audit vulnerabilities and pending allow-scripts warnings reported during `npm install`, independently of the passing PostHog build.

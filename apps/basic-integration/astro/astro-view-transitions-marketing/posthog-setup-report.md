# PostHog setup report

PostHog was added to the Astro marketing site with browser initialization, conversion-event instrumentation, exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` **1.407.5** with npm; it is recorded in `package.json` and `package-lock.json`.
- Initialized PostHog once from `src/components/PostHog.astro`, rendered by `src/layouts/Layout.astro` for pages using the shared layout.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from the environment. The names are documented in `.env.example`; local values were configured during the run.
- Standard pageview/pageleave capture and tracing headers remain enabled. No server SDK was added because no server-side API routes or TypeScript event-sending surface was found.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | A visitor selects a free-trial call to action from a marketing surface. | `src/pages/index.astro`, `src/pages/pricing.astro`, `src/components/Navigation.astro` |
| `pricing_plan_selected` | A visitor selects a pricing plan or sales-contact call to action. | `src/pages/pricing.astro` |

The event plan records these events and their intended properties. The run verified that each capture is registered in a click listener, and review verified that listeners are reattached on Astro View Transitions via `astro:page-load`. The run did **not** observe events arriving in PostHog, so event delivery and dashboard data remain unconfirmed.

## User identification

Identification was skipped. This is currently a client-only static marketing site with no login, registration, session, account, or user-state flow and no stable application identifier available. The conversion events are intentionally personless. If authentication is added later, wire `window.posthog.identify(stableUserId, personProperties)` after successful authentication and `window.posthog.reset()` on logout or account switching; do not use email or username as the distinct ID.

## Error tracking

`src/components/PostHog.astro` enables PostHog JS exception autocapture for unhandled browser errors and unhandled promise rejections. Console-error capture remains disabled. The run verified the configuration was added to the shared initialization component, but did not trigger an error or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919698)

The dashboard was created with three `(wizard)`-tagged insights: daily free-trial CTA clicks, pricing selections broken down by plan, and a 14-day ordered funnel from free-trial CTA click to pricing-plan selection. The dashboard and insights exist in PostHog; their data is unconfirmed because no incoming events were observed during this run.

## Build and verification

- `npm install` completed successfully with dependencies current.
- `npm run build` passed after review edits and generated all five static routes.
- No lint or typecheck scripts are declared in `package.json`, and no tests were run.
- No build conflict was reported. The review specifically corrected Astro View Transitions listener behavior without changing event names, properties, or capture locations.
- No CSP was present, so no CSP directives were changed.

## Unresolved issues and their cost

- **Event delivery is unresolved:** the run never observed `free_trial_cta_clicked` or `pricing_plan_selected` arrive in PostHog. Until a user triggers the paths and confirms arrival, the dashboard and funnel may remain empty.
- **Stable attribution is unavailable by design:** all conversion events are personless because this site has no authenticated user identity. If left unchanged after authentication is introduced, conversion activity will not be attributable across sessions or reliably associated with users.

## Before you merge

- [ ] Run a full production build again and fix any lint or type errors introduced by the integration; the primary initialization is in `src/components/PostHog.astro` and the event listeners are in `src/pages/index.astro:68`, `src/pages/pricing.astro:72-75`, and `src/components/Navigation.astro:23`.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented calls; no test suite was run by the wizard.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` in every deployment environment, not only local `.env`; verify the initialization reads them in `src/components/PostHog.astro:2-3`.
- [ ] Trigger the hero, navigation, and pricing CTAs in a deployed build and confirm `free_trial_cta_clicked` and `pricing_plan_selected` appear in PostHog, since arrival was not observed during this run.
- [ ] If authentication is added later, add stable-ID `identify` and logout/account-switch `reset` handling in the authentication flow; identification is currently intentionally absent.

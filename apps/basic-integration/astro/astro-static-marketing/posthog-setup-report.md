# PostHog setup report

PostHog browser analytics, conversion-intent events, global browser error tracking, and a starter dashboard were added to this Astro marketing site.

## What was installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` contain the resolved dependency.
- Added the shared initializer at `src/components/posthog.astro`, loaded from `src/layouts/Layout.astro` for the site pages.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, uses guarded environment handling, and preserves tracing headers and the default browser capture behavior. The required environment keys are present locally, and `.env.example` documents their names.
- The initializer enables browser exception autocapture, including `captureException` support, for pages using the shared layout.
- No server-side SDK was added because the project has no server/API event handlers.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `trial_started` | Visitor selects a free-trial call to action from the homepage or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | Visitor selects a paid plan from the pricing page. | `src/pages/pricing.astro` |
| `sales_contact_requested` | Visitor selects the enterprise contact-sales call to action. | `src/pages/pricing.astro` |
| `documentation_topic_selected` | Visitor selects a documentation topic card. | `src/pages/docs.astro` |

The captures use the existing global `window.posthog` instance and non-PII properties. Because the CTA destinations remain `#`, these events measure conversion intent, not confirmed signup, payment, sales contact, or documentation navigation.

## Identification

User identification was skipped. This is an unauthenticated static marketing site with no login, registration, authenticated session, logout boundary, or stable application user identifier. No identity was invented. If authentication is added later, wire `identify` with the stable user ID at successful authentication and persisted-session load, and call `reset` on logout or account switching.

## Error tracking

Global browser exception autocapture was enabled in `src/components/posthog.astro`. No server error boundary was applicable because this site has no server API routes. The run did not exercise a browser session, so arrival of exception events was not observed.

## Verification and limits

- `npm install` completed successfully with dependencies already current.
- `npm run build` completed successfully, generated types, and built all five static routes.
- The successful build verifies compilation and static rendering only. It does **not** verify that PostHog initialized in a browser or that any event reached PostHog.
- No event delivery was observed during this run.
- No CSP was present or changed.
- npm reported 12 dependency audit vulnerabilities and pending install-script approvals. They did not fail installation or the build and were not attributable to this integration.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914205)

The dashboard contains five wizard-tagged insights covering the four events above and a pricing-to-trial funnel. Insights may remain empty until traffic produces events.

## Unresolved issues

- **Runtime delivery is unconfirmed:** no browser session or network inspection was available, so event capture and exception delivery remain unverified. If left unchecked, the dashboard may stay empty despite a passing build.
- **CTA outcomes are unresolved:** the current `#` destinations do not establish downstream signup, payment, sales, or documentation completion. If left unchanged, the event names can be interpreted only as intent signals.
- **Identity attribution is unavailable:** no stable user ID exists in this unauthenticated site. If authentication is later introduced without the documented identify/reset behavior, authenticated activity can remain anonymous or fragment across identities.

## Before you merge

- [ ] Run a full production build in the deployment environment and fix any lint or type errors introduced by the analytics changes; the wizard verified `npm run build` only.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the click handlers in `src/pages/index.astro:68`, `src/pages/pricing.astro:70`, and `src/pages/docs.astro:54`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deploy environment, not only local `.env`; review `src/components/posthog.astro:2-3`.
- [ ] In a deployed browser session, click each instrumented CTA and confirm the corresponding events arrive in PostHog; inspect the handlers at `src/pages/index.astro:68`, `src/pages/pricing.astro:70`, and `src/pages/docs.astro:54`.
- [ ] If the CTA destinations are later connected to real flows, verify the intent events against the resulting signup, payment, sales, or documentation completion events rather than treating intent as completion.

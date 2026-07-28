# PostHog setup report

PostHog browser analytics was installed and initialized globally for the Astro static marketing site, with three anonymous CTA events, browser exception capture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` with npm; no server SDK was added because the project has no API routes or server-side event handlers.
- Added the global client in `src/components/posthog.astro`, mounted from `src/layouts/Layout.astro`, so pages using the shared layout receive one browser PostHog client.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`; the key names are documented in `.env.example` and the configured values were written to the local `.env` through the wizard environment tools.
- Enabled `capture_exceptions: true` in the global `posthog.init()` configuration for uncaught browser exception tracking.
- No CSP changes were made because no CSP was present in the inspected source/config.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor selects the homepage free-trial call to action; includes bounded `placement` metadata. | `src/pages/index.astro` |
| `documentation_clicked` | A visitor opens the documentation from the homepage; includes bounded `placement` metadata. | `src/pages/index.astro` |
| `pricing_plan_selected` | A visitor selects a pricing-plan call to action; includes bounded `plan_name` and `action` properties. | `src/pages/pricing.astro` |

These events are anonymous and contain no PII or stable distinct IDs. The CTA destinations remain placeholders where the source used `href="#"`; successful signup, trial, sales, or documentation milestones were not added.

## Identification

User identification was skipped. The site is client-only/static and the run found no login, registration, logout, session, authentication handler, user model, API route, or stable user identifier. Adding `identify()` would have fabricated an identity. If authentication is added later, identify once after successful login or registration with the real stable account ID and reset on logout.

## Error tracking

Global browser exception autocapture was enabled via `capture_exceptions: true` in `src/components/posthog.astro`. The run verified the configuration was added, but did not observe an exception arrive in PostHog.

## Verification and limits

- `npm install` completed successfully.
- `npm run build` completed successfully and generated all five static routes. This proves the code compiles and the static build succeeds; it does **not** prove that PostHog initialized in a deployed browser or that any event reached PostHog.
- The run observed no live event delivery, so event capture and error delivery remain unconfirmed.
- No typecheck or lint scripts exist in `package.json`.
- The dashboard and four insight tiles were created successfully. The rolling `-30d` insights may be empty until events arrive.

Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918767)

## Build conflict

`npm install` reported 12 dependency audit vulnerabilities and pending approval for existing dependency install scripts. The build remained successful; the review recorded these as existing/package-manager warnings, not integration-caused failures, and no remediation was performed in this run.

## Issues to follow up

- **Event delivery is unresolved:** no browser session or PostHog arrival was observed, so the dashboard may remain empty. If left unresolved, CTA engagement and pricing intent reporting cannot be trusted.
- **Authoritative conversion is unresolved:** the instrumented CTAs still use placeholder destinations and only measure intent clicks. If left unresolved, the events cannot establish completed trial signup, documentation completion, or sales conversion.
- **Identity is unresolved by design:** anonymous events cannot be attributed to an authenticated account because no stable identity exists. If a future auth flow is added without wiring `identify()` and logout reset, returning users will remain fragmented across anonymous IDs.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the verified build was `npm run build`, and no lint/typecheck scripts exist in `package.json`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the CTA capture handlers in `src/pages/index.astro` (lines 58–66) and `src/pages/pricing.astro` (lines 59–67).
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env`; inspect `src/components/posthog.astro` (lines 2–4) for the variables consumed by initialization.
- [ ] Load the deployed homepage and pricing page, click each instrumented CTA, and confirm `trial_cta_clicked`, `documentation_clicked`, and `pricing_plan_selected` arrive in PostHog; inspect the handlers in `src/pages/index.astro` (lines 59–66) and `src/pages/pricing.astro` (lines 61–66).
- [ ] If deployment adds a Content-Security-Policy, check the browser console for violations affecting `src/components/posthog.astro` (the inline SDK and PostHog network requests).
- [ ] If authenticated flows are added, wire `identify()` after successful login/registration and `reset()` on logout using the real stable account ID; the current code has no identity call site.

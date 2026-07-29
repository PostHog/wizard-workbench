# PostHog setup report

PostHog analytics was installed and initialized for the Astro marketing site, with browser CTA tracking, server-side contact-form tracking, error capture, and a starter dashboard.

## Installed and initialized

- Added `posthog-js` (`^1.407.8`) and `posthog-node` (`^5.46.1`) to `package.json` and `package-lock.json` using npm.
- Configured `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`; documented the key names in `.env.example`.
- Browser initialization lives in `src/components/posthog.astro`, is mounted through `src/layouts/Layout.astro`, uses an inline script, guards missing configuration, and enables tracing headers.
- Server initialization lives in `src/lib/posthog-server.ts` as a guarded singleton using `flushAt: 1`, `flushInterval: 0`, and `enableExceptionAutocapture: true`.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | Visitor clicked a call-to-action to start a free trial, segmented by placement and plan when applicable. | `src/pages/index.astro`; `src/pages/pricing.astro`; `src/components/Navigation.astro` |
| `contact_sales_clicked` | Visitor clicked a call-to-action to contact sales, segmented by placement and plan when applicable. | `src/pages/index.astro`; `src/pages/pricing.astro` |
| `contact_form_submitted` | Visitor successfully submitted the contact form, segmented by selected interest without form content or contact details. | `src/pages/api/contact.ts` |

The run verified the capture call sites and event contracts in source. It did **not** verify that events arrived in PostHog: no browser session or live form submission was run.

## Identification

User identification was skipped. The site has no authentication, account state, database-backed user, or stable non-PII user identifier. Contact-form name and email must not be used as analytics distinct IDs. Events intentionally remain personless, while server-side contact tracking uses available PostHog tracing headers.

## Error tracking

Server exception autocapture is enabled in `src/lib/posthog-server.ts`. The existing contact API error handler in `src/pages/api/contact.ts` now calls `captureException` with the tracing distinct-id header when available and flushes before returning the error response. Browser uncaught exceptions rely on the initialized `posthog-js` behavior. The run did not exercise an error in a live browser or server request, so delivery remains unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924559)

The dashboard contains three saved wizard-tagged insights for CTA clicks over time, contact submissions by interest, and the contact-interest conversion funnel. The insight definitions were created, but the run did not confirm that the project has observed events to populate them.

## Verification and unresolved issues

- `npm install` completed successfully.
- `npm run build` passed before and after the review fix; Astro completed the production build and prerendered the static routes. This proves compilation/build success only, not event delivery.
- No lint or typecheck scripts are defined in the project.
- npm reported 13 dependency audit vulnerabilities and pending install-script approvals. They did not block installation or the clean build, but remain a dependency-maintenance issue.
- No CSP is shipped by the project, so no CSP changes were required.
- No stable distinct ID is available. If future code introduces user-level events, replace anonymous attribution with a real authenticated non-PII ID at that boundary; do not use contact-form fields.

## Before you merge

- [ ] Run a full production build in the target deployment environment and fix any lint or type errors introduced by the integration; inspect the PostHog setup in `src/components/posthog.astro` and `src/lib/posthog-server.ts`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the instrumented call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, `src/components/Navigation.astro`, and `src/pages/api/contact.ts`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the names against `.env.example`.
- [ ] Open the site and click the trial and contact-sales CTAs in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`; submit the contact form handled by `src/pages/api/contact.ts`; then confirm the three event names arrive in PostHog.
- [ ] Trigger and verify a handled contact API failure in `src/pages/api/contact.ts` if server error tracking is required before release.
- [ ] Review and resolve the 13 npm audit vulnerabilities and pending install-script approvals reported during installation.

# PostHog setup report

PostHog was added to the Astro marketing site with shared browser initialization, three conversion-event call sites, browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` (`^1.407.5`) and `posthog-node` (`^5.46.1`) with npm. The install completed successfully and updated `package.json` and `package-lock.json`.
- Configured `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`; the names are documented in `.env.example`.
- Added the shared client initialization in `src/components/posthog.astro` and rendered it globally from `src/layouts/Layout.astro`. The integration uses the existing `window.posthog` instance at event call sites.
- The initialization keeps production without configuration as a no-op and reports one missing public configuration variable during development.
- No Content-Security-Policy was present, so no CSP changes were needed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor clicks the home-page free-trial call to action. | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | A visitor expresses intent for a pricing plan from the pricing page. | `src/pages/pricing.astro` |
| `contact_form_submitted` | A visitor successfully submits the contact form. | `src/pages/contact.astro` |

The event properties recorded by the run are non-PII: `location` for the home CTA, `plan` for pricing CTAs, and `interest` after a successful contact API response. Contact names, email, company, and message are not sent as event properties.

These events are instrumented in code, but the run did **not** observe events arriving in PostHog. The dashboard is therefore configured ahead of ingestion and may remain empty until site traffic reaches these paths.

## User identification

Identification was skipped. The source review found no login, registration, logout, session, account, or persisted-user implementation, and the contact form does not establish a durable identity. No stable non-PII user ID was available for `identify()`. If authentication is introduced later, identify after login with that stable ID and reset on logout; do not use contact-form data as an identity.

## Error tracking

`src/components/posthog.astro` enables posthog-js exception autocapture for unhandled browser errors and unhandled promise rejections. Console-error capture remains disabled, and no manual exception wrappers were added. Server-side API error handling was not instrumented.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918766)

The dashboard contains three insights: daily conversion-event trends, pricing CTA interest broken down by plan, and a trial-to-contact conversion funnel. Dashboard creation and insight attachment were verified; event ingestion was not.

## Build and verification

- The review step ran `npm run build` twice, and both Astro builds completed successfully, including server entrypoints, client bundle generation, and prerendering of all five static routes.
- No lint or typecheck script exists in `package.json` (available scripts are `dev`, `build`, and `preview`).
- No build conflict was reported. The npm install did report 13 existing audit vulnerabilities and pending install-script approvals; installation itself succeeded. These audit findings were not established as caused by this integration.
- The capture step had no command-execution tool available and did not run the build; the later review step supplied the successful build verification.

## Before you merge

- [ ] Run a full production build in the target environment and fix any lint or type errors introduced by the generated integration; the wizard verified `npm run build`, but did not run lint or typecheck. Review `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/pages/contact.astro`.
- [ ] Run the test suite, if one is added or available in CI, and update mocks or fixtures for the three instrumented call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/pages/contact.astro`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; verify the exact names in `.env.example`.
- [ ] Deploy or exercise the relevant CTA and successful contact-form paths, then confirm `trial_cta_clicked`, `pricing_plan_cta_clicked`, and `contact_form_submitted` arrive in PostHog with only their intended non-PII properties.
- [ ] Decide whether the existing `src/pages/api/contact.ts` needs separate server-side PostHog instrumentation; this run intentionally left that API route uninstrumented.

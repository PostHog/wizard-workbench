# PostHog setup report

PostHog browser analytics, conversion events, browser exception autocapture, and a starter dashboard were added to the Astro marketing site.

## What was installed and initialized

- Installed `posthog-js` `^1.407.3` and `posthog-node` `^5.46.1` with npm; the lockfile records resolved versions 1.407.3 and 5.46.1.
- Added the shared browser initialization in `src/components/posthog.astro`, mounted from `src/layouts/Layout.astro` so pages use one global `window.posthog` instance.
- Initialization uses `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, guards missing configuration, and configures tracing headers. The real environment values were configured in `.env`; the variable names are documented in `.env.example`.
- Browser exception autocapture is enabled for unhandled errors and unhandled promise rejections. Console-error capture remains disabled.

## Events instrumented

These are instrumented call sites, not events observed arriving in PostHog during this run. The dashboard may therefore be empty until site traffic generates them.

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | A visitor clicks the homepage call to action to start a free trial. | `src/pages/index.astro` |
| `contact_sales_cta_clicked` | A visitor chooses Contact Sales from the homepage or pricing page. | `src/pages/index.astro` |
| `contact_form_submitted` | A visitor successfully submits the contact form, segmented only by selected interest. | `src/pages/contact.astro` |
| `pricing_plan_cta_clicked` | A visitor clicks a pricing-plan CTA, segmented by non-PII `plan` and `cta_label`. | `src/pages/pricing.astro` |

The capture step confirmed that these calls are inside interaction or successful-submit handlers and do not send contact-form name, email, company, or message content.

## User identification

Identification was skipped. The site has no authentication, registration, persisted session, account model, or stable non-PII user identifier. Contact-form PII must not be used as a distinct ID. The current captures are intentionally personless. If authenticated accounts are added later, identify with the account primary key after login and on an already-authenticated refresh, and reset on logout.

## Error tracking

The shared browser initialization enables PostHog exception autocapture for unhandled browser errors and unhandled promise rejections. No server-side API error capture was added in the recorded run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914200)

The dashboard contains four live insight definitions: CTA clicks over time, contact-form submissions by interest, pricing-plan interest by plan, and a contact-sales-to-contact-form conversion funnel. It was created from the intended event definitions and may have no data until traffic is generated.

## Unresolved follow-up issue

- **Server-side contact API instrumentation remains unresolved:** `posthog-node` is installed, but `src/pages/api/contact.ts` was still uninstrumented in the recorded run. The API task was explicitly left for a later step. If left unresolved, successful submissions handled by the API will not have the intended server-side tracking or short-lived-route flush, and server errors will not be captured. Any server event must remain personless, exclude contact-form PII, read tracing headers, and use a singleton configured with immediate flushing.

## Build and verification

- `npm install` completed successfully.
- `npm run build` completed successfully after the final review; Astro prerendered the static routes and built server entrypoints without errors.
- No lint or typecheck script exists in `package.json`.
- The run did **not** observe events arriving in PostHog, so event delivery is unconfirmed.
- Build conflict: npm reported 13 dependency vulnerabilities and pending install-script approvals. The review handoff states these were not caused by and did not block the PostHog integration build.

## Next steps

1. Complete the server-side API instrumentation follow-up for `src/pages/api/contact.ts`, including the singleton and awaited flush described above, or decide that the browser event is the sole authoritative contact conversion.
2. Deploy `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`.
3. Exercise each CTA and submit the contact form in a real browser, then confirm the four named events arrive in PostHog and populate the dashboard.
4. Review whether the placeholder `#` CTA destinations should be replaced with real destinations before relying on conversion metrics.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the wizard verified `npm run build`, but no lint or typecheck script exists in `package.json`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the instrumented call sites.
- [ ] Confirm the exact `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` names from `.env.example` are configured in every deployment environment.
- [ ] Complete or explicitly reject the server-side instrumentation follow-up in `src/pages/api/contact.ts` before treating contact submissions as fully tracked.
- [ ] In a deployed browser, trigger each CTA and a successful contact submission and confirm the corresponding events appear in PostHog; a passing build does not prove event flow.

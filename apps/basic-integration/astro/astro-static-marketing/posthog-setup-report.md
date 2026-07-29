# PostHog setup report

PostHog browser analytics was installed and initialized for the Astro static marketing site, with five anonymous CTA events, exception autocapture, and a starter dashboard.

## What was installed and initialized

- Added `posthog-js` (`^1.407.8`) to `package.json`; npm updated `package-lock.json`.
- Added the reusable browser initialization in `src/components/posthog.astro`, mounted once by `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, uses an Astro `is:inline` script, keeps default capture behavior, enables `enable_exception_autocapture`, and configures tracing headers.
- Documented the environment keys in `.env.example`; the run confirmed both keys are present in the local `.env`.
- No server-side SDK was installed because the inspected app has no API or SSR routes.

## Events instrumented

The run verified that these event names are present in the event plan and that tagged controls are wired to the shared delegated click handler. The run did **not** observe events arriving in PostHog, so these are instrumented events rather than confirmed captures.

| Event | What it measures | File |
|---|---|---|
| `free_trial_cta_clicked` | Visitor clicks a free-trial CTA on the homepage or pricing page. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `documentation_opened` | Visitor opens product documentation from the homepage. | `src/pages/index.astro` |
| `pricing_plan_selected` | Visitor selects the Starter or Pro pricing plan. | `src/pages/pricing.astro` |
| `sales_contact_cta_clicked` | Visitor clicks the Enterprise contact-sales CTA. | `src/pages/pricing.astro` |
| `get_started_cta_clicked` | Visitor clicks the primary Get Started navigation CTA. | `src/components/Navigation.astro` |

CTA links still point to placeholder `#` destinations, so these events measure click intent, not completed trial, sales, documentation, or purchase conversions.

## Identification

User identification was skipped. The app is a client-only static marketing site with no login, registration, authentication state, user record, API route, or stable user identifier. Events therefore remain anonymous by design. If authentication is added later, identify once after successful authentication with a stable non-PII ID and reset on logout.

## Error tracking

Browser exception autocapture is enabled centrally in `src/components/posthog.astro` through `enable_exception_autocapture: true`. No per-route handlers were added. The run verified the configuration in source, but did not perform a runtime error or delivery test.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924550)

The dashboard contains five insights covering CTA activity over time, pricing intent by plan, sales-versus-trial CTA comparison, trial-to-plan intent, and documentation/getting-started engagement. The insights use the last 30 days and may initially be empty until traffic arrives. The run verified dashboard and insight creation, not incoming event volume.

## Verification and unresolved issues

- `npm install` completed successfully and the declared dependency resolved.
- `npm run build` completed successfully and generated all five static routes. This proves the code compiles; it does not prove that browser events flow to PostHog.
- Review found no integration fixes were needed. All pages were verified to mount `src/layouts/Layout.astro`, and no project CSP was found.
- No lint or standalone typecheck script is defined.
- No runtime browser delivery test was performed, so event delivery and exception delivery remain unconfirmed.
- The run reported 12 npm audit vulnerabilities and three pending install-script approvals. These did not block installation or the successful build, but remain dependency/environment notices.
- No attribution issue or `DISTINCT_ID` placeholder was reported. Identification remains intentionally unavailable because the app has no stable user identity source.

## Next steps

1. Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`.
2. Visit the deployed site and click each tagged CTA, then confirm the five named events appear in the dashboard. Check the tagged controls in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
3. Replace placeholder `#` CTA destinations when real destinations exist; until then, treat the events as intent signals only.
4. If authentication is introduced, add stable-ID identification and logout reset in the authentication flow rather than putting identity into event properties.
5. Review the npm audit vulnerabilities and pending install-script approvals before release.

## Before you merge

- [ ] Run a full production build in the target deployment environment and fix any lint or type errors introduced by the integration; the wizard verified `npm run build` successfully but did not run lint or a standalone typecheck.
- [ ] Run the test suite and update mocks or fixtures if instrumented call sites are covered; no test suite was run in this workflow.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are present in `.env.example` and configured in each deployment environment; inspect `src/components/posthog.astro` for the exact names.
- [ ] Load the deployed site, click each tagged control in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`, and confirm the five events arrive in PostHog.
- [ ] Trigger a representative browser exception after deployment and confirm exception tracking arrives; the source configuration is present in `src/components/posthog.astro`, but runtime delivery was not verified.

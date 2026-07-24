# PostHog setup report

PostHog browser analytics was installed and initialized globally for this static Astro marketing site, with four conversion-intent events, browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` with npm; `package.json` declares version `^1.407.2`, and `package-lock.json` was updated.
- No `posthog-node` server SDK was installed because the project has no API routes or server-side event-sending code.
- Added the reusable inline browser initialization component at `src/components/posthog.astro`.
- Mounted that component globally from `src/layouts/Layout.astro`, so the existing pages share one `window.posthog` instance.
- Client configuration reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`; the real values were configured in the local `.env`, and the variable names are documented in `.env.example`.
- Initialization is guarded when configuration is absent, with a development diagnostic; production remains a no-op when configuration is missing.
- `autocaptureExceptions: true` was enabled for uncaught browser errors and unhandled promise rejections.
- No CSP was found in the inspected source/config, so no CSP change was made.

## Events instrumented

These events are defined in `.posthog-wizard-cache/.posthog-events.json` and attached to the corresponding browser interactions:

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor selected the home-page free-trial call to action. | `src/pages/index.astro` |
| `docs_cta_clicked` | A visitor selected the home-page documentation call to action. | `src/pages/index.astro` |
| `get_started_cta_clicked` | A visitor selected the global Get Started conversion call to action. | `src/components/Navigation.astro` |
| `pricing_plan_selected` | A visitor selected a pricing-plan conversion call to action, including the non-PII plan name. | `src/pages/pricing.astro` |

The CTA destinations are existing `href="#"` placeholders, so these events represent conversion intent, not completed signup, checkout, or sales-contact actions. The run did not observe events arriving in PostHog; the event list reflects instrumentation and the planned event contract only.

## User identification

User identification was skipped. The application has no authentication, user accounts, login or signup handlers, persisted user state, or stable user identifier. The events are intentionally personless. If authentication is added later, identify once after successful authentication and reset on logout; do not use an email or name as an event property.

## Error tracking

Browser exception autocapture was enabled in `src/components/posthog.astro` through `autocaptureExceptions: true`. This configures the SDK's global listeners for uncaught errors and unhandled promise rejections and feeds PostHog Error Tracking. The run did not trigger an error or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902558)

The dashboard contains four saved insights: CTA engagement over time, pricing plan selections by plan, a trial-to-plan intent funnel, and documentation versus trial CTA comparison. It is expected to remain empty until visitors generate the instrumented events; the run did not verify populated data.

## Verification and unresolved items

- `npm install` completed successfully and the lockfile remained aligned with the manifest.
- `npm run build` completed successfully; Astro built all five static pages with no errors.
- No lint or typecheck script is defined in the project manifest, so neither was run.
- No event delivery, exception delivery, production deployment, or dashboard data population was observed.
- No build conflict was reported. The review handoff explicitly recorded no conflict; existing npm audit vulnerabilities and pending install-script approvals did not prevent SDK installation.

## Before you merge

- [ ] Run the full production build in the target deployment environment and fix any lint or type errors introduced by the integration; the wizard verified `npm run build` only.
- [ ] Run the project's test suite, if one is added or available in CI; instrumented call sites may require updated mocks or fixtures. No test script is currently defined.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment using the exact names documented in `.env.example`, rather than relying only on the local `.env`.
- [ ] Load the deployed site and click each instrumented CTA, then confirm the four named events arrive in PostHog; this run did not observe event delivery.
- [ ] If authentication is introduced, add stable-user `identify()` after login and on returning authenticated sessions, plus `reset()` on logout; no such flow exists today.

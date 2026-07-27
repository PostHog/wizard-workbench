# PostHog setup report

PostHog browser analytics, anonymous marketing-event capture, exception autocapture, and a starter dashboard were added to this Astro static marketing site.

## What was installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated.
- Added the shared browser initializer at `src/components/posthog.astro`.
- The initializer reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from the environment and is rendered by `src/layouts/Layout.astro`, so pages using that layout initialize PostHog once.
- Added `.env.example` documenting the required public environment variable names. The run also confirmed the real values were present in the local environment configuration.
- No server-side SDK was added because the project has no server routes or server-side event code.
- No CSP changes were made because the project had no CSP to update.

## Instrumented events

The following five event contracts were recorded in `.posthog-wizard-cache/.posthog-events.json` and wired with anonymous browser `capture` calls:

| Event | What it measures | File |
|---|---|---|
| `get_started_cta_clicked` | A visitor clicks a Get Started call to action. | `src/components/Navigation.astro` |
| `free_trial_cta_clicked` | A visitor expresses intent to start a free trial from the homepage or Pro plan. | `src/pages/index.astro` |
| `pricing_cta_clicked` | A visitor selects the Starter plan call to action. | `src/pages/pricing.astro` |
| `contact_sales_cta_clicked` | A visitor expresses Enterprise sales interest. | `src/pages/pricing.astro` |
| `documentation_topic_clicked` | A visitor selects a documentation topic card. | `src/pages/docs.astro` |

The capture properties are non-PII and include the planned `placement`, `plan`, and `topic` dimensions where applicable. The run verified that capture call sites exist; it did **not** observe events arriving in PostHog, so event delivery remains unconfirmed.

## User identification

Identification was skipped. The source tree has no login, registration, logout, session, account, user model, API route, or stable user identifier. PostHog therefore remains anonymous. If authentication is added later, identify once after successful authentication with the stable application user ID, keep email or name in person properties rather than event properties, and reset on logout or account switching.

## Error tracking

`src/components/posthog.astro` enables PostHog exception autocapture for unhandled browser errors and unhandled promise rejections. Console-error capture remains disabled. The run verified the configuration and successful production build, but did not observe an exception event arriving in PostHog.

## Dashboard

The starter dashboard **Analytics basics (wizard)** was created with four wizard-tagged insights covering CTA activity over time, CTA intent by placement, documentation topic engagement, and the marketing CTA conversion path. The insights use the captured event names and are expected to populate as events arrive.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1912740)

## Build and verification

- `npm add posthog-js` completed successfully.
- `npm install` completed successfully.
- `npm run build` passed before and after review and generated all five static pages.
- No separate typecheck or lint scripts were defined in the manifest, so those checks were unavailable.
- No build conflict was reported. Existing dependency audit findings were reported by npm, but did not prevent installation or the production build.
- The run verified compilation and configuration presence only; it did not verify that browser events or exception events reached PostHog.

## Follow-up issues

- **Event delivery is unresolved:** no run step observed any instrumented event arriving in PostHog. Without a browser verification pass, the dashboard may remain empty even though the code builds.
- **CTA destination behavior remains an assumption:** the capture step treated the existing `href="#"` calls to action as meaningful conversion-intent interactions. Confirm that these are the intended production actions and replace the placeholder destinations when the real flows exist.
- **Anonymous attribution is intentional but limited:** no stable user ID was available, so cross-session and authenticated-user attribution cannot be established until an auth flow exists.

## Before you merge

- [ ] Run a full production build in the deployment environment and fix any lint or type errors introduced by the generated integration; the wizard verified `npm run build` but no lint/typecheck scripts were available.
- [ ] Run the test suite, if one is added or available in CI, and update any mocks or fixtures affected by the instrumented calls.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deploy environment, matching the names documented in `.env.example`; verify the rendered production pages receive them in `src/components/posthog.astro`.
- [ ] Load the production site and click each instrumented CTA/topic card, then confirm the five event names appear in PostHog; inspect `src/components/Navigation.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/pages/docs.astro` if any event is missing.
- [ ] Confirm unhandled browser errors and rejected promises appear in PostHog after testing the initializer at `src/components/posthog.astro`.
- [ ] Replace the placeholder CTA destinations and confirm their intended conversion semantics in `src/components/Navigation.astro`, `src/pages/index.astro`, and `src/pages/pricing.astro`.

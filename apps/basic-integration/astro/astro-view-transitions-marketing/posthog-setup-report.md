# PostHog setup report

PostHog browser analytics was installed and initialized for the static Astro marketing site, with four CTA events, global exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` version `1.407.8` using npm; the dependency and lockfile were updated.
- Added the reusable client initialization in `src/components/posthog.astro` and rendered it globally from `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, uses a one-time browser initialization guard, captures pageviews on history changes, enables tracing headers, and sets `capture_exceptions: true`.
- Added the environment variable names to `.env.example`; the real configured values were written to the local `.env` through wizard environment tooling. Their production delivery was not verified.
- No server-side SDK was installed because this project has no API routes or other server event-sending code.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `free_trial_started` | Visitor selects a free-trial CTA from the homepage or Pro pricing tier. | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | Visitor selects a Starter or Pro self-serve pricing plan. | `src/pages/pricing.astro` |
| `enterprise_contact_requested` | Visitor selects the Enterprise contact-sales CTA. | `src/pages/pricing.astro` |
| `get_started_clicked` | Visitor selects the global Get Started navigation CTA. | `src/components/Navigation.astro` |

The events are wired to explicit browser click handlers and use only non-PII metadata such as `placement` and `plan`. The run did **not** observe these events arriving in PostHog; the events remain unconfirmed in production.

## Identification

User identification was skipped. The site is a client-only static marketing site with no authentication, user model, persisted session, API route, or stable application user ID. Events are therefore intentionally personless. If authentication is added, identify a stable non-PII user ID after login and on refresh, and reset on logout.

## Error tracking

Global browser exception autocapture was enabled by adding `capture_exceptions: true` to the shared initialization in `src/components/posthog.astro`. No individual route wrappers or manual error handlers were added. The run verified the configuration and SDK support, but did not observe an exception arriving in PostHog.

## Verification and dashboard

- `npm install` completed successfully.
- `npm run build` completed successfully and generated all five static routes. This verifies compilation/build output only; it does not prove that browser events flow to PostHog.
- No lint or typecheck script is defined in `package.json`.
- No CSP was found, so there was no CSP configuration to update. Production delivery and event flow were not browser-tested.
- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924551)
- The dashboard contains four rolling-30-day insight tiles based on the four event names above. Tiles may be empty until events arrive.

## Build conflicts

No build conflict was reported. Existing npm dependency audit findings were noted, but they did not affect the build or PostHog integration.

## Unresolved follow-up issue

- **Stable attribution is unresolved:** no stable application user identifier exists because the site has no authentication or persisted user session. Leaving this unresolved means CTA and error events cannot be attributed to known users or reconciled across authenticated sessions if authentication is added later. No `DISTINCT_ID` placeholder was introduced at any call site.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; inspect `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the instrumented click handlers in `src/pages/index.astro:67`, `src/pages/pricing.astro:73-82`, and `src/components/Navigation.astro:22`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`; inspect `.env.example` and the deployment/bootstrap configuration.
- [ ] Trigger each CTA in a real browser and confirm the four event names arrive in PostHog; inspect the handlers at `src/pages/index.astro:67`, `src/pages/pricing.astro:73-82`, and `src/components/Navigation.astro:22`.
- [ ] Trigger a controlled browser exception in a safe environment and confirm Error Tracking receives it; inspect `src/components/posthog.astro:14`.

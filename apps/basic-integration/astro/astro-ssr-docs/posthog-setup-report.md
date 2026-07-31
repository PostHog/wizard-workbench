# PostHog setup report

PostHog browser analytics, CTA conversion tracking, and global browser exception autocapture were added to the Astro documentation site.

## Installed and initialized

- Installed `posthog-js` with npm; no `posthog-node` package was added because the project has no API routes or server-side event-sending code.
- Initialized PostHog in `src/components/posthog.astro` using the client environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`.
- Included the initialization component globally from `src/layouts/Layout.astro`.
- Kept default autocapture enabled and configured `tracing_headers`.
- Added the documented environment variable names to `.env.example`; the real values were configured locally in `.env`.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `documentation_cta_clicked` | A visitor selects a primary documentation CTA from the homepage, with non-PII `destination` and `placement` properties. | `src/pages/index.astro` |

The run did not observe an event arriving in PostHog. The event is instrumented in code, and the dashboard insights are defined for it, but browser delivery was not exercised.

## User identification

Identification was skipped. The site has no login, registration, logout, session, browser-storage authentication state, API route, or stable user identifier. Events are intentionally personless. If authentication is added later, identify a stable user ID after login and persisted-session restoration, and reset on logout or direct account switching.

## Error tracking

Global client exception autocapture was enabled in `src/components/posthog.astro` with `capture_exceptions`, including unhandled browser errors and unhandled promise rejections. This uses the SDK's built-in exception observer. The run did not trigger an error and therefore did not observe an exception event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935554)

The dashboard contains three saved insights for `documentation_cta_clicked`: daily clicks over time, clicks by `placement`, and clicks by `destination`. PostHog confirmed the dashboard and insight records exist; their event data may currently be empty.

## What the run verified

- `npm install` completed and dependencies were current.
- `npm run build` passed; Astro completed the server build and static-route prerendering.
- The shared layout renders the PostHog component, the CTA call site uses the initialized browser client, environment keys are present locally, and the integration preserves default autocapture.
- No typecheck or lint script exists in `package.json`.
- No CSP configuration was found, so CSP changes were not needed.

## What remains unconfirmed

- The run did not start the app in a real browser or verify that `documentation_cta_clicked` reaches PostHog.
- The run did not verify that unhandled exceptions arrive in PostHog Error Tracking.
- No server-side event tracking was added because no applicable API route exists.

## Build and dependency conflict

`npm` reports 13 dependency audit vulnerabilities and pending allow-scripts approvals for existing transitive packages. Neither issue was attributed to the PostHog integration, and the production build passes. These should be reviewed separately before release.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the run passed `npm run build`, but no lint or typecheck script exists in `package.json`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the instrumented CTA call site.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; inspect `src/components/posthog.astro` and the deployment configuration.
- [ ] Open the production site, click the homepage “Get Started” CTA in `src/pages/index.astro`, and confirm `documentation_cta_clicked` appears in PostHog with the expected `destination` and `placement` values.
- [ ] Trigger a controlled browser error in a non-production verification environment and confirm exception data appears in PostHog Error Tracking; the configuration is in `src/components/posthog.astro`.

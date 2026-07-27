# PostHog setup report

PostHog browser analytics was added to the Astro marketing site, with shared initialization, conversion-intent events, global browser error tracking, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` `^1.407.3` with npm; `package.json` and `package-lock.json` were updated.
- Added the shared inline browser initialization in `src/components/posthog.astro` and included it from `src/layouts/Layout.astro`, so pages using the shared layout use one `window.posthog` instance.
- Configuration uses the public environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`; both were present in the configured `.env`, and the names are documented in `.env.example`.
- Initialization is guarded for missing configuration and duplicate execution during Astro view transitions. No server-side SDK was added because the project has no server/API event-tracking routes.
- The run verified the dependency installation and production build, but did not verify events arriving in PostHog at runtime.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `trial_started` | A visitor selected a free-trial call to action from the homepage, navigation, or pricing page. These current CTAs represent click intent, not completed signup. | `src/pages/index.astro`, `src/pages/pricing.astro`, `src/components/Navigation.astro` |
| `sales_contact_requested` | A visitor selected the Enterprise contact-sales call to action. This represents click intent, not a completed sales request. | `src/pages/pricing.astro` |

The events use anonymous browser identity because the site has no authentication or stable user identifier. No user identification was wired. The run found no login, registration, logout, account state, API route, or other authenticated boundary. If authentication is added later, identify stable non-PII IDs after login/registration and on returning authenticated sessions, and reset on logout or account switching.

## Error tracking

`src/components/posthog.astro` now installs one-time global listeners for uncaught browser errors and unhandled promise rejections. Unknown reasons are normalized to `Error` instances and sent through the initialized SDK's `captureException`. The run verified the code change by review, but did not observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914198)

The dashboard contains daily trial starts, daily sales-contact requests, and a 14-day ordered trial-to-sales funnel. The saved insights may initially be empty until events are received; runtime event delivery was not verified during this run.

## What the run verified

- `posthog-js` installation completed successfully.
- `npm install` completed successfully.
- `npm run build` completed successfully and generated all five static routes.
- The review found no lint or typecheck scripts in `package.json`.
- The dashboard and three tagged insights were created in PostHog using the instrumented event names.

## What the run did not verify

- No browser session was run, so the run did not confirm that `trial_started` or `sales_contact_requested` arrived in PostHog.
- Error tracking delivery was not observed at runtime.
- Production environment injection and deployed runtime behavior were not exercised.
- Because the CTA links remain `href="#"`, no completed trial or sales workflow exists to verify; the events currently measure intent clicks only.

## Build conflict

npm reported 12 pre-existing dependency audit vulnerabilities and pending allow-scripts approvals. Neither prevented dependency installation or the successful production build. No other build conflict was reported.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration; the verified command was `npm run build`, and no lint/typecheck scripts exist in `package.json`.
- [ ] Run the test suite, if one is added or provided, and update mocks or fixtures for the capture call sites in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only locally; confirm the exact names in `.env.example` and `src/components/posthog.astro`.
- [ ] Load the deployed site and click the CTAs in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`; confirm `trial_started` and `sales_contact_requested` appear in PostHog, since this run did not observe delivery.
- [ ] Replace the placeholder `href="#"` flows in `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro` with real completion boundaries, then add outcome tracking if completed signup or sales requests need to be measured.
- [ ] If authentication is introduced, wire stable-ID identification and logout reset at the new authentication boundary before treating these events as user-attributed.

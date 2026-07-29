# PostHog setup report

PostHog browser analytics and global exception autocapture were added to the Astro documentation site, with a starter dashboard for the instrumented documentation actions.

## Installed and initialized

- Installed `posthog-js` `^1.408.0` and updated `package.json` and `package-lock.json`.
- No `posthog-node` package was added because the project has no server-side API event routes or other server event-sending code.
- Added browser initialization in `src/components/posthog.astro`, using the environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, with default capture behavior and tracing headers.
- Mounted the component from `src/layouts/Layout.astro`, covering the homepage and documentation pages that use the shared layout.
- Added the real environment values locally through the project environment configuration and documented the variable names in `.env.example`.

## Events instrumented

These are instrumented call sites, not events verified as received by PostHog. The run did not exercise a browser session or observe event ingestion.

| Event | What it measures | File |
|---|---|---|
| `documentation_started` | A visitor selects the primary Get Started call to action from the homepage or navigation. | `src/pages/index.astro`, `src/components/Navigation.astro` |
| `api_reference_opened` | A visitor opens the API Reference from the homepage or primary navigation. | `src/pages/index.astro`, `src/components/Navigation.astro` |
| `github_repository_opened` | A visitor follows the primary navigation link to the project repository. | `src/components/Navigation.astro` |

The calls are click-triggered and contain no PII. The Get Started navigation control now points to `/docs` instead of `#`.

## User identification

Identification was skipped. Source review found no login, registration, logout, session state, authenticated user model, or runtime identity flow; authentication references are static documentation content. Captures therefore remain personless. If authentication is added later, identify users with a stable non-PII account ID after successful authentication and reset on logout or account switch.

## Error tracking

Global SDK-managed exception autocapture was enabled in `src/components/posthog.astro` with `posthog.startExceptionAutocapture()` after initialization. This is configured to cover uncaught browser errors and unhandled promise rejections. The run did not trigger an exception and did not observe an error event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926558)

The dashboard contains four live definitions: trends for the three events above and a `documentation_started` to `api_reference_opened` conversion funnel. It may be empty until traffic produces events; dashboard creation was verified, but event delivery was not.

## What the run verified

- `npm add posthog-js` completed successfully.
- `npm install` completed successfully.
- `npm run build` completed successfully after the review fix; Astro built the Node server output without errors.
- The PostHog initialization is mounted through the shared layout.
- The configured environment keys are present locally and documented in `.env.example`.
- The dashboard and its four tiles were created successfully in PostHog project 483112.

## What the run did not verify

- No browser production session was run, so event delivery, distinct-ID behavior in a live browser, and exception ingestion remain unconfirmed.
- No lint or typecheck scripts are defined and none were run.
- Production deployment environment configuration was not exercised.
- No CSP exists in the inspected project source, so CSP behavior was not tested.

## Build conflict

`npm` reported 13 dependency audit vulnerabilities and pending install-script approvals for existing transitive packages. These did not affect the PostHog integration build and were not changed by this work.

## Next steps

1. Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; check `src/components/posthog.astro` and `.env.example`.
2. Run the deployed site and click each instrumented CTA/navigation action; confirm `documentation_started`, `api_reference_opened`, and `github_repository_opened` arrive in PostHog and populate the dashboard. Check `src/pages/index.astro` and `src/components/Navigation.astro`.
3. Trigger a controlled browser exception in a safe environment and confirm exception autocapture in PostHog; check `src/components/posthog.astro`.
4. Run the full project test suite and any available lint/typecheck commands; inspect the instrumented call sites in `src/pages/index.astro` and `src/components/Navigation.astro` for fixture or mock updates.
5. Review and address the existing npm audit findings and install-script approvals separately from the integration; inspect `package.json` and `package-lock.json`.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; verify `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, and `src/components/Navigation.astro`.
- [ ] Run the test suite and update any mocks or fixtures affected by the click captures in `src/pages/index.astro` and `src/components/Navigation.astro`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are configured in deployment environments, matching `.env.example` and the reads in `src/components/posthog.astro`.
- [ ] Exercise the deployed CTAs and confirm the three named events arrive in PostHog; inspect the capture call sites in `src/pages/index.astro` and `src/components/Navigation.astro`.
- [ ] Exercise a controlled browser exception and confirm error tracking; inspect `src/components/posthog.astro`.

# PostHog setup report

PostHog browser analytics, global browser error tracking, interaction events, and a starter dashboard were added to this Astro documentation site.

## Installed and initialized

- Installed `posthog-js` with npm; npm updated `package.json` and `package-lock.json`.
- No `posthog-node` package was added because no server-side API routes or event-sending server code were present.
- Added `src/components/posthog.astro` as an inline browser initialization component. It reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, initializes PostHog once with the reviewed defaults date and `tracing_headers`, and preserves the missing-configuration behavior: development reports the missing configuration while production remains a no-op.
- Mounted the component in `src/layouts/Layout.astro`, making it available through the shared layout. The names are documented in `.env.example`; the real values were configured in `.env` through wizard tools.
- Autocapture was left enabled. No CSP was present or changed.

## Events instrumented

These are planned browser events attached to click handlers. The run did not exercise the browser or observe any event arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `documentation_navigation_clicked` | A visitor selects a primary or sidebar documentation navigation link. | `src/components/Navigation.astro`, `src/components/DocsSidebar.astro` |
| `home_documentation_cta_clicked` | A visitor selects a primary home-page call to action for documentation or API reference. | `src/pages/index.astro` |
| `home_feature_card_clicked` | A visitor selects a home-page feature card to explore a documentation topic. | `src/pages/index.astro` |

The event properties are limited to low-risk UI metadata such as destination, navigation area, section, and displayed label. No PII is captured. Captures are intentionally personless because this site has no stable authenticated user identifier.

## User identification

Identification was skipped. The project is a static documentation site with no implemented login, registration, logout, serialized session, user store, API route, or stable user identifier. No `identify()` or `reset()` call was added.

If authentication is added later, identify after successful login or registration with the app's stable user primary key, put email or name in person properties rather than event properties, identify returning authenticated users on refresh, and reset when switching accounts or logging out.

## Error tracking

`src/components/posthog.astro` now adds the SDK `captureException` support and global `window` listeners for uncaught errors and unhandled promise rejections. Rejection reasons are normalized and forwarded through `posthog.captureException`. No route-specific manual error instrumentation was added.

The run verified the implementation was reviewed and the production Astro build passed. It did not run the browser, trigger an exception, or observe an error arriving in PostHog; error delivery is therefore unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1912743)

The dashboard contains three daily trend insights for the planned navigation, home documentation CTA, and home feature card events, configured for the last 30 days. The dashboard and tiles were created successfully through MCP. Their data population was not verified because the run did not observe browser events.

## Build status and conflicts

The review task ran the detected npm install command successfully; dependencies were already current. `npm run build` passed before review and again after the review fix, with Astro completing the server build successfully. The review added the reference snippet's current PostHog `defaults` date. No build conflict was reported. npm did report dependency audit findings; the review states these were not caused or addressed by this instrumentation.

The project defines a build script but no separate typecheck or lint scripts. Browser delivery, event capture, exception delivery, and deployment-environment behavior were not verified by this run.

## Follow-up issues

- **Attribution is intentionally unresolved:** no stable user identifier exists, so all planned captures and browser errors remain anonymous/personless. If authenticated behavior is introduced without adding the identity boundary described above, user-level attribution and continuity will remain fragmented.
- **Event and error delivery is unconfirmed:** the run compiled the code but did not load the site or observe requests/events in PostHog. The dashboard may remain empty until the interaction paths are exercised in a real browser.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; the wizard verified `npm run build`, but no separate lint or typecheck scripts exist. Review `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/components/Navigation.astro`, `src/components/DocsSidebar.astro`, and `src/pages/index.astro`.
- [ ] Run the test suite, if one is present, and update mocks or fixtures for the instrumented handlers in `src/components/Navigation.astro`, `src/components/DocsSidebar.astro`, and `src/pages/index.astro`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env`; check `src/components/posthog.astro` and the deployment configuration.
- [ ] Load the deployed site in a real browser, click the instrumented navigation, CTA, and feature-card paths in `src/components/Navigation.astro`, `src/components/DocsSidebar.astro`, and `src/pages/index.astro`, and confirm the three event names appear in PostHog.
- [ ] Trigger and verify a browser exception and an unhandled rejection against the global listeners in `src/components/posthog.astro`.
- [ ] Review the dashboard at https://us.posthog.com/project/483112/dashboard/1912743 after exercising the site and confirm its three tiles populate.

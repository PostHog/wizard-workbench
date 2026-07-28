# PostHog setup report

PostHog browser analytics, four documentation interaction events, browser exception autocapture, and a starter dashboard were set up for this Astro documentation site.

## What was installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with npm; `package.json` and `package-lock.json` were updated. npm reported 13 existing dependency audit vulnerabilities and pending install-script approvals, but installation completed successfully.
- Added the reusable browser initialization in `src/components/posthog.astro`. It reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, uses an Astro `is:inline` script, initializes once with tracing headers, and enables `capture_exceptions: true`. Missing configuration throws the required development-time error while production remains a no-op.
- Rendered the initialization from `src/layouts/Layout.astro`, which is also reached by the documentation layout. The real environment values were configured locally through the wizard; `.env.example` documents the two required public variable names.
- `posthog-node` is installed but no server-side singleton or API-route tracking was added because this project has no applicable API routes.

## Events instrumented

These are instrumented definitions, not observed deliveries. The run did not exercise a browser session or verify that any event arrived in PostHog.

| Event | What it measures | File |
|---|---|---|
| `documentation_get_started_clicked` | Visitor selects the Get Started CTA in primary navigation. | `src/components/Navigation.astro` |
| `documentation_github_clicked` | Visitor follows the external GitHub link in primary navigation. | `src/components/Navigation.astro` |
| `documentation_home_cta_clicked` | Visitor selects a primary home-page documentation CTA. | `src/pages/index.astro` |
| `documentation_topic_selected` | Visitor selects a documentation topic card from the home page. | `src/pages/index.astro` |

All four captures are intentionally personless. They do not contain email addresses, names, or other user-entered PII.

## Identification

User identification was skipped. The reviewed application is a static documentation site with no login, registration, logout, session, authenticated API route, or application user state, so no stable user identifier was available without inventing identity. If authentication is added later, identify with the authenticated stable primary key and reset on logout.

## Error tracking

Browser-side uncaught exception autocapture was enabled through `capture_exceptions: true` in `src/components/posthog.astro`. No server-side error handler was added. The run did not trigger an exception or verify that an error event arrived in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919708)

The dashboard was created in PostHog project `483112` with four trends insights corresponding to the planned events. The insights may be empty until traffic arrives; their existence does not prove event delivery.

## What the run verified

- `npm install` completed successfully with the declared PostHog packages.
- `npm run build` completed successfully and produced server output without errors.
- The shared layout wiring was reviewed, and the initialization reaches the documentation pages through `DocsLayout`.
- The four click handlers and event-plan entries are present.
- The dashboard and four insight definitions were created successfully.

## What the run did not verify

- No event capture was observed in PostHog.
- No browser interaction, production deployment, or exception trigger was exercised.
- No lint or typecheck scripts are defined, so lint and typecheck were not run.
- No server-side event tracking was implemented or tested.

## Unresolved issues and their cost

- **Event delivery remains unconfirmed.** The build proves compilation only; until a real browser visit and click are checked in PostHog, the four dashboard tiles may remain empty and delivery failures could go unnoticed.
- **No stable identity exists.** Events cannot currently be attributed to returning or authenticated users. Adding an invented identifier would risk incorrect attribution, so this remains intentionally unresolved.
- **Server-side tracking is not applicable to the current app.** If API routes are introduced later, they will need a `posthog-node` singleton, request attribution, and awaited flushes before responses return.

## Before you merge

- [ ] Run a full production build again and fix any lint or type errors introduced by the integration; the available verification was `npm run build`, and no lint/typecheck scripts exist in `package.json`.
- [ ] Run the test suite, if one is added or available in CI; instrumented click handlers may need updated mocks or fixtures. No test script is currently defined in `package.json`.
- [ ] Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; confirm the exact names in `.env.example` and `src/components/posthog.astro`.
- [ ] In a deployed browser session, click each CTA and confirm the four named events arrive in PostHog and populate the [Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1919708); event delivery was not observed during this run.
- [ ] If the app later ships minified browser bundles, add source-map upload to CI so production error stack traces are de-minified.

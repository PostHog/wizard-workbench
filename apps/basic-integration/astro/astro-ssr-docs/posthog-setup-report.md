# PostHog setup report

PostHog browser analytics, exception autocapture, four documented interaction events, and a starter dashboard were added to the Astro documentation site.

## Installed and initialized

- Installed `posthog-js` with npm; `package.json` and `package-lock.json` were updated.
- Added the reusable inline initialization component at `src/components/posthog.astro` and rendered it from the shared `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, keeps default capture behavior enabled, and fails loudly only in development when either variable is missing while remaining a production no-op.
- `.env.example` documents both variables; the run confirmed both variables are present in the local environment.
- No server-side SDK was added because the app has no API routes or server event-sending code.

## Events instrumented

These are the event contracts added by the run. The run verified their call sites and planned definitions; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
| --- | --- | --- |
| `documentation_cta_clicked` | A visitor selects a primary documentation call to action on the home page. | `src/pages/index.astro` |
| `documentation_topic_selected` | A visitor selects a documentation topic card on the home page. | `src/pages/index.astro` |
| `documentation_navigation_clicked` | A visitor selects a documentation navigation destination. | `src/components/Navigation.astro` |
| `github_link_clicked` | A visitor follows the external GitHub link from site navigation. | `src/components/Navigation.astro` |

Capture properties are limited to non-PII `destination` and `placement` values. Events use personless browser captures because this static documentation site has no authentication or user concept.

## Identification

User identification was skipped. The identify review found no executable login, logout, session, user-state, or local-storage authentication flow—only documentation prose—so there is no stable authenticated user boundary to instrument. If authentication is added later, identify after successful login and on known-user refresh, keep personal details in person properties, and reset on logout or account switching.

## Error tracking

`src/components/posthog.astro` calls `posthog.startExceptionAutocapture()` after initialization, enabling global capture of uncaught errors and unhandled promise rejections. The run verified the installed SDK exposes this method, but no runtime error was intentionally generated and no error event arrival was observed.

## Dashboard

The dashboard **Analytics basics (wizard)** was created with five saved insight definitions: CTA activity trend, topic-interest breakdown, navigation-activity breakdown, GitHub referral trend, and a homepage engagement funnel. It may remain empty until visitors generate events.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1914203)

## What the run verified

- `npm install` completed successfully with the declared `posthog-js` dependency.
- `npm run build` completed successfully, producing the Astro server build and prerendered routes.
- The shared layout includes the PostHog component, and the event handlers are attached at the documented call sites.
- The local environment contains both required public configuration variables.
- The dashboard and five insight definitions were saved successfully in PostHog.

## What remains unconfirmed

The run did not launch the app in a real browser, send test interactions, or observe any event or exception arriving in PostHog. Build success proves the code compiles; it does not prove data is flowing. The dashboard is configured but its live population is unconfirmed.

## Before you merge

- [ ] Run a full production build in the target deployment environment and fix any lint or type errors introduced by the integration; `package.json` has no lint or typecheck script.
- [ ] Run the test suite in the project/CI environment; instrumented click handlers may require updated mocks or fixtures.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are configured in every deployment environment, not only the local `.env`; see `.env.example`.
- [ ] Open the deployed home page and documentation navigation, click each annotated CTA/topic/navigation/GitHub target, and confirm the four event names appear in PostHog; the run itself did not observe delivery.
- [ ] Trigger a controlled browser exception in a safe test environment and confirm exception autocapture appears in PostHog; the run itself did not observe delivery.

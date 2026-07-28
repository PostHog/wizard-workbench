# PostHog setup report

PostHog client analytics, browser exception autocapture, four documentation interaction events, and a starter dashboard were added to the Astro documentation site.

## What was installed and initialized

- Installed `posthog-js` with npm; it is recorded in `package.json` and `package-lock.json`.
- Added the browser initialization in `src/components/posthog.astro`, mounted globally from `src/layouts/Layout.astro`.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`; the key names are documented in `.env.example` and real values were configured locally in `.env`.
- No `posthog-node` or server-side tracking was added because this project has no API routes or server event-sending code.
- No user identification was wired: the site has no application login, session, or stable user identifier. Static documentation references to authentication do not provide an identity source.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `getting_started_clicked` | Visitor selects the primary Get Started call to action from the home page. | `src/pages/index.astro` |
| `documentation_topic_selected` | Visitor opens a documentation topic from a home-page feature card. | `src/pages/index.astro` |
| `documentation_navigation_clicked` | Visitor selects documentation, API reference, or repository navigation from the global header. | `src/components/Navigation.astro` |
| `docs_sidebar_navigation_clicked` | Visitor changes documentation sections through sidebar navigation. | `src/components/DocsSidebar.astro` |

These are planned client-side captures tied to real clicks. The run did not observe events arriving in PostHog, so event delivery and resulting dashboard data remain unconfirmed. Automatic pageviews, autocapture, and session recording were left enabled by the SDK defaults.

## Error tracking

`src/components/posthog.astro` enables PostHog exception autocapture for unhandled browser errors and unhandled promise rejections. Console-error capture remains disabled. No server-side error handler was added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918773) contains five insights covering the four events and a getting-started-to-topic-discovery funnel. It may initially be empty until traffic arrives.

## Verification and conflicts

- `npm install` completed successfully and resolved `posthog-js` from the manifest.
- `npm run build` completed successfully: Astro built server entrypoints and prerendered static routes.
- No lint or typecheck scripts are defined, and tests were not run.
- The run did not verify that browser events or exceptions arrive in PostHog.
- Build conflict: npm reported 13 existing audit vulnerabilities and pending approval for third-party install scripts; neither affected installation or the successful production build.

## Unresolved issues

- **Identity attribution is unresolved.** No stable application user ID exists, so events and errors remain personless/anonymous. If authenticated functionality is added without wiring `identify()` and `reset()`, user-level attribution and continuity will be unavailable.
- **Runtime delivery is unverified.** The build proves the code compiles, not that the SDK sends data. If events never arrive, the dashboard and funnel will remain empty.

## Before you merge

- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`; review `src/components/posthog.astro` (initialization block).
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; review the scripts in `package.json` and the integration files `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/components/Navigation.astro`, and `src/components/DocsSidebar.astro`.
- [ ] Run the test suite and update any mocks or fixtures affected by the click handlers; review the instrumented handlers in `src/pages/index.astro`, `src/components/Navigation.astro`, and `src/components/DocsSidebar.astro`.
- [ ] Load the deployed site, perform each instrumented click, and confirm the four named events arrive in PostHog; review the capture handlers in `src/pages/index.astro`, `src/components/Navigation.astro`, and `src/components/DocsSidebar.astro`.
- [ ] If real authentication is introduced, add stable-ID `identify()` on login and `reset()` on logout; review the global client in `src/components/posthog.astro` and the future auth callback/logout files.

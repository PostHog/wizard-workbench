# PostHog setup report

PostHog browser analytics was added to the Astro documentation site, with shared initialization, three custom interaction events, browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` with the project's detected npm package manager; it was added to `package.json` and `package-lock.json`.
- No `posthog-node` package was installed because the project has no `src/pages/api/` routes or other server-side event-sending code.
- Browser initialization is centralized in `src/components/posthog.astro` and rendered once from `src/layouts/Layout.astro`, covering pages that use the shared layout, including `DocsLayout` pages.
- Initialization uses the Astro client environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`, with `tracing_headers` configured. The real values were configured locally through the wizard environment tooling, and `.env.example` documents the key names.
- Missing configuration is handled as a development-time failure and a production no-op, rather than silently sending with an empty key.
- No Content-Security-Policy was present, so no CSP directives were changed.

## Events instrumented

These are the planned and instrumented custom events recorded in `.posthog-wizard-cache/.posthog-events.json`:

| Event | What it measures | File |
|---|---|---|
| `primary_cta_clicked` | A visitor selects a primary home-page call to action. | `src/pages/index.astro` |
| `feature_card_clicked` | A visitor opens a documentation area from a home-page feature card. | `src/pages/index.astro` |
| `documentation_navigation_clicked` | A visitor selects a top navigation or documentation sidebar link. | `src/components/Navigation.astro`, `src/components/DocsSidebar.astro` |

The capture step verified four call sites across these three event definitions. The run did **not** perform a browser delivery test, so it did not observe any of these events arriving in PostHog. The dashboard insights may therefore be empty until real traffic triggers them.

## User identification

User identification was skipped. The site is a public documentation site with no executable login, registration, logout, authenticated session, user model, API route, or stable client-side user identity. The custom events are intentionally personless; no identity contract was invented.

## Error tracking

Browser exception autocapture was enabled in `src/components/posthog.astro` for unhandled errors and unhandled promise rejections. Console-error capture remains disabled. The review removed redundant manual global listeners, leaving the SDK's configured exception capture as the single global path.

No runtime exception was observed arriving in PostHog. The build review confirmed that the installed SDK shape compiled successfully.

## Dashboard

The run created **Analytics basics (wizard)** with three tagged trends insights:

- Primary CTA clicks (wizard)
- Feature card clicks (wizard)
- Documentation navigation clicks (wizard)

Dashboard ID: `1924557`  
[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1924557)

The insights use a `-30d` date range and the documentation navigation insight uses a `navigation_context` breakdown. The dashboard was created successfully, but the run did not verify that new events had populated it.

## Build and verification

- `npm install` completed successfully; dependencies were already current.
- `npm run build` completed successfully with Astro server output, static-route prerendering, and final build completion.
- The review found no lint or typecheck scripts in `package.json`.
- No build conflict was reported. There is no unresolved dependency or integration conflict from this run.
- A passing build proves that the code compiles; it does not prove that browser events or exceptions were delivered to PostHog.

## Issues to follow up

- **Runtime delivery remains unverified:** no browser session was run, so event ingestion, exception ingestion, and dashboard population remain unconfirmed. If left unchecked, instrumentation could compile while events are blocked or misconfigured in deployment.
- **No stable identity is available:** all custom events remain anonymous/personless because no authenticated identity exists. If the site later gains authentication, events will not attribute to users until a stable non-PII ID is wired through the login, refresh, and logout flows.

## Before you merge

- [ ] Run the full production build in the target deployment environment and fix any lint or type errors introduced by the integration; the wizard verified `npm run build`, but no lint or typecheck scripts are defined in `package.json`.
- [ ] Run the test suite, if one is added or configured, and update mocks or fixtures for the instrumented handlers in `src/pages/index.astro`, `src/components/Navigation.astro`, and `src/components/DocsSidebar.astro`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deploy environment, not only in the local `.env`; inspect `src/components/posthog.astro` for the consuming names.
- [ ] Load the deployed site and trigger the home-page CTA, feature card, and navigation interactions; confirm `primary_cta_clicked`, `feature_card_clicked`, and `documentation_navigation_clicked` arrive in PostHog and appear on dashboard `1924557`.
- [ ] Trigger a controlled browser exception in a safe environment and confirm browser exception autocapture arrives in PostHog; inspect `src/components/posthog.astro` for the `capture_exceptions` configuration.

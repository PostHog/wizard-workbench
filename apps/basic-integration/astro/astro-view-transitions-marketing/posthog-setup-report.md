# PostHog setup report

PostHog browser analytics was added to the static Astro marketing site, with CTA conversion events, exception autocapture, and a starter dashboard configured.

## What was set up

- **Installed:** `posthog-js` with npm; `package.json` and `package-lock.json` were updated. No `posthog-node` package was added because no server routes or server-side event code were found.
- **Initialized:** `src/components/posthog.astro` contains the single global, `is:inline` browser initializer using `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`. It is rendered from `src/layouts/Layout.astro`. Missing configuration is loud in development and a no-op in production. The configured environment keys are present in `.env`, and the names are documented in `.env.example`.
- **Identity:** Identify/reset was skipped. This app has no authentication flow or stable non-PII user identifier, so the instrumented events are intentionally anonymous/personless captures.
- **Error tracking:** `enableExceptionAutocapture: true` was enabled in `src/components/posthog.astro`, feeding browser exception tracking through the shared client.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor selects a free-trial CTA from the homepage or pricing page. | `src/pages/index.astro:67`; `src/pages/pricing.astro:73` |
| `contact_sales_clicked` | A visitor selects Contact Sales on the pricing page. | `src/pages/pricing.astro:77` |
| `get_started_clicked` | A visitor selects a Get Started CTA from navigation or pricing. | `src/components/Navigation.astro:22`; `src/pages/pricing.astro:69` |

The run verified that these capture calls and their snake_case event names are present in the changed files. It did **not** observe events arriving in PostHog: no browser delivery test or live event confirmation was performed. The dashboard insights may therefore be empty until real traffic triggers the events.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918203) contains four insights: CTA clicks over time, trial CTA clicks by placement, Get Started clicks by placement, and a CTA progression funnel. The dashboard and insights were created successfully in PostHog; their data population was not verified.

## Build and conflicts

`npm run build` passed after review: Astro generated all five static routes successfully. The project has no lint or typecheck script, so those checks were not available. No build conflict was reported. Delivery to PostHog was not browser-tested, so a passing build proves compilation only, not event delivery.

## Unresolved issues

- **Anonymous attribution:** No stable user ID was available. This costs cross-session and authenticated-user attribution for CTA events until authentication exists. Add `window.posthog.identify(<stable-non-PII-user-id>)` after successful authentication and `window.posthog.reset()` on logout at that future auth boundary; no placeholder `DISTINCT_ID` is present in the current call sites.
- **Event delivery:** The run did not confirm that any event reached PostHog. Without a browser test, ad blockers, runtime configuration, or deployment behavior could still prevent delivery.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; inspect `src/components/posthog.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/pricing.astro`, and `src/components/Navigation.astro`.
- [ ] Run the test suite, if one is added or available, and update mocks or fixtures for the CTA capture handlers in `src/pages/index.astro:67`, `src/pages/pricing.astro:69-77`, and `src/components/Navigation.astro:22`.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`.
- [ ] Load the deployed site, click each instrumented CTA, and confirm `trial_cta_clicked`, `get_started_clicked`, and `contact_sales_clicked` arrive in PostHog with the expected non-PII properties.
- [ ] If authentication is added later, wire stable-user `identify` and logout `reset` at the authentication boundary before relying on cross-session attribution.

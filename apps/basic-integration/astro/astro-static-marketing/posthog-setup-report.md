# PostHog setup report

PostHog client analytics, conversion event instrumentation, exception autocapture, and a starter dashboard were added to the Astro static marketing site.

## What was installed and initialized

- Installed `posthog-js` at `^1.407.5` with npm; no `posthog-node` package was added because the app has no server-side routes.
- Added one global inline browser initialization in `src/components/posthog.astro`, mounted from `src/layouts/Layout.astro` so pages using the shared layout use the same `window.posthog` instance.
- Initialization reads `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` from Astro environment variables. The real values are configured in `.env`; placeholder key names are documented in `.env.example`.
- The initializer retains PostHog defaults and enables exception autocapture for unhandled browser errors and unhandled promise rejections.
- No CSP was present in the reviewed source, so no CSP directives were changed.

## Events instrumented

The run verified that these `capture()` calls are attached to the intended CTA click handlers. It did **not** run the site in a browser or observe events arriving in PostHog, so delivery and ingestion remain unconfirmed.

| Event name | What it measures | File |
|---|---|---|
| `trial_cta_clicked` | A visitor selects the free-trial CTA in the homepage hero or primary navigation; includes categorical `placement` (`hero` or `navigation`). | `src/pages/index.astro`, `src/components/Navigation.astro` |
| `pricing_plan_selected` | A visitor selects a pricing CTA for Starter, Pro, or Enterprise; includes categorical `plan`. | `src/pages/pricing.astro` |

Captures are intentionally personless. No stable authenticated user identifier exists in this static marketing site, and no `identify()` wiring was added.

## Identification

User identification was skipped because the project has no login, registration, logout, authenticated state, or verified stable user ID. Adding `identify()` would have invented an identity boundary. If authentication is introduced later, wire `identify()` when the verified stable ID becomes available and call `reset()` at logout or before switching accounts.

## Error tracking

Global PostHog exception autocapture was enabled in `src/components/posthog.astro` for unhandled errors and unhandled promise rejections. Console-error capture was not explicitly changed, and no individual routes or components were wrapped.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919703)

The dashboard contains three saved, tagged insights: trial CTA clicks over time, pricing plan selections broken down by `plan`, and a 14-day ordered funnel from `trial_cta_clicked` to `pricing_plan_selected`. It was created successfully, but may remain empty until events are actually sent by a deployed or locally running site.

## Verification and conflicts

- `npm install` completed successfully and dependencies were current.
- `npm run build` passed before and after final review, producing all 5 static routes.
- Environment checks confirmed both `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are present without exposing their values.
- No lint or typecheck scripts exist in `package.json`, so neither was run.
- No runtime browser test was performed; the run did not observe any event arrive in PostHog.
- No build conflict was reported. The full recorded conflict is: none.

## Next steps

1. Configure `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env` file.
2. Deploy or run the site, click the homepage/navigation trial CTAs and each pricing CTA, and confirm `trial_cta_clicked` and `pricing_plan_selected` appear in PostHog.
3. Review the dashboard after those checks and confirm its tiles and funnel populate as expected.
4. If authentication is added, implement stable-ID identification and logout reset at the future auth boundary.

## Before you merge

- [ ] Run the full production build again and fix any lint or type errors introduced by the integration; the verified command was `npm run build`, and `package.json` has no lint or typecheck scripts.
- [ ] Run the project test suite, if one is added or exists in the deployment environment; the run did not execute tests.
- [ ] Confirm `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are present in `.env.example` and configured in all deployment/bootstrap environments, not just `.env` (`.env.example:1-2`, `src/components/posthog.astro:2-3`).
- [ ] Trigger the instrumented CTA paths and verify both event names arrive in PostHog; inspect the listeners in `src/pages/index.astro:43-50`, `src/components/Navigation.astro:18-24`, and `src/pages/pricing.astro:58-66`.
- [ ] If a Content-Security-Policy is added before release, load the app and check the browser console for CSP violations affecting the inline initializer or PostHog network requests (`src/components/posthog.astro:5-22`).

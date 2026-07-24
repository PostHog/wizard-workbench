# PostHog setup report

PostHog client analytics, exception autocapture, three documentation interaction events, and a starter dashboard were added to the Astro documentation site.

## What was installed and initialized

- Installed `posthog-js` in `package.json` and `package-lock.json` using npm. No server-side SDK was installed because the project has no API routes or other server event-sending code.
- Added `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to the wizard-managed `.env`; documented both keys in `.env.example`.
- Added the reusable inline browser initializer at `src/components/posthog.astro`. It reads the `PUBLIC_` environment values, initializes once, enables pageview capture and tracing headers, and is rendered from `src/layouts/Layout.astro` for pages using the shared layout.
- Enabled unhandled-error and unhandled-promise-rejection autocapture in `src/components/posthog.astro`; console-error capture remains disabled.

The run verified that the environment keys are present, the shared layout mounts the initializer, and `npm run build` completes successfully. It did **not** observe events arriving in PostHog, so event delivery and live error reporting remain unconfirmed.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `documentation_cta_clicked` | A visitor starts the documentation journey from the primary landing-page call to action. | `src/pages/index.astro` (capture at line 65) |
| `documentation_topic_selected` | A visitor selects a documentation topic card from the landing page. | `src/pages/index.astro` (capture at line 74) |
| `external_repository_clicked` | A visitor follows the repository link from primary navigation. | `src/components/Navigation.astro` (capture at line 28) |

These custom events are intentionally personless because the site has no account, session, or stable authenticated user identity. The event plan is recorded in `.posthog-wizard-cache/.posthog-events.json`. No event was observed arriving during this run.

## User identification

Identification was skipped. Review found no login, registration, logout, session, user model, or client-side authenticated identity, and no identifier was invented. If authentication is added later, identify a stable non-PII user ID after login and on authenticated refresh, and reset on logout or direct account switching. Do not use an email or username as the distinct ID.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902560) contains three saved insight tiles for the three events above. The insights were created against the intended event names; current ingestion volume was not established by this run.

## Verification and unresolved items

- `npm install` completed successfully; npm reported existing audit vulnerabilities and pending install-script approvals, which were not caused by the PostHog package installation.
- `npm run build` passed with Astro server build and static prerendering.
- No separate lint or typecheck script exists in `package.json`.
- No Content-Security-Policy was found, so no CSP change was needed.
- No browser session or PostHog ingestion check was run. A passing build proves compilation only; it does not prove that captures or exception events flow.
- No build conflict was reported by any step. The only noted package-manager conditions are the existing npm audit findings and pending install-script approvals.

## Next steps

1. Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; confirm the exact names remain documented in `.env.example`.
2. Run the production build and test suite before merging, then exercise the landing-page CTA, topic cards, and repository link in a real browser and confirm the three events appear in PostHog.
3. Trigger a controlled unhandled error or rejected promise in a non-production test environment and confirm Error Tracking receives it.
4. If authentication is introduced, wire stable-ID identification and logout reset at the authentication boundaries described above.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the generated code; the recorded build passed, but no lint/typecheck script exists.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Verify `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are configured in each deployment environment, not just locally, and match the names documented in `.env.example`.
- [ ] In a real browser, click the instrumented CTA, topic cards, and repository link, then confirm the corresponding events arrive in PostHog; this run did not observe ingestion.
- [ ] In a safe test environment, trigger an uncaught error or rejected promise and confirm exception autocapture arrives in PostHog; initialization is at `src/components/posthog.astro:19-20`.

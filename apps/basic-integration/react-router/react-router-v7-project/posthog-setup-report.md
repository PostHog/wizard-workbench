# PostHog setup report

PostHog browser analytics was installed, initialized from environment configuration, connected to authentication and product actions, and paired with a starter dashboard for project 483112.

## What was installed and initialized

- Installed `posthog-js` at `^1.407.8` with npm; `package.json` and `package-lock.json` were updated.
- Created the single browser initialization module at `app/lib/posthog.ts`. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, reports missing configuration during development, and initializes PostHog only when both values are present.
- Imported that singleton from `app/entry.client.tsx`, so browser initialization happens once before client interactions.
- Documented the required keys in `.env.example`; the real values were configured in `.env` through the wizard environment tooling. No token or host is embedded in source.
- Default SDK capture behavior remains enabled. No CSP changes were needed because the app does not ship a Content-Security-Policy.

## Events instrumented

These events were added to the originating browser handlers. The run verified the capture calls and event definitions in source, but did **not** exercise the application in a browser or observe event delivery in PostHog.

| Event name | What it measures | File |
|---|---|---|
| `account_created` | A visitor successfully creates a fake CountryExplorer account. | `app/routes/signup.tsx` |
| `account_logged_in` | An existing user successfully logs in. | `app/routes/login.tsx` |
| `login_failed` | A login attempt fails because the account does not exist. | `app/routes/login.tsx` |
| `account_logged_out` | An authenticated user explicitly logs out. | `app/routes/profile.tsx` |
| `country_claimed` | An authenticated user claims a country for points. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to favorites. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user marks a country as virtually visited. | `app/routes/countries.tsx` |

Country engagement events include country name and region properties, and guards prevent repeated toggle actions from creating duplicate events. No event properties contain email, username, password, or other user-entered PII.

## User identification

Identification was wired, not skipped. `app/context/AuthContext.tsx` identifies users with the stable `FakeUser.id` after login and signup and when restoring a user from local storage on refresh. Email and username are sent as person properties rather than event properties. Logout resets PostHog state, and the logout event is captured before that reset. No placeholder `DISTINCT_ID` values were reported.

## Error tracking

The global React Router error boundary in `app/root.tsx` dynamically loads the browser singleton and calls `posthog.captureException(error)` for uncaught route/render errors. This wiring was verified in source, but an actual exception reaching PostHog was not observed during the run.

## Verification and limitations

- `npm install` completed successfully.
- `npm run typecheck` completed successfully.
- `npm run build` completed successfully for the client and SSR bundles.
- The review found no integration-specific build conflict, configuration defect, CSP issue, or unrelated-change issue.
- npm reported 18 dependency audit vulnerabilities; the review found none attributable to this integration.
- Browser event delivery, error delivery, and dashboard data population were not runtime-tested. The dashboard was created against the planned event names even though the project may not yet have observed those events.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924743)

The dashboard contains five insights: Account activity, Signup to country claim funnel, Country engagement, Login outcomes, and Engagement by country.

## Before you merge

- [ ] Run a full production build and confirm the generated integration remains clean; the relevant PostHog initialization and entrypoint are `app/lib/posthog.ts:1-22` and `app/entry.client.tsx:1-14`.
- [ ] Run the test suite and update any mocks or fixtures for the instrumented handlers in `app/routes/login.tsx:20-43`, `app/routes/signup.tsx:20-42`, `app/routes/countries.tsx:112-172`, and `app/routes/profile.tsx:11-16`.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; the documented names are in `.env.example:1-2` and consumed in `app/lib/posthog.ts:3-4`.
- [ ] If authentication behavior changes, preserve returning-user identification in `app/context/AuthContext.tsx:28-35` so returning sessions do not fragment onto anonymous IDs.
- [ ] Trigger representative signup, login success/failure, logout, and country engagement flows in a deployed/browser environment and confirm the seven events arrive in PostHog; the relevant call sites are `app/routes/signup.tsx:29-35`, `app/routes/login.tsx:25-40`, `app/routes/profile.tsx:11-16`, and `app/routes/countries.tsx:113-169`.
- [ ] Trigger a route/render failure and confirm exception delivery from `app/root.tsx:44-48`.

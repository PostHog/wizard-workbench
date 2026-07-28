# PostHog setup report

PostHog product analytics and React error tracking were added to the React Router application, with six application events defined and a starter dashboard created.

## What was installed and initialized

- Installed `posthog-js` and `@posthog/react` using npm; both are recorded in `package.json` and `package-lock.json`.
- Added the browser singleton in `app/lib/posthog.ts`. It reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `import.meta.env`, initializes once with PostHog defaults, and fails loudly in development when configuration is missing while remaining a production no-op.
- The real values were configured in `.env`; `.env.example` documents the required variable names.
- `app/entry.client.tsx` imports the singleton before hydration and provides it to `PostHogProvider`.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An existing account successfully signs in. | `app/context/AuthContext.tsx` |
| `user_signed_up` | A new account is created successfully. | `app/context/AuthContext.tsx` |
| `user_logged_out` | An authenticated account signs out. | `app/context/AuthContext.tsx` |
| `country_claimed` | An authenticated user claims a country and earns points. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to favorites. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user records a virtual country visit and earns points. | `app/routes/countries.tsx` |

The capture step verified six capture call paths and recorded the event contract in `.posthog-wizard-cache/.posthog-events.json`. The run did **not** observe events arriving in PostHog, so delivery remains unconfirmed.

## User identification

Identification was wired. `app/context/AuthContext.tsx` identifies the stable `FakeUser.id` on returning-session hydration, successful login, and signup. Email and username are sent as identify person properties rather than event properties. Logout resets PostHog before clearing authentication, and switching accounts resets before identifying the replacement account.

## Error tracking

`app/entry.client.tsx` wraps the hydrated router with `PostHogProvider` and `PostHogErrorBoundary`, providing centralized capture for uncaught React errors. The run verified the integration shape but did not exercise a browser error or observe an error arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919820)

The dashboard contains four live insights: authentication events trend, country engagement trend, country claims by region, and a signup-to-country-activation funnel. The dashboard and insights were created successfully, but the run did not verify populated event data.

## Verification and unresolved items

- `npm install`, `npm run typecheck`, and `npm run build` passed. The build produced client and SSR bundles successfully.
- No lint script was available, so linting was not run.
- Browser delivery was not exercised; the run cannot confirm that captures, session replay, or error reports reach PostHog in a deployed environment.
- Build/install notes: the build emitted a non-blocking stale Browserslist-data notice. npm reported 18 existing audit vulnerabilities and pending approval for `core-js` and `esbuild` install scripts; neither blocked installation or validation. No integration-specific build conflict was reported.

## Before you merge

- [ ] Verify `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are set in every deployment environment, not only local `.env`; check `.env.example` and `app/lib/posthog.ts`.
- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the review passed `npm run typecheck` and `npm run build`, but no lint script exists.
- [ ] Run the test suite and update mocks or fixtures for the instrumented handlers in `app/context/AuthContext.tsx` and `app/routes/countries.tsx`.
- [ ] Exercise login, signup, logout, and country actions in a real browser and confirm the six named events arrive in PostHog; inspect capture calls in `app/context/AuthContext.tsx` and `app/routes/countries.tsx`.
- [ ] Trigger a controlled React rendering error and confirm error tracking arrives; inspect the `PostHogErrorBoundary` wrapper in `app/entry.client.tsx`.
- [ ] Confirm the returning-session path still calls `identify` after refresh; inspect the hydration logic in `app/context/AuthContext.tsx`.

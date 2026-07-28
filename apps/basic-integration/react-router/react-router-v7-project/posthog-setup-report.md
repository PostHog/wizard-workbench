# PostHog setup report

PostHog browser analytics, authenticated-user attribution, conversion events, dashboard insights, and global React error tracking were added to the React Router application.

## Installed and initialized

- Installed `posthog-js` (`^1.407.3`) and `@posthog/react` (`^1.10.3`) with npm; `package.json` and `package-lock.json` were updated.
- The shared client is initialized once in `app/posthog.client.ts:1-23` from `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. The client entry imports it before hydration in `app/entry.client.tsx:6`.
- The configured environment keys are present in `.env`, and the names are documented in `.env.example`. No token or host is hardcoded in source.

## Events instrumented

These six capture call sites were added. The run verified their presence by static review; it did **not** observe events arriving in PostHog because the app was not browser-exercised.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An existing account successfully signs in. | `app/routes/login.tsx` |
| `user_signed_up` | A new account is successfully created. | `app/routes/signup.tsx` |
| `country_claimed` | An authenticated user claims an unclaimed country and earns points. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to favorites. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user records a virtual country visit and earns points. | `app/routes/countries.tsx` |
| `user_logged_out` | An authenticated user explicitly logs out. | `app/routes/profile.tsx` |

Country events include non-PII country name and region properties and only fire after the relevant state change succeeds.

## Identity and error tracking

User identification **was wired** in `app/context/AuthContext.tsx:5-18,38-55`: the stable `FakeUser.id` is passed to `posthog.identify` during authenticated hydration, login, and signup. Email and username are sent as person properties, not event properties. Logout calls `posthog.reset()` before the local logout flow at `app/context/AuthContext.tsx:64-66`.

Global client-side React error tracking was added in `app/entry.client.tsx:4,11-15` with `PostHogProvider` and `PostHogErrorBoundary`. The existing route error boundary was preserved. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914309) contains four tagged insights: signup trend, authentication activity trend, country engagement trend, and signup-to-country-claim activation funnel. It is expected to remain empty until events arrive.

## Verification and unresolved points

- `npm install` completed successfully and dependencies were current.
- `npm run build` passed for both client and SSR builds.
- `npm run typecheck` passed (`react-router typegen && tsc`).
- No lint script is defined, so lint could not be run.
- The run did not browser-exercise the application, so event flow, error delivery, and production configuration were not confirmed.
- npm reported pre-existing audit findings and pending install-script approval warnings for `core-js` and `esbuild`; installation and builds still completed successfully. No build conflict was reported.

## Before you merge

- [ ] Run the production build and fix any lint or type errors introduced after this run; review `app/posthog.client.ts:1-23` and `app/entry.client.tsx:1-18`.
- [ ] Run the test suite and update mocks or fixtures for the new analytics and error-boundary code; review capture call sites in `app/routes/login.tsx`, `app/routes/signup.tsx`, `app/routes/countries.tsx`, and `app/routes/profile.tsx`.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only local `.env`; compare against `.env.example` and `app/posthog.client.ts:3-4`.
- [ ] Exercise signup, login, country actions, logout, and an uncaught component error in a deployed build, then confirm the corresponding events and error reports arrive in PostHog; inspect `app/routes/login.tsx`, `app/routes/signup.tsx`, `app/routes/countries.tsx`, `app/routes/profile.tsx`, and `app/entry.client.tsx:11-15`.
- [ ] Confirm the returning-authenticated-session path identifies the stable user before analytics actions; inspect `app/context/AuthContext.tsx:32-40`.

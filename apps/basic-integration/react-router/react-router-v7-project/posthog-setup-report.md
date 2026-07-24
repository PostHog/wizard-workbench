# PostHog setup report

PostHog browser analytics was installed and initialized for the React Router app, with authenticated identity, six product events, global exception autocapture, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-js` version `^1.407.2` with npm; `package.json` and `package-lock.json` were updated.
- Created the browser-only singleton initializer at `app/lib/posthog.ts`.
- The initializer reads `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`, reports missing values during development, and initializes once with PostHog defaults plus exception autocapture.
- `app/entry.client.tsx` imports the initializer before hydration.
- `.env.example` documents the required variables, and the real configured values were written to `.env` through wizard tooling. Production deployment still needs these variables at client-build time.
- No server-side SDK or server-side event capture was added.

## Instrumented events

These are the six event call sites recorded in `.posthog-wizard-cache/.posthog-events.json`. The run verified the call sites by reading the changed files, but did not exercise the application in a browser or observe events arriving in PostHog.

| Event | Measures | File |
|---|---|---|
| `user_logged_in` | A registered user successfully logs in. | `app/routes/login.tsx` |
| `user_signed_up` | A visitor successfully creates an account. | `app/routes/signup.tsx` |
| `country_claimed` | An authenticated user claims an unclaimed country. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to favorites. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user marks a country as virtually visited. | `app/routes/countries.tsx` |
| `user_logged_out` | An authenticated user explicitly logs out. | `app/routes/profile.tsx` |

Country action events are intended to fire only for first-time state changes. Country action handlers now await the singleton import before the existing state mutation and page reload, reducing the risk of a reload abandoning the capture.

## User identification

Identification was wired in `app/context/AuthContext.tsx`. The stable `FakeUser.id` is used on session restoration, login, and signup. Email and username are sent as person properties through identify, not as event properties. Logout and account changes reset PostHog state. The run did not observe identity or events in a live browser session.

## Error tracking

`app/lib/posthog.ts` enables PostHog JS exception autocapture for unhandled browser errors and unhandled promise rejections. This is centralized in the shared initializer; no manual component wrappers were added. The run verified the configuration was present but did not trigger an error and observe an error event in PostHog.

## Dashboard

Created **Analytics basics (wizard)** in project 483112 with five wizard-tagged insights covering signup conversion, authentication activity, country engagement, country claims by region, and country action mix. The insights use the six instrumented event names and are configured to render empty until data arrives.

[Open the Analytics basics dashboard](https://us.posthog.com/project/483112/dashboard/1902689)

## Verification and unresolved issues

- `npm install` completed successfully.
- `npm run build` completed successfully and produced client and SSR bundles.
- `npm run typecheck` completed successfully.
- No lint script is defined in `package.json`.
- No browser delivery test was run, so event delivery, live identity attribution, and exception arrival remain unconfirmed.
- No Content-Security-Policy was found in the inspected project files. If deployment adds one, it must permit the configured PostHog host for the relevant script and connect requests.

The only reported build/install conflict was npm's **18 dependency audit findings and two pending install-script approvals**. Neither prevented installation, build, or typecheck. No build conflict was reported.

## Before you merge

- [ ] Run the full production build and fix any lint or type errors introduced by the integration; the run verified `npm run build` and `npm run typecheck`, but no lint script exists in `package.json`.
- [ ] Run the test suite and update mocks or fixtures if the instrumented call sites require them.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are present with the exact names shown in `.env.example` in every deployment environment, not only local `.env` (`.env.example`; `app/lib/posthog.ts`).
- [ ] In an authenticated browser session, verify returning visitors identify through the restoration path (`app/context/AuthContext.tsx`) and confirm the six event names arrive in PostHog from their call sites (`app/routes/login.tsx`, `app/routes/signup.tsx`, `app/routes/countries.tsx`, `app/routes/profile.tsx`).
- [ ] If deployment adds a Content-Security-Policy, load the app and check the browser console for blocked PostHog script or network requests (`app/lib/posthog.ts`).

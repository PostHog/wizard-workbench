# PostHog setup report

PostHog browser analytics, authenticated-user attribution, six product events, React error tracking, and a starter dashboard were added to the React Router application.

## What was installed and initialized

- Installed `posthog-js` and `@posthog/react` with npm; `package.json` and `package-lock.json` were updated. No server-side SDK was added because this run identified no server event sender.
- Initialized the browser-only PostHog singleton in `app/entry.client.tsx` using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`. The real values were configured in `.env` during the run, and `.env.example` documents the required names. Initialization is guarded when configuration is absent; development logs the missing-variable diagnostic while production remains a no-op.
- The shared `posthog-js` singleton is provided to React through `PostHogProvider` before hydration. No CSP changes were needed because the app does not ship a CSP.

## Events instrumented

These are the events defined in `.posthog-wizard-cache/.posthog-events.json` and wired at the listed call sites. The run did not exercise the application or observe events arriving in PostHog, so ingestion is **unconfirmed**.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | An existing account successfully logs in. | `app/context/AuthContext.tsx` |
| `user_signed_up` | A new account is successfully created. | `app/context/AuthContext.tsx` |
| `country_claimed` | An authenticated user claims a country for the first time. | `app/routes/countries.tsx` |
| `country_liked` | An authenticated user adds a country to favorites for the first time. | `app/routes/countries.tsx` |
| `country_visited` | An authenticated user records a virtual visit to a country for the first time. | `app/routes/countries.tsx` |
| `user_logged_out` | An authenticated user explicitly logs out. | `app/routes/profile.tsx` |

Country events include country metadata and no event PII. Authentication events identify the stable user before capture; email and username are person properties rather than event properties.

## Identity and error tracking

User identification was wired. `FakeUser.id` is used as the stable distinct ID after login, signup, and restoration of a persisted session; logout resets PostHog before clearing the application session. No server-side identity propagation exists in this app. The run did not observe identity or event attribution in PostHog.

`PostHogErrorBoundary` and `PostHogProvider` were added around the hydrated router in `app/entry.client.tsx`, providing a global React rendering-error boundary for PostHog Error Tracking. No thrown error was generated during verification, so error delivery is unconfirmed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926639) contains four tagged insights: authentication activity, country actions, signup-to-country-claim conversion, and country-claim-to-engagement conversion. The dashboard and insights were created successfully, but may remain empty until the app sends events.

## What the run verified

- `npm install` completed successfully with dependencies up to date.
- `npm run build` completed both client and SSR production builds successfully.
- `npm run typecheck` (`react-router typegen && tsc`) completed successfully.
- Review found no unnecessary integration changes, no CSP to update, and no lint script in `package.json`.

## What remains unconfirmed or unresolved

- PostHog ingestion, event delivery, identity attribution, and error delivery were not exercised. A successful build proves compilation only; it does not prove that events flow.
- The dashboard definitions were created from the event contract, not from observed ingestion, and may initially be empty.
- The run reported no unresolved attribution question and no `DISTINCT_ID` placeholder at a capture call site.

## Build and dependency notices

No build conflict occurred. The production build emitted a non-failing stale Browserslist-data notice. npm also reported pre-existing audit vulnerabilities and pending install-script approvals; these did not block installation, build, or typechecking.

## Next steps

1. Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployed browser environment, not only the local `.env`; the exact names are documented in `.env.example`.
2. Exercise signup, login, country claim/like/visit, and logout in a real browser, then confirm the six events and their properties arrive in the linked dashboard.
3. Confirm that a restored session retains the stable user identity and that logout starts an anonymous session rather than attributing later activity to the previous account.
4. Trigger a safe test rendering error in a non-production environment and confirm it appears in PostHog Error Tracking.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the generated integration.
- [ ] Run the test suite; the instrumented call sites in `app/context/AuthContext.tsx`, `app/routes/countries.tsx`, and `app/routes/profile.tsx` may require updated mocks or fixtures.
- [ ] Verify `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in each deploy environment, not just locally; initialization is in `app/entry.client.tsx`.
- [ ] Because auth identification is wired, verify the returning-visitor path in `app/context/AuthContext.tsx` calls identify so refreshed sessions do not fragment onto anonymous IDs.
- [ ] Exercise each capture call site in `app/context/AuthContext.tsx`, `app/routes/countries.tsx`, and `app/routes/profile.tsx` and confirm events arrive in PostHog; the run itself observed no ingestion.

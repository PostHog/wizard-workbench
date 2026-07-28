# PostHog setup report

PostHog browser analytics, anonymous product-event capture, React error tracking, and a starter dashboard were added to the React Router application.

## What was installed and initialized

- Installed `posthog-js` `^1.407.5` and `@posthog/react` `^1.10.3` with pnpm; the lockfile contains the resolved versions.
- Initialized the browser singleton in `app/lib/posthog.client.ts` using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from Vite environment variables.
- The shared client is imported from `app/root.tsx`, initialized once, and keeps SDK defaults enabled. Development builds fail loudly when either variable is missing; production remains a no-op when configuration is unavailable.
- The real environment values were configured in the local `.env` through the wizard; `.env.example` documents both variable names.
- No server SDK was installed because no server-side event sender was identified.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `follower_package_selected` | A visitor selects a fake-follower package, indicating purchase intent. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | A selected fake-follower package completes its simulated purchase and updates local storage. | `app/routes/buy-followers.tsx` |
| `post_like_toggled` | A visitor likes or removes a like from a feed post. | `app/components/PostCard.tsx` |
| `profile_follow_toggled` | A visitor follows back or unfollows a profile follower. | `app/routes/profile.tsx` |

These captures are anonymous and use non-PII event properties. The purchase completion boundary is simulated local-storage state, not real payment confirmation.

## Identity

User identification was skipped. The app has no login, registration, logout, session, or authenticated-user flow. Its static `fakeUser` display handle is not a stable authenticated identifier, so identifying it would merge visitors incorrectly. No `identify()` or `reset()` wiring was added.

If real authentication is introduced, identify the stable user ID after login/registration and when hydrating an existing authenticated session, and reset on logout or before switching accounts.

## Error tracking

`app/root.tsx` now wraps the application with `PostHogProvider` and `PostHogErrorBoundary`, reusing the shared client. This provides global uncaught React exception coverage. The client explicitly leaves console-error capture disabled because the React error boundary is the intended coverage path.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919813) was created with four `(wizard)`-tagged insights: a follower purchase conversion funnel, daily package selections, daily completed purchases, and combined like/follow engagement.

The run created the dashboard and insight definitions, but did not perform a runtime browser delivery test. No event arrival was observed, so event volume and delivery remain unconfirmed; fresh insights may be empty until the instrumented paths are used.

## Verification and unresolved items

- Verified: `pnpm install` completed with the lockfile current.
- Verified: production build passed.
- Verified: typecheck passed.
- Verified: scoped ESLint reported zero errors.
- Not fully clean: scoped ESLint reported 32 non-blocking pre-existing/style warnings, including Prettier formatting warnings and unused imports/parameters that were not safely attributable to this integration.
- Not verified: browser startup, runtime event delivery, PostHog ingestion, or real payment confirmation.
- No Content-Security-Policy was found in shipped project files, so no CSP changes were required.

### Follow-up issue: event delivery is unresolved

The run did not observe any instrumented event arrive in PostHog. Until a user exercises the package selection, simulated purchase completion, post-like, and profile-follow paths in a real browser session and confirms arrival, the dashboard measures are definitions rather than verified live data.

### Follow-up issue: identity attribution is unresolved by design

The application has no stable authenticated user ID. Events therefore remain anonymous, which limits user-level funnels, retention, and attribution. Adding analytics identity without adding a real stable account identifier would incorrectly merge visitors.

## Before you merge

- [ ] Run a full production build from the project root and confirm it still passes after any final application changes; the wizard verified the integration build, not unrelated future edits.
- [ ] Run the test suite and update any mocks or fixtures affected by the new capture calls.
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`; verify the names in `.env.example` and the initialization in `app/lib/posthog.client.ts`.
- [ ] Open the deployed app in a real browser, exercise each handler in `app/routes/buy-followers.tsx`, `app/components/PostCard.tsx`, and `app/routes/profile.tsx`, and confirm the four event names arrive in PostHog.
- [ ] If authentication is added, wire stable-user `identify()` on login and returning-session hydration plus `reset()` on logout/account switch; the integration currently has no identity path.

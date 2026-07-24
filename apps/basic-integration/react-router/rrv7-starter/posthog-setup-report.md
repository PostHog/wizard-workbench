# PostHog setup report

PostHog browser analytics was installed and initialized for the React Router app, with four product events, global React error tracking, and a starter dashboard configured.

## Installed and initialized

- Installed `posthog-js` 1.407.2 and `@posthog/react` 1.10.3 using pnpm. No server SDK was added because the run found no existing server-side PostHog event sender.
- `app/lib/posthog.client.ts` initializes one PostHog client from the environment-backed `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` values. Development throws when either required value is missing; production remains a no-op when configuration is absent.
- `PostHogProvider` is mounted in `app/root.tsx`, and instrumented components use that shared client through `usePostHog()`.
- The environment variable names are documented in `.env.example` and declared in `env.d.ts`.
- The SDK retains its defaults, including autocapture and session recording. No CSP changes were needed because the run found no CSP configuration or reverse proxy.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `follower_package_selected` | A visitor selects a fake-follower package before purchase. | `app/routes/buy-followers.tsx` |
| `fake_followers_purchase_completed` | A visitor completes the simulated fake-follower purchase. | `app/routes/buy-followers.tsx` |
| `post_like_toggled` | A visitor likes or unlikes a feed post. | `app/components/PostCard.tsx` |
| `follow_back_toggled` | A visitor follows or unfollows a suggested bot account. | `app/routes/profile.tsx` |

Each event is captured in its relevant click handler after the action, with operational non-PII properties. The run verified that the call sites and event plan agree; it did **not** observe events arriving in PostHog, so live delivery remains unconfirmed.

## Identity

User identification was skipped. The app has no login, registration, logout, session, or authenticated-user flow, and its only user-like data is a shared static fake demo profile. No stable distinct ID is available, and no `DISTINCT_ID` placeholder was added. If real authentication is introduced, identify after login or registration with the authenticated user’s stable primary key or UUID, and reset on logout or account switch; do not use the demo username.

## Error tracking

`PostHogErrorBoundary` from `@posthog/react` was added inside the provider in `app/root.tsx`, wrapping the route transition/application tree. It uses the SDK’s `captureException` path for uncaught React component errors. Route-level React Router error handling remains separate. The run verified the boundary wiring, but did not trigger an error and therefore did not observe an error event arriving in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902690) contains four attached insights: daily package selections, daily completed purchases, comparative social engagement, and a follower-purchase conversion funnel. The dashboard and insights were created successfully. The insights are expected to remain empty until events are ingested; the run did not verify live event data.

## Verification and unresolved issues

- `pnpm install` completed successfully.
- `pnpm typecheck` passed before and after review fixes.
- `pnpm build` passed before and after review fixes, producing client and SSR bundles. This proves compilation and bundle construction only; it does not prove event or error delivery.
- Scoped lint passed for `app/lib/posthog.client.ts`. Scoped root lint reported one pre-existing unused `WATERMARK` warning.
- A non-mutating full-project lint completed with 107 warnings and zero errors, chiefly pre-existing Prettier and unused-variable warnings in unrelated files. It was not auto-fixed because the package lint script uses `--fix` and could rewrite unrelated files.
- **Unresolved delivery:** no browser session or PostHog ingestion check was recorded. Without exercising the app and checking the project, the four product events, error tracking, and dashboard population remain unconfirmed. Leaving this unresolved means the dashboard may stay empty and production errors or actions may not be observable.
- **Unresolved identity:** the app has no stable authenticated identity. Events are intentionally personless; leaving this unchanged is appropriate for the current demo, but analytics cannot be attributed to individual users until an authentication boundary exists.

## Before you merge

- [ ] Run a full production build and confirm no type or build errors were introduced; the verified build passed, but this should be repeated in the merge environment (`package.json` scripts and the generated integration files).
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented handlers (`app/routes/buy-followers.tsx`, `app/components/PostCard.tsx`, and `app/routes/profile.tsx`).
- [ ] Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deploy environment, not only locally; confirm the exact names in `.env.example` and `env.d.ts`.
- [ ] Exercise package selection, simulated purchase, post liking, and follow-back interactions, then verify the four named events arrive in PostHog and populate the dashboard (`app/routes/buy-followers.tsx`, `app/components/PostCard.tsx`, `app/routes/profile.tsx`).
- [ ] Trigger a controlled React component error in a safe environment and verify the global error boundary produces a PostHog exception event (`app/root.tsx`).
- [ ] If the app later adds authentication, wire `identify` after login/registration and `reset` on logout or account switching at that auth boundary; do not identify visitors with the static demo profile.

## Build conflict

No integration-breaking conflict occurred. Full lint reports pre-existing warning-only formatting and unused-variable issues across the project; the package’s lint script uses `--fix`, so it was not run to avoid rewriting unrelated files.

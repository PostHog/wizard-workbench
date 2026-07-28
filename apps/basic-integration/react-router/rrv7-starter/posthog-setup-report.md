# PostHog setup report

PostHog browser analytics, anonymous product-event capture, centralized React error tracking, and a starter dashboard were added to the React Router application.

## What was installed and initialized

- Installed `posthog-js` 1.407.5 and `@posthog/react` 1.10.3 with pnpm.
- Added browser-only initialization in `app/lib/posthog.client.ts`, using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from environment configuration.
- Imported the singleton from `app/root.tsx`; event call sites reuse that instance rather than initializing PostHog again.
- Added the environment variable names to `.env.example` and declared them in `env.d.ts`. The run recorded the real values in the local `.env` through wizard tooling; secrets are not reproduced here.
- PostHog defaults remain enabled, including default capture behavior. No CSP changes were needed because the review found no shipped CSP.

## Events instrumented

These are the four planned and instrumented events recorded in `.posthog-wizard-cache/.posthog-events.json`:

| Event | What it measures | Source file |
|---|---|---|
| `post_like_toggled` | A visitor likes or removes a like from a feed post. | `app/components/PostCard.tsx` |
| `follower_package_selected` | A visitor selects a fake-follower package before purchase. | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | A visitor completes the simulated fake-follower purchase flow. | `app/routes/buy-followers.tsx` |
| `follow_back_toggled` | A visitor follows back or unfollows a suggested bot account. | `app/routes/profile.tsx` |

The captures use non-PII action context such as post IDs, toggle state, package quantities, and prices. No event delivery was observed during this run; these events remain runtime-unconfirmed.

## User identification

Identification was skipped. The app contains a static `fakeUser` fixture and simulated social data, but no authenticated login, registration, logout, session, backend API, or stable user primary key/UUID boundary. The fixture username was not treated as a stable identity and was not sent for identification. Events are therefore anonymous until a real authenticated stable ID becomes available.

## Error tracking

`PostHogErrorBoundary` from `@posthog/react` wraps the routed application tree in `app/root.tsx`, providing centralized client-side React exception capture for PostHog Error Tracking. The existing React Router error boundary remains unchanged. Error delivery was not observed during this run.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1918327)

The dashboard contains four tiles: follower purchase conversion, post likes over time, follower package selections, and follow-back engagement. The dashboard and insight definitions were created successfully, but may remain empty until events arrive.

## Verification and unresolved items

### Verified by the run

- `pnpm install` completed successfully and the lockfile was current.
- Production build passed before and after the review formatting fix.
- Typecheck passed.
- Scoped ESLint completed with 0 errors.
- The production build emitted a separate browser PostHog client chunk.
- Initialization, capture placement, non-PII event properties, error-boundary placement, and environment-backed configuration were reviewed.

### Not verified by the run

- No browser execution was performed.
- No event was observed arriving in PostHog.
- No error was deliberately triggered and observed in PostHog Error Tracking.
- No authenticated identity flow exists to verify.

### Issues to follow up

- **Anonymous attribution remains unresolved:** there is no stable authenticated user ID boundary. If this remains unresolved, events and errors cannot be reliably attributed across sessions or tied to real users. Add `identify()` after authentication and on authenticated refresh, and `reset()` at logout, using the existing singleton in `app/lib/posthog.client.ts`.
- **Runtime delivery remains unconfirmed:** the build proves compilation and bundling only; it does not prove that the four capture calls reach PostHog. Exercise each action in a real browser session and confirm the corresponding events in PostHog.

## Build and lint conflict

The scoped lint run produced 30 warnings but no errors. The project lint script contains `--fix` and was intentionally not run because it could rewrite unrelated files. The warnings include existing formatting warnings and two pre-existing unused imports: `WATERMARK` in `app/root.tsx` and `setFollowing` in `app/routes/profile.tsx`. No build or typecheck conflict was reported.

## Before you merge

- [ ] Run a full production build in the target environment and fix any lint or type errors introduced by the generated integration; the run verified `pnpm build` and typecheck, but not every deployment configuration.
- [ ] Run the test suite and update mocks or fixtures if the instrumented handlers require them; no test suite was run during this workflow.
- [ ] Confirm `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from `.env.example` are configured in every deploy environment, not only local `.env`; check the initialization call in `app/lib/posthog.client.ts` and the deployment environment configuration.
- [ ] Exercise the four instrumented handlers and confirm `post_like_toggled`, `follower_package_selected`, `follower_purchase_completed`, and `follow_back_toggled` arrive in PostHog; inspect the capture calls in `app/components/PostCard.tsx`, `app/routes/buy-followers.tsx`, and `app/routes/profile.tsx`.
- [ ] If authentication is added later, wire stable non-PII identity and logout reset at the authentication boundary before relying on user-level attribution; start with `app/lib/posthog.client.ts` and the eventual auth/session file.

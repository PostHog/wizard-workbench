# PostHog setup report

PostHog browser analytics, authenticated identity, exception autocapture, eight product events, and a starter dashboard were added to this Next.js Pages Router app.

## Installed and initialized

- Installed `posthog-js` `^1.407.5` and `posthog-node` `^5.46.1` with pnpm; both are recorded in `package.json` and `pnpm-lock.yaml`.
- Initialized the browser SDK once in `pages/_app.tsx` with `posthog.init()`, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from the environment. Defaults were retained.
- Added the public configuration key names to `.env.example`; the real values were configured in `.env` during the run. The environment keys were confirmed present, but event delivery was not observed during this run.
- This is browser-only capture. No server-side `posthog-node` capture was implemented.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | An authenticated user successfully signs in. | `components/login.tsx` |
| `user_signed_up` | A new account is successfully created. | `components/login.tsx` |
| `checkout_started` | A user begins checkout for a selected subscription plan. | `pages/pricing.tsx` |
| `subscription_portal_opened` | A subscriber opens the billing management portal. | `pages/dashboard/index.tsx` |
| `team_member_removed` | A team member is successfully removed. | `pages/dashboard/index.tsx` |
| `team_invitation_sent` | A team owner successfully sends an invitation. | `pages/dashboard/index.tsx` |
| `account_updated` | A user successfully saves account settings. | `pages/dashboard/general.tsx` |
| `user_signed_out` | An authenticated user signs out successfully. | `components/header.tsx` |

The capture step verified seven capture call sites covering these eight event names. Captures occur after successful action responses or successful sign-out transitions, and event properties do not include PII. The run did not observe events arriving in PostHog, so ingestion remains unconfirmed.

## User identification

Identification was wired. Successful sign-in and sign-up identify the user with the database-backed numeric `user.id` converted to a string; email, name, and role are person properties rather than event properties. `components/header.tsx` also re-identifies the authenticated SWR-loaded user after refresh and resets identity after successful sign-out.

## Error tracking

`pages/_app.tsx` enables browser exception autocapture with `capture_exceptions: true`. The run did not trigger or observe an exception arriving in PostHog. Server-side error tracking was not added.

## Dashboard

[Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1918877)

The dashboard contains five attached insights covering authentication activity, checkout starts by plan, team-management activity, signup conversion, and account engagement. PostHog returned dashboard ID `1918877` and insight IDs `10531589`, `10531588`, `10531591`, `10531590`, and `10531587`. The dashboard definitions were created successfully; they may remain empty until the app sends events.

## Verification and unresolved issues

- `pnpm install` completed successfully.
- The production build passed linting, type validation, and compilation, then failed during static page-data collection because `POSTGRES_URL` is absent. This is unrelated to the PostHog changes and prevented a complete production build.
- No lint or standalone typecheck script is defined in `package.json`.
- The run did not start the app, exercise the instrumented flows, or observe captured events, identities, or exceptions in PostHog.
- No stable-id placeholder was left at any capture call site. Server-side capture remains unresolved: API routes have authenticated stable IDs available, but no shared `posthog-node` client or awaited server flush was added. If server events are added later, use the authenticated numeric ID per request and flush before returning; candidate locations include `pages/api/stripe/checkout.ts` and `pages/api/stripe/webhook.ts`.

## Before you merge

- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; verify the names in `.env.example`.
- [ ] Provide `POSTGRES_URL` and run a complete `pnpm build`; confirm no lint, type, or page-data errors remain.
- [ ] Run the project test suite and update mocks or fixtures for the instrumented handlers if needed.
- [ ] Exercise sign-in, sign-up, sign-out, checkout, account update, subscription portal, team removal, and team invitation flows, then confirm the eight event names arrive in PostHog with the expected stable authenticated identity.
- [ ] Trigger a controlled browser exception and confirm exception autocapture appears in PostHog.
- [ ] If the app ships minified browser bundles, wire source-map upload into CI so production stack traces de-minify; see https://posthog.com/docs/error-tracking/upload-source-maps.
- [ ] Because auth identification is wired, verify a returning authenticated session calls `identify` after refresh; inspect `components/header.tsx` around the SWR-loaded-user effect (line 28) before merging.

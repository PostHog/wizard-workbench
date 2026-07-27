# PostHog setup report

PostHog client and server analytics were added to the Next.js Pages Router app, with authenticated identity attribution, eight server-side product events, browser exception autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-js` 1.407.3 and `posthog-node` 5.46.1 with pnpm; `package.json` and `pnpm-lock.yaml` were updated.
- Browser initialization is global in `pages/_app.tsx`, using `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` from environment configuration. Exception autocapture is enabled with `capture_exceptions: true`.
- A shared server client in `lib/posthog-server.ts` uses the same environment configuration, immediate batching, exception autocapture, and production-safe handling for missing configuration. API handlers flush captured events before responding.
- The PostHog environment keys are present locally and documented in `.env.example`.

## Instrumented events

The run verified capture wiring statically. It did **not** exercise the application against a running database or observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | A user successfully authenticates with a password. | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | A new account and team membership are created. | `pages/api/auth/sign-up.ts` |
| `checkout_started` | An authenticated user starts a Stripe checkout session. | `pages/api/stripe/create-checkout.ts` |
| `subscription_activated` | A completed Stripe checkout updates the team subscription. | `pages/api/stripe/checkout.ts` |
| `billing_portal_opened` | An authenticated user opens the Stripe billing portal. | `pages/api/stripe/customer-portal.ts` |
| `account_updated` | An authenticated user successfully updates account details. | `pages/api/account/update.ts` |
| `team_invitation_sent` | An authenticated team member sends an invitation. | `pages/api/team/invite.ts` |
| `team_member_removed` | An authenticated team member removes a team membership. | `pages/api/team/remove-member.ts` |

All eight events use the authenticated stable numeric database user ID as `distinctId` and non-PII operational properties.

## Identification

Identification is wired, not skipped. The browser identifies users with `String(user.id)` immediately after successful sign-in/sign-up in `components/login.tsx` and after authenticated session refresh in `components/header.tsx`. Successful sign-out resets analytics in `components/header.tsx`. Authentication API responses serialize the stable user ID and permitted person properties for that client boundary. Same-origin tracing headers are configured in `pages/_app.tsx` for future server request context.

## Error tracking

Global browser exception autocapture is enabled by the existing PostHog initialization in `pages/_app.tsx` through `capture_exceptions: true`. No manual error wrappers were added. Server-side error autocapture was not separately exercised; the shared server client is configured for exception autocapture according to the capture handoff.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914273)

The dashboard contains the signup-to-activation funnel plus authentication, checkout, subscription, and team collaboration activity insights. These may initially be empty because runtime event delivery was not tested.

## What verification established

- Dependencies installed successfully and remained resolved after `pnpm install`.
- The integration compiled successfully and passed Next.js linting and type checking during `pnpm build`.
- Static review found no PostHog integration fixes required; identity, event names, non-PII properties, and awaited flushes were verified in the edited files.

## Unresolved issue

The full production build could not finish page-data collection because the pre-existing database guard requires `POSTGRES_URL`, which is not configured. This is unrelated to the PostHog changes, but it prevents a complete production-build verification. If left unresolved, deployment/page generation that requires the database will still fail.

Runtime event delivery was not observed, and the existing database-backed authentication, payment, team, and account flows were not exercised in this run. Consequently, the report does not claim that any event was captured in PostHog.

## Before you merge

- [ ] Set `POSTGRES_URL` in the deployment environment and run a complete production build; the current verification stopped during page-data collection in `lib/db/drizzle.ts`.
- [ ] Run the test suite; instrumented API handlers may require updated mocks or fixtures in the relevant test files.
- [ ] Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in every deployment environment, matching the names documented in `.env.example`.
- [ ] Exercise sign-in, sign-up, checkout, subscription activation, billing portal, account update, invitation, and member-removal paths, then confirm the eight event names arrive in PostHog with stable user IDs.
- [ ] Confirm returning authenticated sessions identify users through `components/header.tsx` and that successful logout resets analytics there.

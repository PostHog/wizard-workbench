# PostHog post-wizard report

The wizard integrated PostHog into this Next.js App Router application for browser analytics, session recording, exception capture, authenticated-user identification, and server-side product events. The client SDK initializes from environment variables in `instrumentation-client.ts`; a shared server client flushes events in short-lived server actions and route handlers. Authentication, account management, team management, checkout, and subscription lifecycle actions are instrumented without placing PII in event properties.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signed in to an existing account. | `app/(login)/actions.ts` |
| `user_signed_up` | A user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user signed out. | `app/(login)/actions.ts` |
| `account_updated` | A user successfully updated their account details. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user completed account deletion. | `app/(login)/actions.ts` |
| `team_member_invited` | A user invited a new member to their team. | `app/(login)/actions.ts` |
| `team_member_removed` | A user removed a member from their team. | `app/(login)/actions.ts` |
| `checkout_started` | A team started a subscription checkout flow. | `lib/payments/actions.ts` |
| `checkout_completed` | A subscription checkout completed and the team subscription was saved. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe reported that a subscription was updated. | `app/api/stripe/webhook/route.ts` |
| `subscription_deleted` | Stripe reported that a subscription was deleted. | `app/api/stripe/webhook/route.ts` |

## Next steps

The PostHog MCP endpoint was unavailable during dashboard creation, so the live dashboard, insights, and notebook could not be created. When access is restored, create **Analytics basics (wizard)** with a signup-to-checkout conversion funnel, checkout volume, subscription lifecycle, account deletion, and team invitation insights based on the event names above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code; this run reached successful compilation and type checking but page-data collection stopped because `POSTGRES_URL` was not configured.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` after `/api/user` resolves and that sign-out resets the browser identity.

### Agent skill

We've left an agent skill folder in the project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

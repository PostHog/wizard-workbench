# PostHog post-wizard report

The wizard integrated PostHog into this Next.js App Router application for browser analytics, session recording, exception capture, authenticated-user identification, and server-side business events. Client initialization uses `instrumentation-client.ts`; server captures use a short-lived Node client that is shut down after each operation. PostHog credentials are read from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local` and are not embedded in source code.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_up` | A user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user signed out. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully updated their password. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user updated their account details. | `app/(login)/actions.ts` |
| `team_member_removed` | An authenticated user removed a member from their team. | `app/(login)/actions.ts` |
| `team_member_invited` | An authenticated user invited a new team member. | `app/(login)/actions.ts` |
| `checkout_started` | An authenticated team started a subscription checkout. | `lib/payments/actions.ts` |
| `customer_portal_opened` | An authenticated team opened the subscription management portal. | `lib/payments/actions.ts` |
| `checkout_completed` | A Stripe checkout completed and the team subscription was saved. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | Stripe reported a subscription update or deletion. | `app/api/stripe/webhook/route.ts` |

## Next steps

The dashboard and shareable notebook could not be created because the PostHog MCP endpoint was unavailable during setup. Once it is reachable, create **Analytics basics (wizard)** with signup-to-checkout conversion, checkout completion, subscription changes, account deletion, and team invitation insights based on the events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard reached successful compilation and type checking, but page-data collection stopped because `POSTGRES_URL` was not configured in the build environment.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` after `/api/user` resolves and that logout resets the browser identity.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

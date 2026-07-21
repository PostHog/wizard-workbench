# PostHog post-wizard report

The wizard integrated PostHog into the Next.js App Router application with browser initialization, server-side analytics, authenticated user identification, logout reset behavior, exception capture, and awaited delivery for short-lived server handlers. PostHog configuration is read from `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`; no token or host was embedded in application source.

| Event | Description | File |
| --- | --- | --- |
| `user_signed_in` | A user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_up` | A user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_out` | A user signed out of their account. | `app/(login)/actions.ts` |
| `password_updated` | A user successfully changed their password. | `app/(login)/actions.ts` |
| `account_deleted` | A user deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | A user successfully updated their account profile. | `app/(login)/actions.ts` |
| `team_member_invited` | A user invited a new team member. | `app/(login)/actions.ts` |
| `team_member_removed` | A user removed a member from their team. | `app/(login)/actions.ts` |
| `checkout_started` | A user started the subscription checkout flow. | `lib/payments/actions.ts` |
| `checkout_completed` | A checkout completed and the team subscription was updated. | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Stripe reported an updated or deleted subscription. | `app/api/stripe/webhook/route.ts` |

## Next steps

Dashboard and notebook creation could not be completed because the configured PostHog MCP endpoint was unavailable during this run. The event definitions above are ready to use when creating the requested analytics dashboard.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code. The wizard reached successful compilation and type checking, but page-data collection stopped because `POSTGRES_URL` was not configured.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` by loading an authenticated dashboard session and checking that browser events use the numeric user ID.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

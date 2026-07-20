# PostHog post-wizard report

The wizard integrated PostHog into this Next.js 15 App Router application. It installed the browser and Node SDKs, initialized browser analytics and exception capture in `instrumentation-client.ts`, added a short-lived-safe server client, configured the real project token and host in `.env.local`, identifies authenticated users, resets browser identity on sign-out, and captures key authentication, account, team, checkout, subscription, pricing, and setup actions. Event properties avoid user-entered PII; email and name are sent only as person properties through `identify`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | A user successfully signed in. | `app/(login)/actions.ts` |
| `user_signed_up` | A user successfully created an account. | `app/(login)/actions.ts` |
| `user_signed_out` | An authenticated user signed out. | `app/(login)/actions.ts` |
| `password_updated` | An authenticated user successfully updated their password. | `app/(login)/actions.ts` |
| `account_deleted` | An authenticated user deleted their account. | `app/(login)/actions.ts` |
| `account_updated` | An authenticated user updated their account details. | `app/(login)/actions.ts` |
| `team_member_invited` | A user invited a new member to their team. | `app/(login)/actions.ts` |
| `team_member_removed` | A user removed a member from their team. | `app/(login)/actions.ts` |
| `checkout_completed` | A Stripe checkout completed and the team subscription was updated. | `app/api/stripe/checkout/route.ts` |
| `subscription_changed` | A Stripe webhook updated or deleted a subscription. | `app/api/stripe/webhook/route.ts` |
| `pricing_plan_selected` | A visitor selected a pricing plan to begin checkout. | `app/(dashboard)/pricing/submit-button.tsx` |
| `setup_commands_copied` | A visitor copied the setup commands from the terminal preview. | `app/(dashboard)/terminal.tsx` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and notebook could not be created. Re-run that phase when the MCP service is reachable.

## Verify before merging

- [ ] Provide `POSTGRES_URL`, run a full production build, and fix any lint or type errors introduced by the generated code. The build compiled and type-checked successfully but stopped while collecting page data because `POSTGRES_URL` was missing.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or a bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path calls `identify` after `/api/user` resolves and that login, signup, and sign-out preserve the expected identity lifecycle.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

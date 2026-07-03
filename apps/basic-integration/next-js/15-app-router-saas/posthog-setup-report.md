<wizard-report>
# PostHog post-wizard report

The wizard has instrumented key signup, signin, signout, checkout, and subscription webhook flows across both client and server. Server-side captures were implemented for authentication and Stripe events using a shared PostHog server client. Client-side lightweight captures were added for team management interactions. Environment variables for PostHog were added to .env.local.

| Event name | Description | File |
|---|---|---|
| user_signed_up | User completed signup form and account was created | app/(login)/actions.ts |
| user_signed_in | User successfully signed in | app/(login)/actions.ts |
| user_signed_out | User signed out of the application | app/(login)/actions.ts |
| checkout_completed | Stripe checkout completed and subscription created | app/api/stripe/checkout/route.ts |
| subscription_webhook_received | Stripe webhook for subscription update or deletion was received | app/api/stripe/webhook/route.ts |
| manage_subscription_clicked | User opened Stripe customer portal | lib/payments/stripe.ts |
| team_member_removed | Team member removed via dashboard | app/(dashboard)/dashboard/page.tsx |
| team_member_invited | Team member invited | app/(dashboard)/dashboard/page.tsx |
| user_profile_updated | User updated account details | app/(dashboard)/dashboard/page.tsx |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: Analytics basics (wizard) — https://us.posthog.com/project/483112/dashboard/1796406
- Insights:
  - Signups (last 30 days) — https://us.posthog.com/project/483112/insights/wCFdwLB5
  - Checkouts completed — https://us.posthog.com/project/483112/insights/qmeVYqCx
  - Subscription webhooks — https://us.posthog.com/project/483112/insights/aWM5xWVw
  - User sign outs — https://us.posthog.com/project/483112/insights/gdA17w0s

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added to .env.example and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — client-side identify calls were added on login, ensure returning sessions are identified appropriately.

### Agent skill

The skill folder `.claude/skills/integration-nextjs-app-router` remains in the repository for reference and future automation.

</wizard-report>
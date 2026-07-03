<wizard-report>
# PostHog post-wizard report

The wizard has integrated PostHog into this Next.js App Router project. It added client initialization via instrumentation-client.ts, a server-side PostHog singleton, and targeted event capture across key auth, checkout, subscription, account, and pricing flows. A managed proxy rewrite for PostHog ingestion was configured in next.config.ts. Environment variables were set using .env.local with the correct NEXT_PUBLIC_ naming.

| Event name | Description | File |
|---|---|---|
| auth_sign_in_succeeded | User successfully signed in via server action. | app/(login)/actions.ts |
| auth_sign_in_failed | Sign in attempt failed due to invalid credentials or missing user. | app/(login)/actions.ts |
| auth_sign_up_succeeded | User account created successfully via server action. | app/(login)/actions.ts |
| auth_sign_up_failed | Sign up attempt failed due to existing user or validation errors. | app/(login)/actions.ts |
| account_password_updated | User updated account password successfully. | app/(login)/actions.ts |
| account_deleted | User initiated and completed account deletion. | app/(login)/actions.ts |
| account_updated | User updated account profile details like name or email. | app/(login)/actions.ts |
| team_member_invited | Team owner invited a new member to the team. | app/(login)/actions.ts |
| team_member_removed | Team member was removed from the team by an owner. | app/(login)/actions.ts |
| pricing_get_started_clicked | User clicked the Get Started button on a pricing card. | app/(dashboard)/pricing/submit-button.tsx |
| checkout_started | Checkout session creation started for a selected price plan. | lib/payments/stripe.ts |
| checkout_completed | Checkout flow completed successfully and user redirected to dashboard. | app/api/stripe/checkout/route.ts |
| subscription_updated | Subscription status or plan updated via Stripe webhook. | app/api/stripe/webhook/route.ts |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: Analytics basics (wizard)
  - Auth success rate over time (wizard)
  - Checkout conversion funnel (wizard)
  - Subscription status changes (wizard)
  - Account changes (wizard)
  - Team management actions (wizard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls identify — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

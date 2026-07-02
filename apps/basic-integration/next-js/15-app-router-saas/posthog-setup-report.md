<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js App Router project with PostHog. It added client and server SDK initialization, captured high-value product, authentication, and billing events, and created a PostHog dashboard with insights covering funnels and subscription lifecycle health. Changes were minimal and followed Next.js 15+ guidance to initialize posthog-js in instrumentation-client.ts and use a lightweight server helper for posthog-node.

| Event name | Description | File |
| --- | --- | --- |
| signup_submitted | User submitted the sign up form to create a new account. | app/(login)/actions.ts |
| signin_submitted | User submitted the sign in form to access their account. | app/(login)/actions.ts |
| user_signed_up | User account successfully created and session established. | app/(login)/actions.ts |
| user_signed_in | User successfully authenticated and session established. | app/(login)/actions.ts |
| password_updated | Authenticated user successfully updated their account password. | app/(dashboard)/dashboard/security/page.tsx |
| account_deleted | Authenticated user confirmed and completed account deletion. | app/(login)/actions.ts |
| checkout_started | User clicked Get Started on pricing to begin Stripe checkout flow. | app/(dashboard)/pricing/submit-button.tsx |
| checkout_session_created | Server created a Stripe Checkout session for the user/team. | lib/payments/stripe.ts |
| checkout_completed | Stripe redirected back indicating successful subscription checkout for the user/team. | app/api/stripe/checkout/route.ts |
| subscription_updated | Stripe webhook delivered a subscription update event and it was processed. | app/api/stripe/webhook/route.ts |
| team_member_invited | Owner invited a new team member from team management. | app/(login)/actions.ts |
| team_member_removed | Owner removed a team member from team management. | app/(login)/actions.ts |
| plan_viewed | Visitor viewed the pricing plans card which starts the conversion funnel. | app/(dashboard)/pricing/page.tsx |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: Analytics basics (wizard)
- Insights:
  - Pricing plan views over time
  - Checkout starts vs completions
  - Auth submissions vs successes
  - Subscription lifecycle changes

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

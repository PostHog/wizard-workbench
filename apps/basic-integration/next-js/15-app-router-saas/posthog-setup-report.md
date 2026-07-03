<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js App Router SaaS starter with PostHog product analytics. The setup adds client-side initialization through `instrumentation-client.ts`, a reverse-proxy rewrite in `next.config.ts`, a reusable server capture helper in `lib/posthog-server.ts`, client identification on auth and returning dashboard sessions, and targeted event capture across authentication, pricing, account management, security settings, checkout completion, and Stripe webhook processing. Documentation and env examples were also updated to include the new PostHog configuration.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Captures authentication form submissions for sign in and identifies the returning user. | `app/(login)/login.tsx` |
| `user_signed_up` | Captures authentication form submissions for account creation and identifies the new user. | `app/(login)/login.tsx` |
| `pricing_cta_clicked` | Captures plan selection from the pricing page before checkout begins. | `app/(dashboard)/pricing/submit-button.tsx` |
| `account_updated` | Captures successful account profile updates from the general settings page. | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | Captures successful password changes from the security settings page. | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_requested` | Captures account deletion requests from the security settings page. | `app/(dashboard)/dashboard/security/page.tsx` |
| `user_signed_out` | Captures logout actions from the dashboard header and resets the client identity. | `app/(dashboard)/layout.tsx` |
| `server_user_signed_in` | Captures successful sign in events on the server for authenticated users. | `app/(login)/actions.ts` |
| `server_user_signed_up` | Captures successful sign up events on the server for new accounts. | `app/(login)/actions.ts` |
| `checkout_session_started` | Captures server-side checkout session creation for subscription upgrades. | `lib/payments/actions.ts` |
| `checkout_completed` | Captures successful Stripe checkout completions after subscription activation. | `app/api/stripe/checkout/route.ts` |
| `stripe_subscription_updated` | Captures Stripe webhook subscription updates and deletions on the server. | `app/api/stripe/webhook/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1796219
- Insight: Sign-up to checkout funnel — https://us.posthog.com/project/483112/insights/2ihsSuO6
- Insight: Authentication activity trend — https://us.posthog.com/project/483112/insights/g3IFM8pH
- Insight: Account management actions — https://us.posthog.com/project/483112/insights/6VeqYiwY
- Insight: Billing pipeline activity — https://us.posthog.com/project/483112/insights/KYmEAiVr
- Insight: Pricing CTA volume — https://us.posthog.com/project/483112/insights/r7sYt46m

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

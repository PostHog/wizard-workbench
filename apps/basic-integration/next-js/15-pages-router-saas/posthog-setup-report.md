<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. The integration covers the full user lifecycle: signup, sign-in, subscription checkout, subscription lifecycle changes via Stripe webhooks, team management actions, and sign-out. Both client-side (posthog-js) and server-side (posthog-node) tracking are in place, with user identification wired up on login, signup, and page refresh so that client and server events are correlated to the same distinct ID. A reverse proxy is configured in `next.config.ts` to route PostHog ingestion through the app and avoid ad-blocker interference.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully authenticated and signed in | `pages/api/auth/sign-in.ts` |
| `user_signed_up` | New user registered and created an account | `pages/api/auth/sign-up.ts` |
| `checkout_started` | User initiated checkout for a subscription plan | `pages/pricing.tsx` |
| `subscription_activated` | Subscription activated after completing Stripe checkout | `pages/api/stripe/checkout.ts` |
| `subscription_changed` | Subscription status changed via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Team owner sent an invitation to a new member | `pages/api/team/invite.ts` |
| `team_member_removed` | Team member was removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | User updated their account information (name or email) | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | User opened the Stripe billing portal | `pages/dashboard/index.tsx` |
| `user_signed_out` | User signed out of their account | `components/header.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818206)
- [Signup to subscription funnel (wizard)](https://us.posthog.com/project/483112/insights/KcRwTWKS)
- [New signups over time (wizard)](https://us.posthog.com/project/483112/insights/ERr24PPj)
- [Subscriptions activated over time (wizard)](https://us.posthog.com/project/483112/insights/AQ5Bw9EC)
- [Subscription changes by status (wizard)](https://us.posthog.com/project/483112/insights/Zbzf3x31)
- [Team activity (wizard)](https://us.posthog.com/project/483112/insights/Slg2BNvQ)

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `UserMenu` component in `components/header.tsx` calls `posthog.identify()` whenever the user SWR data resolves, covering page refreshes and navigation for already-logged-in users.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

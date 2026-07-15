<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Next.js 15 Pages Router SaaS starter with PostHog analytics. The integration covers client-side initialization via `instrumentation-client.ts`, a reverse proxy configured in `next.config.ts`, a shared server-side PostHog client in `lib/posthog-server.ts`, user identification on sign-in/sign-up (both client and server), `posthog.reset()` on sign-out, and event capture across all key user actions — authentication, billing, and team management.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Fired when an existing user successfully signs in. | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Fired when a user signs out of the application. | `pages/api/auth/sign-out.ts` |
| `checkout_started` | Fired when a user initiates a Stripe checkout from the pricing page. | `pages/pricing.tsx` |
| `subscription_updated` | Fired when a team's subscription is updated via the Stripe webhook. | `lib/payments/stripe.ts` |
| `subscription_cancelled` | Fired when a team's subscription is cancelled via the Stripe webhook. | `lib/payments/stripe.ts` |
| `team_member_invited` | Fired when a team owner sends an invitation to a new team member. | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired when a team member is removed from the team. | `pages/api/team/remove-member.ts` |
| `account_updated` | Fired when a user updates their account name or email. | `pages/dashboard/general.tsx` |
| `customer_portal_opened` | Fired when a user opens the Stripe customer portal to manage their subscription. | `pages/dashboard/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.i.posthog.com/project/483112/dashboard/1853622)
- [New signups (wizard)](https://us.i.posthog.com/project/483112/insights/wuMqzJ3F)
- [Signup to checkout funnel (wizard)](https://us.i.posthog.com/project/483112/insights/qByOhWOL)
- [Subscription changes (wizard)](https://us.i.posthog.com/project/483112/insights/jQH05OrU)
- [Team member invitations (wizard)](https://us.i.posthog.com/project/483112/insights/A8DU7mL8)
- [Daily active users (wizard)](https://us.i.posthog.com/project/483112/insights/O55MZX1v)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component in `_app.tsx` handles this via SWR, but verify the `/api/user` endpoint correctly returns the authenticated user on page refresh.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

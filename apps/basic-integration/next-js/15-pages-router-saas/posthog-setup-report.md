<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Next.js 15 Pages Router SaaS application. Changes include:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` on the client using the Next.js 15.3+ instrumentation hook, with a reverse-proxy `api_host`, exception capture enabled, and debug mode in development.
- **`lib/posthog-server.ts`** (new): Singleton `posthog-node` client for server-side event capture across all API routes.
- **`next.config.ts`**: Added `/ingest/*` rewrites to proxy PostHog requests through the app, avoiding ad-blockers, plus `skipTrailingSlashRedirect: true`.
- **`components/login.tsx`**: Captures `user_signed_in` / `user_signed_up` events with `posthog.identify()` on successful auth, and `captureException` on errors.
- **`components/header.tsx`**: Captures `user_signed_out` and calls `posthog.reset()` on sign-out.
- **`pages/pricing.tsx`**: Captures `checkout_initiated` with `price_id` when a user clicks "Get Started".
- **`pages/dashboard/general.tsx`**: Captures `account_updated` on successful account save, plus `captureException` on errors.
- **`pages/api/auth/sign-in.ts`**: Server-side `posthog.identify` and `server_user_signed_in` capture with user and team context.
- **`pages/api/auth/sign-up.ts`**: Server-side `posthog.identify` and `server_user_signed_up` capture, noting invite vs. organic sign-up.
- **`pages/api/stripe/create-checkout.ts`**: Captures `checkout_session_created` with price and team IDs.
- **`pages/api/stripe/webhook.ts`**: Captures `subscription_updated` and `subscription_cancelled` with subscription and price details on Stripe webhook events.
- **`pages/api/stripe/customer-portal.ts`**: Captures `customer_portal_accessed` when a user opens the billing portal.
- **`pages/api/team/invite.ts`**: Captures `team_member_invited` with role and team ID.
- **`pages/api/team/remove-member.ts`**: Captures `team_member_removed` with team and member IDs.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully created an account via the sign-up form. | `components/login.tsx` |
| `user_signed_in` | An existing user successfully authenticated via the sign-in form. | `components/login.tsx` |
| `user_signed_out` | A user signed out of their account. | `components/header.tsx` |
| `checkout_initiated` | A user clicked 'Get Started' on a pricing plan to begin checkout. | `pages/pricing.tsx` |
| `account_updated` | A user successfully updated their account name or email in general settings. | `pages/dashboard/general.tsx` |
| `server_user_signed_in` | Server-side confirmation that a user successfully authenticated. | `pages/api/auth/sign-in.ts` |
| `server_user_signed_up` | Server-side confirmation that a new user account was created. | `pages/api/auth/sign-up.ts` |
| `checkout_session_created` | A Stripe checkout session was created for a user selecting a plan. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | A Stripe subscription was updated (e.g. plan change or renewal). | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | A Stripe subscription was cancelled or deleted. | `pages/api/stripe/webhook.ts` |
| `customer_portal_accessed` | A user accessed the Stripe customer billing portal to manage their subscription. | `pages/api/stripe/customer-portal.ts` |
| `team_member_invited` | A team owner sent an invitation to a new member to join the team. | `pages/api/team/invite.ts` |
| `team_member_removed` | A team member was removed from the team. | `pages/api/team/remove-member.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1792461)
- [Sign-up to Sign-in Funnel](https://us.posthog.com/project/483112/insights/Bf0o8GGM)
- [Checkout Conversion Funnel](https://us.posthog.com/project/483112/insights/BKYrxW80)
- [Subscription Cancellations](https://us.posthog.com/project/483112/insights/8M8ZfnoE)
- [New Sign-ups Over Time](https://us.posthog.com/project/483112/insights/pAAnMrHY)
- [Team Collaboration Activity](https://us.posthog.com/project/483112/insights/4FKvdNfV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

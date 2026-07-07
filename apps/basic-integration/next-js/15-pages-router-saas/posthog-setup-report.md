<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js 15 Pages Router SaaS application. PostHog is initialized client-side via `instrumentation-client.ts` with a reverse proxy configured in `next.config.ts` to avoid ad-blockers. A server-side client (`lib/posthog-server.ts`) handles tracking in API routes. Users are identified on login, signup, and page refresh. `posthog.reset()` is called on sign-out. Exception capture is enabled globally via `capture_exceptions: true`.

| Event Name | Description | File |
|---|---|---|
| `signed_up` | User successfully completed the sign-up form and created a new account. | `components/login.tsx` |
| `signed_in` | User successfully authenticated with their credentials and logged in. | `components/login.tsx` |
| `checkout_started` | User clicked Get Started on a pricing plan and initiated the Stripe checkout flow. | `pages/pricing.tsx` |
| `account_updated` | User successfully saved changes to their account name or email. | `pages/dashboard/general.tsx` |
| `team_member_invited` | Team owner successfully sent an invitation to a new team member. | `pages/dashboard/index.tsx` |
| `team_member_removed` | Team owner successfully removed a member from the team. | `pages/dashboard/index.tsx` |
| `subscription_management_opened` | User opened the Stripe customer portal to manage their subscription. | `pages/dashboard/index.tsx` |
| `user_signed_up` | Server-side: new user account and team were created successfully. | `pages/api/auth/sign-up.ts` |
| `user_signed_in` | Server-side: user authenticated successfully via the sign-in API. | `pages/api/auth/sign-in.ts` |
| `user_signed_out` | Server-side: user session was cleared and user signed out. | `pages/api/auth/sign-out.ts` |
| `checkout_session_created` | Server-side: a Stripe checkout session was created for a user and plan. | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Server-side: Stripe webhook confirmed a subscription was updated. | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Server-side: Stripe webhook confirmed a subscription was cancelled. | `pages/api/stripe/webhook.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812173)
- [New User Signups (wizard)](https://us.posthog.com/project/483112/insights/EG4OuG3y)
- [Signup to Checkout Funnel (wizard)](https://us.posthog.com/project/483112/insights/AbZVi3Pk)
- [Subscription Changes (wizard)](https://us.posthog.com/project/483112/insights/z54Uzn2w)
- [Team Member Invitations (wizard)](https://us.posthog.com/project/483112/insights/qOAR1XX1)
- [Daily Sign-ins (wizard)](https://us.posthog.com/project/483112/insights/kxDfjj6o)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogIdentify` component in `_app.tsx` handles this via SWR, but verify it fires correctly when a user refreshes the page while logged in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

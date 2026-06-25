<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) SaaS template. The integration covers client-side analytics via `posthog-js` and `@posthog/react`, server-side event tracking via `posthog-node` through a per-request middleware, user identification on login, and error tracking in the root error boundary. A total of 13 business-critical events are instrumented across authentication, onboarding, organization management, and billing flows.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | A new user account was successfully created via email or OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | User authenticated via email magic link or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`, `login.confirm.ts` |
| `user_logged_out` | User clicked logout and their session was destroyed | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_profile_completed` | User completed the user account profile step during onboarding | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completed the organization creation step during onboarding | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User created a new organization outside of the onboarding flow | `app/routes/_authenticated-routes+/organizations_+/new.tsx` |
| `member_invited_by_email` | An organization admin invited a new team member by email | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/members.tsx` |
| `subscription_checkout_started` | User initiated a Stripe checkout session to subscribe to a plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated cancellation of their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User reversed a pending subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe confirmed a checkout session was completed and a subscription is active | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted the enterprise contact sales form | `app/routes/contact-sales.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1760809)
- **Signup to Purchase Funnel**: [Insight](https://us.posthog.com/project/483112/insights/zK5N5RWC)
- **New User Signups Over Time**: [Insight](https://us.posthog.com/project/483112/insights/gyTLfcep)
- **Revenue Conversions (Checkout Completed) Over Time**: [Insight](https://us.posthog.com/project/483112/insights/QJOYVR9J)
- **Subscription Churn: Cancelled vs Resumed**: [Insight](https://us.posthog.com/project/483112/insights/beMZ0oY8)
- **Onboarding Completion Rate: Signups vs Org Completed**: [Insight](https://us.posthog.com/project/483112/insights/zZSoEoxIags)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any onboarding/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the wizard identifies users in the `_authenticated-routes-layout` loader so every authenticated session is identified, including returning visitors.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

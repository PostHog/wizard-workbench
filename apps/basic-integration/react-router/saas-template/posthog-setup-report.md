<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (framework mode) SaaS template. The integration covers client-side initialization, server-side middleware, user identification, event tracking across critical business flows, and error boundary capture.

## Changes made

**New files:**
- `app/lib/posthog-middleware.ts` — Server-side PostHog middleware that initializes a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client, and shuts down cleanly after each request.
- `.env` — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

**Modified files:**
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling errors.
- `app/entry.client.tsx` — Initializes `posthog-js` with `tracing_headers` to auto-attach PostHog session/distinct ID headers to server requests; wraps the app in `PostHogProvider`.
- `app/root.tsx` — Registers `posthogMiddleware` in the root middleware array; adds `posthog.captureException()` to the error boundary.
- `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` — Captures `user_signed_up` and calls `posthog.identify()` on email/Google registration form submit.
- `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` — Captures `user_logged_in` and calls `posthog.identify()` on email/Google login form submit.
- `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` — Server-side `user_logged_in` capture when email OTP is verified.
- `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` — Server-side `user_logged_in` for returning Google OAuth users; `user_signed_up` for new Google OAuth users.
- `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` — Server-side `onboarding_profile_completed` capture.
- `app/features/onboarding/organization/onboarding-organization-action.server.ts` — Server-side `onboarding_organization_created` capture with company metadata.
- `app/features/organizations/create-organization/create-organization-action.server.ts` — Server-side `organization_created` capture.
- `app/features/billing/billing-action.server.ts` — Server-side captures for `subscription_checkout_started`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched`.
- `app/features/billing/stripe-event-handlers.server.ts` — Server-side `subscription_checkout_completed` capture in the Stripe webhook handler.
- `app/routes/api+/v1+/stripe.webhooks.ts` — Passes `posthog` from context to the checkout-completed handler.
- `app/features/organizations/settings/team-members/team-members-action.server.tsx` — Server-side `team_member_invited` capture.
- `app/features/billing/contact-sales/contact-sales-action.server.ts` — Server-side `contact_sales_submitted` capture.
- `app/features/user-accounts/settings/account/account-settings-action.server.ts` — Server-side `account_deleted` capture before deletion.
- `app/features/organizations/layout/nav-user.tsx` — Client-side `user_logged_out` capture and `posthog.reset()` on logout form submit.
- `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx` — Calls `posthog.identify()` on mount to re-identify returning authenticated users.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User submits the email registration form and begins the signup verification flow. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User completes email OTP verification and is authenticated via magic link. | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user_logged_in` | User completes Google OAuth and is authenticated via the OAuth callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_signed_up` | New user authenticated via Google OAuth for the first time. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User clicks the logout button. | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_profile_completed` | User finishes setting up their profile (name and avatar) during onboarding. | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_created` | User creates their first organization during the onboarding flow. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User creates an additional organization after onboarding. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User opens a Stripe checkout session to begin purchasing a subscription. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe confirms a checkout session is complete and the subscription is activated. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | User initiates a subscription cancellation via the Stripe customer portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was previously set to cancel at period end. | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switches their subscription to a different pricing plan. | `app/features/billing/billing-action.server.ts` |
| `team_member_invited` | An organization admin invites a new member by email. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | User submits the contact-sales form to inquire about enterprise pricing. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `account_deleted` | User permanently deletes their account. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1792625)
- **Signup to Subscription Funnel:** [https://us.posthog.com/project/483112/insights/djsvinxi](https://us.posthog.com/project/483112/insights/djsvinxi)
- **Subscription Churn Trend:** [https://us.posthog.com/project/483112/insights/ZDVbf7Zf](https://us.posthog.com/project/483112/insights/ZDVbf7Zf)
- **New Signups Trend:** [https://us.posthog.com/project/483112/insights/Ae9dn7y4](https://us.posthog.com/project/483112/insights/Ae9dn7y4)
- **Team Growth (Invitations):** [https://us.posthog.com/project/483112/insights/TEuV2k3V](https://us.posthog.com/project/483112/insights/TEuV2k3V)
- **Revenue Events (Completed Checkouts):** [https://us.posthog.com/project/483112/insights/tKm5xOgj](https://us.posthog.com/project/483112/insights/tKm5xOgj)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the sidebar layout's `useEffect` identifies users on every authenticated page mount, covering sessions where the user was already logged in.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

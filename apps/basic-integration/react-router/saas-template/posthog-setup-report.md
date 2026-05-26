<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 (Framework mode) SaaS template. The integration covers client-side tracking via `posthog-js`, server-side tracking via `posthog-node`, and full user identification. Here is a summary of the changes made:

- **`app/entry.client.tsx`** — PostHog JS initialized with your project token and host; wrapped `HydratedRouter` with `PostHogProvider` to make `usePostHog()` available across the app.
- **`app/lib/posthog-middleware.ts`** — New file: server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from client requests, and wires up `withContext()` so server-side events are correlated with client sessions.
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware array so every route inherits the server-side PostHog context.
- **`app/routes/_authenticated-routes+/_authenticated-routes-layout.tsx`** — Added a loader that exposes `userId` and `userEmail`; calls `posthog.identify()` once per authenticated session to associate anonymous events with known users.
- **`app/features/organizations/layout/nav-user.tsx`** — Added `posthog.reset()` on the logout button click to clear the PostHog identity on sign-out.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_login_submitted` | User submitted the login form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_registered` | User submitted the registration form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_signed_up` | Server-side: new user account created after OAuth/email confirmation | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_organization_submitted` | User submitted the organization onboarding form | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User submitted the create new organization form | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User selected a plan and started the Stripe checkout flow | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_plan_switched` | User submitted a request to switch subscription tier | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `contact_sales_submitted` | User submitted the contact sales / enterprise inquiry form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `member_invited_by_email` | Admin submitted email invitation to add a team member | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `checkout_session_completed` | Server-side: Stripe `checkout.session.completed` webhook processed | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `subscription_canceled` | Server-side: user initiated subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Server-side: user resumed a previously cancelled subscription | `app/features/billing/billing-action.server.ts` |

## Next steps

We've set up the following suggested insights for an **Analytics basics** dashboard. Create the dashboard in PostHog and add these insights to track key business metrics:

1. **[Signup funnel](https://us.posthog.com/insights/new#{"events":[{"id":"user_registered","name":"user_registered","type":"events"},{"id":"user_signed_up","name":"user_signed_up","type":"events"},{"id":"onboarding_organization_submitted","name":"onboarding_organization_submitted","type":"events"},{"id":"subscription_checkout_started","name":"subscription_checkout_started","type":"events"},{"id":"checkout_session_completed","name":"checkout_session_completed","type":"events"}],"insight":"FUNNELS"})** — Conversion from registration → email confirmed → onboarding → checkout → paid.

2. **[Daily new registrations](https://us.posthog.com/insights/new#{"events":[{"id":"user_registered","name":"user_registered","type":"events"}],"insight":"TRENDS"})** — Trend of `user_registered` events to track top-of-funnel growth.

3. **[Subscription events over time](https://us.posthog.com/insights/new#{"events":[{"id":"subscription_checkout_started","name":"subscription_checkout_started","type":"events"},{"id":"checkout_session_completed","name":"checkout_session_completed","type":"events"},{"id":"subscription_canceled","name":"subscription_canceled","type":"events"},{"id":"subscription_resumed","name":"subscription_resumed","type":"events"}],"insight":"TRENDS"})** — Side-by-side view of checkout starts, completions, cancellations, and resumes to monitor billing health.

4. **[Plan switch activity](https://us.posthog.com/insights/new#{"events":[{"id":"subscription_plan_switched","name":"subscription_plan_switched","type":"events"}],"insight":"TRENDS"})** — Track how often users upgrade or downgrade their plan.

5. **[Enterprise pipeline](https://us.posthog.com/insights/new#{"events":[{"id":"contact_sales_submitted","name":"contact_sales_submitted","type":"events"}],"insight":"TRENDS"})** — Monitor enterprise inquiry submissions from the contact sales form.

[Create the Analytics basics dashboard](https://us.posthog.com/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

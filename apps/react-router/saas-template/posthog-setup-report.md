<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (framework mode) SaaS template. The integration covers client-side event tracking, user identification, server-side event tracking via middleware, and error capture.

**Changes made:**

- **`app/entry.client.tsx`** — Initialized `posthog-js`, wrapped the app with `PostHogProvider`. Added `__add_tracing_headers` to correlate client and server events.
- **`app/root.tsx`** — Registered `posthogMiddleware` in the middleware chain. Added `posthog.captureException()` in `BaseErrorBoundary` for automatic error tracking.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client, and exposes the client on `context.posthog` via `withContext()` for downstream server event captures.
- **`vite.config.ts`** — Added `ssr.noExternal: ['posthog-js', '@posthog/react']` to prevent SSR bundling issues.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `user_login_submitted` | User submitted the login form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_register_submitted` | User submitted the registration form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `onboarding_user_account_completed` | User completed the user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `organization_created` | User submitted the create organization form | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `member_invited_by_email` | Admin invited a team member by email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `checkout_session_opened` | User initiated a new subscription checkout session (server-side) | `app/features/billing/billing-action.server.ts` |
| `subscription_cancellation_initiated` | User initiated subscription cancellation (server-side) | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription set to cancel at period end (server-side) | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switch_initiated` | User initiated a subscription plan switch (server-side) | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe checkout.session.completed webhook — subscription purchase confirmed (server-side) | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted the Contact Sales form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `account_deletion_submitted` | User submitted the delete account action | `app/features/user-accounts/settings/account/danger-zone.tsx` |

## Next steps

We've prepared five key insights to add to your "Analytics basics" dashboard. [Create the dashboard in PostHog](https://us.posthog.com/project/2/dashboards) and add these insights:

1. **Registration funnel** — Funnel from `user_register_submitted` → `onboarding_user_account_completed` → `organization_created`. Shows where new users drop off during signup.
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new)

2. **Subscription conversion funnel** — Funnel from `checkout_session_opened` → `checkout_completed`. Tracks how many users who start checkout actually complete a purchase.
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new)

3. **Subscription churn trend** — Trend of `subscription_cancellation_initiated` over time. Helps identify when churn spikes.
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new)

4. **Daily active registrations** — Trend of `user_register_submitted` (email vs Google) broken down by `method` property. Shows daily signups and preferred auth method.
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new)

5. **Team growth** — Trend of `member_invited_by_email` over time. Shows how actively teams are growing within the product.
   - [Create in PostHog](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

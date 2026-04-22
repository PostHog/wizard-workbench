<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 SaaS template. The integration includes:

- **Client-side initialization** via `app/entry.client.tsx` using `posthog-js` and `@posthog/react`, with automatic session tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) sent to the server on every request for cross-environment user correlation.
- **Server-side middleware** (`app/lib/posthog-middleware.server.ts`) using `posthog-node`, registered in `app/root.tsx` as the first middleware in the chain. It creates a PostHog client per request, extracts session/distinct IDs from headers, and uses `withContext()` so all server events automatically correlate with the correct user and session.
- **Error boundary** in `app/root.tsx` calling `posthog.captureException()` to capture unhandled React Router errors.
- **14 business-critical events** covering the full user lifecycle: registration, sign-in, onboarding, organization management, team invites, billing, and sales.
- **vite.config.ts** updated to mark `posthog-js` and `@posthog/react` as SSR-safe externals.
- **Environment variables** set in `.env` (`VITE_PUBLIC_POSTHOG_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`).

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | Fired when an existing user successfully completes authentication | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_signed_up` | Fired when a new user account is created after OAuth/OTP callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `invite_accepted` | Fired when a user accepts an email invite or invite link | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_organization_created` | Fired when a user creates their organization during onboarding | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Fired when an authenticated user creates a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `member_invited_by_email` | Fired when an org admin successfully sends an email invite | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `member_role_changed` | Fired when a member's role or status is changed | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `checkout_session_initiated` | Fired when a user opens a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired when a user initiates subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired when a subscription set to cancel is resumed | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | Fired when a user initiates a plan switch | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Server-side: fired when Stripe checkout.session.completed webhook fires | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Server-side: fired when Stripe customer.subscription.deleted webhook fires | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | Fired when the contact sales form is submitted successfully | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior based on the events instrumented above. Visit your [PostHog project](https://us.posthog.com/project/2) to create a dashboard named "Analytics basics" and add these insights:

1. **Signup-to-paid conversion funnel** — Funnel from `user_signed_up` → `onboarding_organization_created` → `checkout_session_initiated` → `subscription_checkout_completed`
2. **Active users over time** — Trend of `user_signed_in` unique users per day/week
3. **Subscription health** — Trend comparing `subscription_checkout_completed` vs `subscription_cancelled` vs `subscription_deleted`
4. **Team growth** — Trend of `member_invited_by_email` events over time, broken down by `invited_role`
5. **Sales pipeline** — Total count of `contact_sales_submitted` events, with a breakdown by `company_name`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

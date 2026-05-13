<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your React Router v7 SaaS template. Here's a summary of everything that was set up:

## What was done

- **Installed** `posthog-js`, `@posthog/react`, and `posthog-node` packages
- **Initialized** PostHog client-side in `app/entry.client.tsx` with `PostHogProvider` wrapping `HydratedRouter`, and configured a reverse proxy via `vite.config.ts`
- **Created** a server-side PostHog middleware (`app/lib/posthog-middleware.server.ts`) that creates a `posthog-node` client per request, reads `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and uses `withContext()` to correlate server events with the same user session
- **Added** the PostHog middleware to the root route middleware chain (`app/root.tsx`) alongside existing security and i18n middleware
- **Added** error capture (`captureException`) in the root `ErrorBoundary` to automatically track unhandled errors
- **Added** user identification in the authenticated sidebar layout: `posthog.identify()` is called with the user's email and name when they access any organization page
- **Instrumented** 10 key business events across client-side routes and server-side actions (see table below)

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `login_email_submitted` | User submits the email login form | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `registration_email_submitted` | User submits the email registration form | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_signed_up` | New user account created in the database after OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `contact_sales_submitted` | User submits the contact sales form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `onboarding_user_account_completed` | User completes the user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completes the organization onboarding step | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `subscription_checkout_started` | User initiates a Stripe checkout session for a new subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User cancels their subscription by opening the cancel portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switches their subscription plan via the billing portal | `app/features/billing/billing-action.server.ts` |

## Next steps

We've identified your existing "Analytics basics" dashboard and the key insights you'll want to build once events start flowing:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/1344803)

Recommended insights to add to your dashboard:

1. **Signup-to-Onboarding Funnel** — `registration_email_submitted` → `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed`
2. **Subscription Conversion** — Users who completed onboarding and then triggered `subscription_checkout_started`
3. **Subscription Health** — Trend of `subscription_checkout_started` vs `subscription_cancelled` vs `subscription_resumed`
4. **Contact Sales Leads** — Count of `contact_sales_submitted` over time
5. **Churn Risk** — Users with `subscription_cancelled` who haven't had `subscription_resumed`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

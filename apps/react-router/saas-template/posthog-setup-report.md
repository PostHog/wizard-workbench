# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the React Router 7 Framework mode SaaS template. The integration covers both client-side and server-side tracking, user identification, and business-critical event capture across authentication, billing, and team management flows.

**Changes made:**

- **Package installation** — `posthog-js`, `@posthog/react`, and `posthog-node` added as dependencies
- **Environment variables** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added to `.env`
- **`vite.config.ts`** — Added `/ingest` reverse proxy to PostHog host and `ssr.noExternal` for SSR bundling compatibility
- **`app/entry.client.tsx`** — Initialised `posthog-js` with tracing headers support and wrapped the React tree with `PostHogProvider`
- **`app/lib/posthog-middleware.server.ts`** — Created a React Router middleware that instantiates `PostHog` (Node SDK) per-request, uses `withContext()` to correlate server/client sessions, and flushes after the response
- **`app/root.tsx`** — Added `posthogMiddleware` to the root middleware chain; added `captureException` to the error boundary
- **Auth, billing, and team routes** — Instrumented 12 business-critical events (see table below)

| Event | Description | File |
|---|---|---|
| `user_registered` | User submitted the registration form with email | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User successfully submitted the login form with email or Google | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_signed_up` | New user account created after OAuth/email confirmation callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiated a Stripe checkout session for a subscription plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated cancellation of their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `subscription_completed` | Stripe checkout session completed and subscription was created | `app/features/billing/stripe-event-handlers.server.ts` |
| `team_member_invited` | Admin invited a team member by email | `app/features/organizations/settings/team-members/team-members-action.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `subscription_payment_success_viewed` | User viewed the billing success page after completing a checkout | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Signup → Subscription funnel** — Funnel insight with steps: `user_registered` → `organization_created` → `subscription_checkout_started` → `subscription_completed`. Reveals where users drop off on the path to paid.

2. **New signups over time** — Trend insight for `user_signed_up` (daily/weekly). Tracks top-of-funnel growth.

3. **Subscription health** — Trend insight comparing `subscription_completed` vs `subscription_cancelled` over time. Monitors churn vs new MRR.

4. **Team growth** — Trend insight for `team_member_invited`. Indicates product-led growth and expansion within accounts.

5. **Errors captured** — Trend insight for `$exception` (PostHog's built-in error tracking event). Monitors application stability alongside business events.

Visit your PostHog project to create the dashboard: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

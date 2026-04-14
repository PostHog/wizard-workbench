<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 framework-mode SaaS template. The integration covers client-side initialization with PostHog.js, server-side tracking with posthog-node via a global middleware, user identification, error tracking, and 12 business-critical events across the authentication, onboarding, billing, and team management flows.

**Changes made:**

- **`app/lib/posthog-middleware.server.ts`** — New server-side PostHog middleware using React Router v7's typed `createContext` API. Initializes a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` tracing headers from the client, and calls `withContext()` to associate all server-side events with the correct user session.
- **`app/entry.client.tsx`** — Initializes `posthog-js` with `__add_tracing_headers` so all React Router form submissions automatically carry session/distinct ID headers to the server. Wraps the app in `PostHogProvider`.
- **`app/root.tsx`** — Adds `posthogMiddleware` to the global middleware chain so the PostHog context is available in every route. Adds `posthog.captureException()` in the root error boundary.
- **`vite.config.ts`** — Adds `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- **`app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx`** — Calls `posthog.identify(userId, { email })` on the client once the user is loaded into an authenticated layout, correlating all future client-side events to the correct person.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User completed email registration via OTP | `app/routes/_user-authentication+/_anonymous-routes+/register.confirm.ts` |
| `user_logged_in` | User verified magic-link login | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `onboarding_user_account_completed` | User set name and profile photo | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User created their first organization with company details | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User created an additional organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiated Stripe checkout for a plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User opened the cancellation portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription set to cancel | `app/features/billing/billing-action.server.ts` |
| `checkout_session_completed` | Stripe confirmed a successful checkout (server webhook) | `app/routes/api+/v1+/stripe.webhooks.ts` |
| `member_invited_by_email` | Admin sent an email invite to a new team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | Visitor submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA (top of billing funnel) | `app/features/billing/create-subscription-modal-content.tsx` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Signup → Subscription funnel** — Funnel insight with steps: `user_signed_up` → `onboarding_organization_completed` → `subscription_checkout_started` → `checkout_session_completed`. Tracks the full conversion path from registration to paid.

2. **New signups over time** — Trend insight for `user_signed_up`, grouped by day/week. Useful for spotting growth trends and the effect of marketing campaigns.

3. **Subscription health** — Trend insight showing `checkout_session_completed`, `subscription_cancelled`, and `subscription_resumed` on a single chart. Gives a quick read on revenue health.

4. **Team growth** — Trend insight for `member_invited_by_email`, grouped by week. Shows how quickly teams are growing within the product.

5. **Sales pipeline** — Trend insight for `contact_sales_submitted` and `pricing_plan_clicked`. Measures top-of-funnel enterprise interest and pricing page engagement.

To create these in PostHog, navigate to **Insights → New insight** in your PostHog project (Project ID: 2) and add them to a new **"Analytics basics"** dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

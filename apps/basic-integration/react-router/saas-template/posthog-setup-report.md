<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS application. Here is a summary of all changes made:

**Client-side setup (`app/entry.client.tsx`):** PostHog JS initialized with `posthog.init()` and the entire app wrapped in `<PostHogProvider>`, enabling the `usePostHog()` hook across all routes. Tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) are added to same-origin requests, correlating client and server events automatically.

**Server-side middleware (`app/lib/posthog-middleware.ts`):** A new PostHog Node SDK middleware creates a per-request PostHog client, extracts session and distinct IDs from request headers, and makes the client available on `context.posthog` for server-side event capture. Registered in `app/root.tsx` alongside the existing security and i18n middlewares.

**Error tracking (`app/root.tsx`):** The global `ErrorBoundary` now calls `posthog?.captureException(error)` to capture unhandled errors.

**Vite config (`vite.config.ts`):** Added `ssr: { noExternal: ['posthog-js', '@posthog/react'] }` to prevent SSR build errors.

**Environment variables (`.env`):** `VITE_POSTHOG_TOKEN` and `VITE_POSTHOG_HOST` configured.

**14 business events** were instrumented across authentication, onboarding, billing, team management, and churn flows (see table below).

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | User submitted the registration form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | User submitted the login form (email or Google) | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `onboarding_user_account_completed` | User completed user account onboarding (name + avatar) | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `onboarding_organization_completed` | User completed organization onboarding (name, size, type, referral) | `app/routes/_authenticated-routes+/onboarding+/organization.tsx` |
| `organization_created` | User created a new organization | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `subscription_checkout_started` | User initiated subscription checkout | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_checkout_completed` | Stripe checkout session completed (server-side webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | User initiated subscription cancellation | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `subscription_plan_switched` | User submitted a plan upgrade or downgrade | `app/features/billing/cancel-or-modify-subscription-modal-content.tsx` |
| `contact_sales_submitted` | User submitted enterprise Contact Sales form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `team_member_invited_by_email` | Admin sent an email invitation to a team member | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `invite_accepted` | User accepted an organization invite (server-side) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `account_deleted` | User deleted their account | `app/features/user-accounts/settings/account/danger-zone.tsx` |
| `pricing_page_viewed` | User viewed the public pricing page (top of conversion funnel) | `app/routes/pricing.tsx` |

**User identification:** `posthog.identify()` is called with the user's email at login and signup form submission, linking anonymous activity to known users.

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Signup & Login Trend** — Trends insight: `user_signed_up` and `user_logged_in` over time, broken down by `method` (email vs. google)
   - [Create in PostHog](/insights/new#{"insight":"TRENDS"})

2. **Onboarding Funnel** — Funnel insight: `pricing_page_viewed` → `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed`
   - [Create in PostHog](/insights/new#{"insight":"FUNNELS"})

3. **Subscription Conversion Funnel** — Funnel insight: `subscription_checkout_started` → `subscription_checkout_completed`
   - [Create in PostHog](/insights/new#{"insight":"FUNNELS"})

4. **Churn Events** — Trends insight: `subscription_cancelled` and `account_deleted` over time
   - [Create in PostHog](/insights/new#{"insight":"TRENDS"})

5. **Enterprise Pipeline** — Trends insight: `contact_sales_submitted` over time, and `team_member_invited_by_email` as a signal of organization growth
   - [Create in PostHog](/insights/new#{"insight":"TRENDS"})

Once the insights are created, add them to a new dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

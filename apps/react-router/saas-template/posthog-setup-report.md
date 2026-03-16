<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 SaaS template. The integration covers client-side tracking, server-side event capture, user identification, and error tracking.

**Changes made:**

- **`app/entry.client.tsx`** — Initialized `posthog-js` with `PostHogProvider` wrapping the app. Tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) are automatically sent to the server so client and server events are correlated per user.
- **`app/lib/posthog-middleware.ts`** _(new file)_ — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts session/distinct IDs from headers, and makes the client available on `context.posthog` for all route handlers.
- **`app/root.tsx`** — Registered `posthogMiddleware` alongside existing middleware; added `posthog?.captureException(error)` in the `ErrorBoundary` for automatic unhandled error tracking.
- **`vite.config.ts`** — Added `ssr.noExternal: ['posthog-js', '@posthog/react']` to prevent SSR bundling issues.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **User identification** — Added `posthog?.identify()` in `_sidebar-layout.tsx` (authenticated area) so authenticated users are identified with their email and name.
- **14 business events** — Added across authentication, onboarding, billing, and landing page flows (see table below).

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | New user account created after OAuth/email callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user authenticated via OAuth/email callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_user_account_completed` | User completed personal account setup (name, avatar) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | User completed organization setup (name, logo) | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Authenticated user created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiated a subscription checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a cancelled subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switched subscription to a different plan | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe checkout session completed - payment confirmed (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | User submitted the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `invite_link_accepted` | Authenticated user accepted an organization invite link | `app/features/organizations/accept-invite-link/accept-invite-link-action.server.ts` |
| `register_cta_clicked` | User clicked register CTA in the hero section | `app/features/landing/hero.tsx` |
| `register_cta_clicked` | User clicked register CTA in the bottom CTA section | `app/features/landing/cta.tsx` |

## Next steps

We recommend creating the following insights in your PostHog project at https://us.posthog.com/project/2:

1. **User Signup Funnel** — Funnel: `register_cta_clicked` → `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed`
2. **Subscription Conversion** — Funnel: `user_signed_up` → `subscription_checkout_started` → `checkout_completed`
3. **Daily Signups** — Trend: `user_signed_up` over time (daily)
4. **Subscription Events** — Trend: `subscription_checkout_started`, `checkout_completed`, `subscription_cancelled`, `subscription_resumed`, `subscription_plan_switched`
5. **Contact Sales Submissions** — Trend: `contact_sales_submitted` over time

Group these into an **"Analytics basics"** dashboard for at-a-glance monitoring of your key business metrics.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>

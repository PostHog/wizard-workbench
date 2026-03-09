# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router 7 (Framework mode) SaaS template. The integration includes client-side analytics via `posthog-js` and `@posthog/react`, server-side event capture via `posthog-node`, a React Router v8 middleware for propagating PostHog context across all server actions, user identification in the main authenticated layout, error boundary tracking, and 15 custom events spanning the full user lifecycle — from signup through billing, collaboration, and account deletion.

## Changes made

### New files
- `app/lib/posthog-middleware.ts` — React Router v8 middleware that initialises a `posthog-node` client per request, injects it into the router context, and uses `posthog.withContext()` for automatic session/distinctId propagation from client headers.

### Modified files
- `.env` — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST`
- `app/entry.client.tsx` — Initialised `posthog-js` with `posthog.init()` and wrapped `<HydratedRouter>` in `<PostHogProvider>`; added `__add_tracing_headers` so server actions receive session and distinct IDs automatically
- `app/root.tsx` — Added `posthogMiddleware` to the middleware array; added `posthog.captureException()` in `BaseErrorBoundary`
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to prevent SSR bundling issues
- `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/_sidebar-layout.tsx` — Added client-side `posthog.identify()` in a `useEffect` to associate authenticated users with their email and name
- `app/features/user-authentication/login/login-action.server.ts` — `user_logged_in` (email method)
- `app/features/user-authentication/registration/register-action.server.ts` — `user_signed_up` (email method)
- `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` — `user_logged_in` (google) + `user_signed_up` for new OAuth users
- `app/features/onboarding/organization/onboarding-organization-action.server.ts` — `onboarding_organization_completed`
- `app/features/organizations/create-organization/create-organization-action.server.ts` — `organization_created`
- `app/features/billing/billing-action.server.ts` — `subscription_checkout_started`, `subscription_cancelled`, `subscription_resumed`
- `app/features/billing/stripe-event-handlers.server.ts` — `subscription_checkout_completed`, `subscription_deleted` (via Stripe webhooks)
- `app/features/organizations/settings/team-members/team-members-action.server.tsx` — `team_member_invited`
- `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` — `paste_created`, `paste_deleted`
- `app/features/billing/contact-sales/contact-sales-action.server.ts` — `contact_sales_submitted`
- `app/features/user-accounts/settings/account/account-settings-action.server.ts` — `account_deleted`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User submitted the registration form with email (OTP sent). Top of signup funnel. | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_logged_in` | User successfully initiated login with email or Google. | `app/features/user-authentication/login/login-action.server.ts`, `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User triggered a logout action. | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_organization_completed` | User completed the organisation onboarding step, providing org name, size, and type. | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | User created a new organisation after onboarding. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | User initiated a Stripe checkout session to subscribe. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiated the subscription cancellation flow. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumed a subscription that was set to cancel at period end. | `app/features/billing/billing-action.server.ts` |
| `subscription_checkout_completed` | Stripe webhook confirmed checkout session completed — subscription activated. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Stripe webhook confirmed subscription was deleted. | `app/features/billing/stripe-event-handlers.server.ts` |
| `team_member_invited` | Admin invited a team member via email. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `paste_created` | User created a new paste. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste_deleted` | User deleted a paste. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `contact_sales_submitted` | User submitted the contact sales form — enterprise lead. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `account_deleted` | User deleted their account. | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

We've suggested the following insights for an "Analytics basics" dashboard to keep an eye on user behaviour. Create a new dashboard at [https://us.posthog.com/dashboard](https://us.posthog.com/dashboard) and add these insights:

1. **Signup → Activation funnel** — Funnel: `user_signed_up` → `onboarding_organization_completed` → `subscription_checkout_completed`. Shows how many signups convert to paying customers.
2. **Subscription conversion** — Trend: `subscription_checkout_started` vs `subscription_checkout_completed`. Highlights checkout drop-off.
3. **Churn overview** — Trend: `subscription_cancelled` and `subscription_deleted` over time. Tracks churn signals.
4. **Feature engagement** — Trend: `paste_created` and `team_member_invited` over time. Measures core product usage.
5. **Enterprise pipeline** — Trend: `contact_sales_submitted` over time. Tracks enterprise lead volume.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

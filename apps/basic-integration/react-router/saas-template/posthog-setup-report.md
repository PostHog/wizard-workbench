# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics, session replay, and error tracking into this React Router v7 SaaS template.

## What was set up

### Client-side (posthog-js + @posthog/react)
- **`app/entry.client.tsx`**: Initialized `posthog-js` with `PostHogProvider` wrapping the app. The `__add_tracing_headers` option is enabled so the browser automatically sends `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to the server, linking client and server events.
- **`app/root.tsx`**: Registered the `posthogMiddleware` alongside existing middleware, and added `posthog.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **`vite.config.ts`**: Added `ssr: { noExternal: ['posthog-js', '@posthog/react'] }` to prevent SSR errors.

### Server-side (posthog-node)
- **`app/lib/posthog-middleware.ts`**: Created a React Router middleware that initializes a PostHog Node client per request, extracts session/distinct ID from request headers, and uses `withContext()` so all server-side events are automatically correlated with the client session.
- **`app/lib/posthog-server.ts`**: Created a standalone PostHog client factory used in Stripe webhook handlers (which don't have access to the request context).

### User identification & lifecycle
- **`app/routes/.../organizations_+/$organizationSlug+/_sidebar-layout.tsx`**: Calls `posthog.identify(userId, { email, name })` when an authenticated user loads any org page.
- **`app/features/organizations/layout/nav-user.tsx`**: Calls `posthog.reset()` when the user clicks the logout button.
- **`app/lib/posthog-middleware.ts`**: Configured with `.env` env vars (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `registration_submitted` | User submits the registration form (email OTP or Google OAuth) | `app/features/user-authentication/registration/register-action.server.ts` |
| `user_registered` | New user account created after OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `login_submitted` | User submits the login form (email OTP or Google OAuth) | `app/features/user-authentication/login/login-action.server.ts` |
| `organization_created` | New organization created during onboarding | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_initiated` | User opens a Stripe checkout session to subscribe | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | User initiates cancellation of their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User resumes a subscription that was set to cancel | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | User switches to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Stripe webhook confirms checkout session completed | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Stripe webhook confirms subscription was deleted | `app/features/billing/stripe-event-handlers.server.ts` |
| `member_invited` | Admin/owner sends an email invitation to a new member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `member_role_changed` | Admin/owner changes a member's role or status | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | User submits the enterprise contact-sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with these suggested insights:

1. **[Signup → Onboarding funnel](/insights/new?insight=FUNNELS)** — Funnel: `registration_submitted` → `user_registered` → `organization_created`
2. **[Subscription conversion](/insights/new?insight=FUNNELS)** — Funnel: `checkout_initiated` → `checkout_completed`
3. **[Registrations over time](/insights/new?insight=TRENDS)** — Trend: `user_registered` daily/weekly
4. **[Subscription churn](/insights/new?insight=TRENDS)** — Trend: `subscription_deleted` and `subscription_cancelled` over time
5. **[Team growth](/insights/new?insight=TRENDS)** — Trend: `member_invited` and `member_role_changed` over time

You can create a new dashboard at [/dashboard](/dashboard) and add these insights to it.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

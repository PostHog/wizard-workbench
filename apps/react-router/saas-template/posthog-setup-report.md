<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS template. The integration covers client-side initialization, server-side middleware, user identification, event tracking across critical user flows, and error boundary capture.

**What was done:**
- Installed `posthog-js`, `@posthog/react`, and `posthog-node`
- Added `PostHogProvider` wrapping in `entry.client.tsx` with `__add_tracing_headers` to correlate client and server sessions
- Created `app/lib/posthog-middleware.ts` — a React Router v7 middleware that initializes a PostHog Node client per request, extracts session/distinct ID headers from the client SDK, and wraps the request lifecycle with `posthog.withContext()` for automatic user correlation
- Added `posthogMiddleware` to the root middleware array in `app/root.tsx` alongside the existing security and i18n middleware
- Added PostHog error tracking (`captureException`) to the root `ErrorBoundary`
- Added user identification via `posthog.identify()` in the sidebar layout component (runs on every authenticated org route visit)
- Added environment variables `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env` and `env.server.ts`
- Updated `vite.config.ts` with `ssr.noExternal` for PostHog packages
- Instrumented 11 business events across auth, onboarding, billing, and team management flows

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user account created via auth callback (email/Google) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user successfully logs in via auth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `organization_created` | User creates a new organization from /organizations/new | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `onboarding_completed` | User completes organization onboarding step | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_session_opened` | User initiates a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_started` | Stripe webhook: checkout session completed (subscription purchased) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Stripe webhook: subscription deleted/cancelled | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_resumed` | User resumes a subscription set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `member_invited` | Admin invites a team member via email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | User submits the contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `subscription_checkout_succeeded` | Client-side: user lands on billing success page after checkout | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |

## Next steps

We've set up event tracking for your key business flows. To monitor user behavior, create an "Analytics basics" dashboard in PostHog with these recommended insights:

- **Signup → Onboarding → Subscription funnel**: `user_signed_up` → `onboarding_completed` → `subscription_started`
- **Subscription conversion rate**: Unique users who fired `checkout_session_opened` vs `subscription_started`
- **Churn trend**: `subscription_cancelled` over time
- **Team growth**: `member_invited` over time
- **New signups trend**: `user_signed_up` unique users per day/week

Visit your PostHog project to create these insights: https://us.i.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

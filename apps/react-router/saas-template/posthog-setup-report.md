# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog is now instrumented across the full React Router v7 (Framework mode) SaaS template — covering client-side pageview tracking, server-side event capture via per-request middleware, error tracking, and session stitching between browser and server.

**What was set up:**

- **Client-side SDK** (`posthog-js` + `@posthog/react`): Initialized in `entry.client.tsx` with `PostHogProvider`. Automatic pageview capture and session recording are enabled. `__add_tracing_headers` passes session/distinct IDs to the server so client and server events are stitched together.
- **Server-side SDK** (`posthog-node`): A `posthogMiddleware` is registered in `root.tsx` that creates a PostHog Node client per request, associates it with the user's session via request headers, and shuts down cleanly after each response.
- **Error tracking**: `ErrorBoundary` in `root.tsx` calls `posthog.captureException(error)` to capture unhandled errors with full context.
- **12 business events** tracked across authentication, onboarding, organizations, billing, and team management.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added to `.env`.
- **SSR compatibility**: `ssr.noExternal` added to `vite.config.ts` for `posthog-js` and `@posthog/react`.

## Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | Fired server-side in the OAuth callback when a new user account is created in the database | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired server-side in the OAuth callback when an existing user authenticates | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | Fired client-side when the user clicks logout; calls `posthog.reset()` to clear identity | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | Fired server-side when a user completes the account onboarding step (name + avatar) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | Fired server-side when a user successfully creates a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | Fired server-side when a user opens a Stripe checkout session | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired server-side when a user cancels their subscription — key churn signal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired server-side when a user resumes a previously cancelled subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_switched` | Fired server-side when a user upgrades or downgrades their plan | `app/features/billing/billing-action.server.ts` |
| `contact_sales_submitted` | Fired server-side when an enterprise contact sales form is submitted | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `email_invite_accepted` | Fired server-side when a user accepts an email invite and joins an organization | `app/features/organizations/accept-email-invite/accept-email-invite-action.server.ts` |
| `stripe_checkout_completed` | Fired server-side in the Stripe webhook handler when checkout completes — authoritative payment event | `app/features/billing/stripe-event-handlers.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://us.posthog.com/project/2/dashboard/1344803)
  - [Subscription Conversion Funnel](https://us.posthog.com/project/2/insights/Cpg2izVb)
  - [User Acquisition](https://us.posthog.com/project/2/insights/pfv4PACB)
  - [Subscription Activity](https://us.posthog.com/project/2/insights/etSY0JLy)
  - [Team Collaboration Activity](https://us.posthog.com/project/2/insights/vkhSOnDI)
  - [Churn Signals](https://us.posthog.com/project/2/insights/a1wKlBlE)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

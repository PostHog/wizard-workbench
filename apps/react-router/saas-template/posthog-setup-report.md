<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router 7 Framework mode SaaS template. The integration covers client-side tracking, server-side event capture, session correlation between client and server, and error tracking.

**Changes made:**

- **`app/entry.client.tsx`** — Initialized `posthog-js` with the project token and host, wrapping the application in `<PostHogProvider>` to enable React hooks throughout the component tree. Configured `__add_tracing_headers` to automatically inject PostHog session/distinct ID headers on every request, correlating client sessions with server-side events.
- **`app/root.tsx`** — Added `posthogMiddleware` to the middleware chain so every route handler has access to a server-side PostHog client via React Router context. Added `captureException` in the root `ErrorBoundary` to track unhandled errors.
- **`app/features/posthog/posthog-middleware.server.ts`** *(new file)* — React Router middleware that instantiates a `posthog-node` client per request, reads the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers (injected by `posthog-js`), and calls `posthog.withContext()` to tie server-side events to the client session. Shuts down cleanly after every request.
- **`vite.config.ts`** — Added `ssr.noExternal` configuration for `posthog-js` and `@posthog/react` to enable SSR compatibility.
- **`app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts`** — Captures `user_signed_up` for new users and `user_logged_in` for returning users after magic link / OAuth callback authentication.
- **`app/features/organizations/layout/nav-user.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` in the logout form's `onSubmit` handler to clear the client-side identity.
- **`app/features/onboarding/user-account/onboarding-user-account-action.server.ts`** — Captures `onboarding_user_account_completed` with user name after the user saves their profile.
- **`app/features/onboarding/organization/onboarding-organization-action.server.ts`** — Captures `onboarding_organization_completed` with organization name and slug after first org creation.
- **`app/features/billing/billing-action.server.ts`** — Captures `checkout_session_started`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched` on each respective billing action.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Captures `checkout_completed` when the Stripe `checkout.session.completed` webhook is received and processed successfully.
- **`app/features/billing/contact-sales/contact-sales-action.server.ts`** — Captures `contact_sales_submitted` with company name when the enterprise contact form is submitted.
- **`app/features/organizations/settings/team-members/team-members-action.server.tsx`** — Captures `member_invited` with organization and role details when an admin invites a new team member.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | A new user successfully created an account via magic link or OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | An existing user successfully authenticated via magic link or OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | A user clicked the log out button | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | A new user completed the user account onboarding step (name and avatar) | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | A new user completed the organization onboarding step (created their first organization) | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `checkout_session_started` | A user opened a Stripe checkout session to start a paid subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | A user initiated cancellation of their subscription | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | A user resumed a subscription that was set to cancel at period end | `app/features/billing/billing-action.server.ts` |
| `subscription_plan_switched` | A user switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | A Stripe checkout session completed successfully (subscription activated) | `app/features/billing/stripe-event-handlers.server.ts` |
| `contact_sales_submitted` | A user submitted the contact sales form to inquire about the enterprise plan | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `member_invited` | An admin invited a new member to their organization via email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |

## Next steps

We've outlined five insights for an "Analytics basics" dashboard to monitor user behavior. Create a new dashboard in PostHog and add these insights:

1. **User signups over time** — Trends chart for `user_signed_up`, grouped by day. Shows new user acquisition.
2. **Signup → Onboarding → Paid conversion funnel** — Funnel: `user_signed_up` → `onboarding_user_account_completed` → `onboarding_organization_completed` → `checkout_session_started` → `checkout_completed`. Shows where users drop off.
3. **Subscription events breakdown** — Trends chart comparing `checkout_completed`, `subscription_cancelled`, `subscription_resumed`, and `subscription_plan_switched`. Monitors subscription health.
4. **Active users (DAU/WAU/MAU)** — Trends chart for `user_logged_in`, broken down by day/week/month. Shows engagement.
5. **Churn rate** — Formula: `subscription_cancelled / checkout_completed` as a ratio. Tracks the percentage of activated subscriptions that cancel.

Create the dashboard here: [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>

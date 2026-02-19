<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) SaaS template. Both client-side and server-side tracking are fully configured, with user identity correlation between client and server.

## Summary of changes

- **`posthog-js`, `@posthog/react`, and `posthog-node`** were installed as dependencies.
- **`vite.config.ts`** was updated to add `ssr.noExternal` for `posthog-js` and `@posthog/react`, preventing SSR hydration errors in Framework mode.
- **`app/entry.client.tsx`** was updated to initialise `posthog-js` and wrap the app in `<PostHogProvider>`, enabling autocapture, session recording, and `usePostHog()` access throughout the component tree. Tracing headers (`X-POSTHOG-SESSION-ID`, `X-POSTHOG-DISTINCT-ID`) are sent with all requests to correlate client and server events.
- **`app/lib/posthog-middleware.server.ts`** (new file) — A server-side React Router middleware that creates a `PostHog` Node client per request, reads the tracing headers, and attaches the client to `context` so every loader/action can capture events with the correct session and distinct ID.
- **`app/root.tsx`** — Registered `posthogMiddleware` in the root middleware array. Added `posthog.captureException()` in the `ErrorBoundary` for automatic error tracking.
- **`app/routes/_user-authentication+/_anonymous-routes+/login.tsx`** — Calls `posthog.identify()` and captures `user_logged_in` when the magic-link OTP is successfully sent.
- **`app/routes/_user-authentication+/_anonymous-routes+/register.tsx`** — Calls `posthog.identify()` and captures `user_registered` when the registration OTP is successfully sent.
- **`app/features/organizations/layout/nav-user.tsx`** — Captures `user_logged_out` and calls `posthog.reset()` in the logout form's `onSubmit` handler.
- **`app/features/onboarding/user-account/onboarding-user-account-action.server.ts`** — Server-side capture of `onboarding_user_account_completed`.
- **`app/features/onboarding/organization/onboarding-organization-action.server.ts`** — Server-side capture of `onboarding_organization_completed`.
- **`app/features/organizations/create-organization/create-organization-action.server.ts`** — Server-side capture of `organization_created`.
- **`app/features/billing/billing-action.server.ts`** — Server-side capture of `checkout_session_initiated`, `subscription_cancelled`, and `subscription_resumed`.
- **`app/features/billing/stripe-event-handlers.server.ts`** — Server-side capture of `checkout_completed` in the Stripe webhook handler, using a standalone PostHog Node client (webhooks run outside the request middleware).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_registered` | Fired (client) when a user successfully submits the registration form and an OTP email is sent. Calls `posthog.identify()` with their email. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_logged_in` | Fired (client) when a user successfully submits the login form and an OTP email is sent. Calls `posthog.identify()` with their email. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_logged_out` | Fired (client) when a user clicks the logout button in the sidebar. Calls `posthog.reset()` to clear the identity. | `app/features/organizations/layout/nav-user.tsx` |
| `onboarding_user_account_completed` | Fired (server) when a user finishes the user-account onboarding step (name + avatar). | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `onboarding_organization_completed` | Fired (server) when a user finishes the organization onboarding step (creates their first org). | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | Fired (server) when an existing user creates a new organization after onboarding. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `checkout_session_initiated` | Fired (server) when a user starts a Stripe checkout session to subscribe. | `app/features/billing/billing-action.server.ts` |
| `subscription_cancelled` | Fired (server) when a user initiates subscription cancellation via the Stripe portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired (server) when a user resumes a cancelled subscription before the period ends. | `app/features/billing/billing-action.server.ts` |
| `checkout_completed` | Fired (server) when Stripe confirms a checkout session is complete (webhook). | `app/features/billing/stripe-event-handlers.server.ts` |
| `error_boundary_triggered` | Exceptions are captured automatically via `posthog.captureException()` in the root `ErrorBoundary`. | `app/root.tsx` |

## Recommended PostHog dashboard insights

To monitor the key business flows in this application, create an **"Analytics basics"** dashboard in PostHog (https://us.i.posthog.com) with the following insights:

1. **Signups & Logins** — Trends: `user_registered` + `user_logged_in` over time
2. **User Onboarding Funnel** — Funnel: `user_registered` → `onboarding_user_account_completed` → `onboarding_organization_completed`
3. **Subscription Conversion Funnel** — Funnel: `onboarding_organization_completed` → `checkout_session_initiated` → `checkout_completed`
4. **Subscription Cancellations** — Trends: `subscription_cancelled` over time
5. **Daily Active Users** — Trends: unique users on `$pageview` per day

## Next steps

- **Verify events are flowing**: Log in to [PostHog Activity](https://us.i.posthog.com/activity/explore) after your first login/register action to confirm events are appearing.
- **Session replay**: Autocaptured — sessions will appear in [Session Replay](https://us.i.posthog.com/replay) automatically.
- **Feature flags**: Use `usePostHog().isFeatureEnabled('flag-key')` on the client or the PostHog Node SDK on the server to gate features.
- **Group analytics**: Call `posthog.group('organization', orgId, { name: orgName })` after login to associate events with organizations.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

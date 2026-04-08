<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode SaaS application. The integration covers client-side initialization with `posthog-js`, a React Router middleware-based server-side client using `posthog-node`, and `@posthog/react` for hooks. Events are tracked across the full user lifecycle — from signup and login through billing, team management, and core product usage. Error boundaries capture unhandled exceptions automatically.

**Key changes made:**

- `app/lib/posthog-middleware.server.ts` — New PostHog middleware that creates a per-request `posthog-node` client, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers from the client, and makes the client available across all routes via React Router's typed context system.
- `app/entry.client.tsx` — Initializes `posthog-js` with tracing headers enabled and wraps the app in `PostHogProvider`.
- `app/root.tsx` — Adds `posthogMiddleware` to the global middleware chain so every request has a server-side PostHog client. The `ErrorBoundary` captures unhandled exceptions with `posthog.captureException()`.
- `vite.config.ts` — Added `ssr.noExternal` for `posthog-js` and `@posthog/react` to ensure correct SSR bundling.
- `.env` — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` added.

| Event | Description | File |
|---|---|---|
| `user signed up` | New user account created after email OTP or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user logged in` | Existing user authenticated via email OTP | `app/routes/_user-authentication+/_anonymous-routes+/login.confirm.ts` |
| `user signed up` | New user created via Google OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user logged in` | Existing user authenticated via Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `organization created` | User created a new organization | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription checkout started` | User initiated a Stripe checkout for a plan | `app/features/billing/billing-action.server.ts` |
| `subscription cancelled` | User initiated subscription cancellation via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription resumed` | User resumed a subscription set to cancel | `app/features/billing/billing-action.server.ts` |
| `subscription switched` | User switched to a different subscription plan | `app/features/billing/billing-action.server.ts` |
| `checkout completed` | Stripe webhook confirmed a successful payment | `app/features/billing/stripe-event-handlers.server.ts` |
| `paste created` | User created a new paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `paste deleted` | User deleted a paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `member invited` | Admin invited a team member by email | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `error captured` | Unhandled application error caught by root ErrorBoundary | `app/root.tsx` |

## Next steps

To build the "Analytics basics" dashboard, navigate to your PostHog project and create a new dashboard with these five insights:

1. **Signup & Login Trend** — Trends chart showing `user signed up` and `user logged in` over time. Helps track new user acquisition vs. returning user activity.

2. **Signup → Organization → Subscription Funnel** — Funnel with steps: `user signed up` → `organization created` → `subscription checkout started` → `checkout completed`. This is your core conversion funnel.

3. **Subscription Health** — Trends chart comparing `checkout completed` (new subscriptions), `subscription cancelled`, and `subscription resumed` over time to track churn vs. growth.

4. **Paste Activity** — Trends chart showing `paste created` and `paste deleted` over time, broken down by `is_public` property. Reflects core product engagement.

5. **Team Growth** — Trends chart of `member invited` over time, indicating organizational expansion and collaboration adoption.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

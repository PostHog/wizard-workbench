<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) SaaS template. Here is a summary of all changes made:

**Client-side setup** — `posthog-js` and `@posthog/react` were installed and initialized in `entry.client.tsx`. The `PostHogProvider` wraps the entire app, making the PostHog client available everywhere via `usePostHog()`. The `__add_tracing_headers` option propagates the session and distinct ID on all requests to the server, enabling cross-domain event correlation.

**Server-side middleware** — A new `app/lib/posthog-middleware.ts` file creates a `posthog-node` client per request, extracts the `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers injected by the client SDK, and calls `posthog.withContext()` so all server-side captures automatically carry the correct user and session. The middleware is registered in `app/root.tsx` alongside the existing `securityMiddleware` and `i18nextMiddleware`.

**User identification** — `posthog.identify()` is called in the authenticated routes layout (`_authenticated-routes-layout.tsx`) via a `useEffect`, using the Supabase user ID as the distinct ID and email as a property. `posthog.reset()` is called in `nav-user.tsx` when the user submits the logout form.

**Error tracking** — `posthog.captureException()` is called in the root `ErrorBoundary` for all non-404 errors.

**14 custom events** were instrumented across 8 server-side files.

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | New user account created after OAuth callback | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Existing user authenticated via magic link or Google OAuth | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | User signed out of their session | `app/routes/_user-authentication+/logout.ts` |
| `onboarding_organization_completed` | User completed the organization onboarding form | `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `organization_created` | New organization created | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `organization_member_invited_by_email` | Owner/admin sent an email invitation to a team member | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `subscription_checkout_started` | User initiated a Stripe checkout session for a paid plan | `app/features/billing/billing-action.server.ts` |
| `subscription_cancellation_started` | User initiated subscription cancellation via Stripe portal | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | User reversed a pending subscription cancellation | `app/features/billing/billing-action.server.ts` |
| `contact_sales_submitted` | User submitted the enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-action.server.ts` |
| `subscription_created` | Stripe confirmed a new subscription was created (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_deleted` | Stripe confirmed a subscription was deleted (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `checkout_session_completed` | Stripe confirmed checkout session completed and payment captured (webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `account_deleted` | User permanently deleted their account | `app/features/user-accounts/settings/account/account-settings-action.server.ts` |

## Next steps

We've designed an "Analytics basics" dashboard for you. To set it up in PostHog, visit your project and create a new dashboard with these five insights:

1. **User Signups Over Time** — Trend chart of `user_signed_up` events. Measures new user growth day over day.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","order":0}]})

2. **Signup → Checkout Conversion Funnel** — Funnel from `user_signed_up` → `onboarding_organization_completed` → `subscription_checkout_started` → `checkout_session_completed`. Shows the critical conversion path.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up"},{"id":"onboarding_organization_completed"},{"id":"subscription_checkout_started"},{"id":"checkout_session_completed"}]})

3. **Subscription Churn Rate** — Trend of `subscription_deleted` vs `subscription_created` events over time. Use a formula to calculate churn percentage.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_created","name":"Subscriptions Created","type":"events","order":0},{"id":"subscription_deleted","name":"Subscriptions Deleted","type":"events","order":1}]})

4. **Active Organizations** — Unique organizations (grouped by `organization_id` property) performing any tracked action per week. Measures engagement.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"organization_created","name":"organization_created","type":"events","order":0}]})

5. **Cancellation Rate** — Trend of `subscription_cancellation_started` events. Monitor spikes to catch churn signals early.
   → [Create in PostHog](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_cancellation_started","name":"subscription_cancellation_started","type":"events","order":0}]})

Once created, pin them all to a new dashboard named **"Analytics basics"** at:
→ https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

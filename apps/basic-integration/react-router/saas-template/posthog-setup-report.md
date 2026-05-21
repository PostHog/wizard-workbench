<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (framework mode) SaaS template. Here's a summary of all changes made:

**Core setup:**
- Installed `posthog-js`, `@posthog/react`, and `posthog-node` packages
- Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env` and `app/utils/env.server.ts`
- Initialized the PostHog client in `app/entry.client.tsx` with `PostHogProvider` wrapping the app
- Created `app/lib/posthog-middleware.ts` — a React Router middleware that creates a server-side PostHog client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and correlates server events with the user's browser session
- Created `app/lib/posthog-server.ts` — a lightweight helper for server-side event capture outside the middleware context (e.g. Stripe webhooks)
- Added `posthogMiddleware` to the root `middleware` array in `app/root.tsx`
- Added `captureException` to the root `ErrorBoundary` in `app/root.tsx`
- Updated `vite.config.ts` to mark `posthog-js` and `@posthog/react` as SSR non-external packages

**Event tracking (client-side):** `login_submitted`, `register_submitted`, `onboarding_profile_completed`, `organization_created`, `paste_created`, `contact_sales_submitted`, `member_invited_by_email`

**Event tracking (server-side):** `user_signed_up`, `subscription_checkout_started`, `checkout_completed`, `subscription_cancelled`

**User identification:** Users are identified by email on the login form submit, the registration form submit, and the contact-sales form submit. The PostHog tracing headers (`X-POSTHOG-DISTINCT-ID`, `X-POSTHOG-SESSION-ID`) are automatically forwarded from the browser to the server on all requests, correlating client and server events to the same person.

---

## Instrumented events

| Event | Description | File |
|---|---|---|
| `login_submitted` | User submits the email login form or clicks Google login | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `register_submitted` | User submits the email registration form or clicks Google register | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_signed_up` | New user account created after OAuth callback (server-side) | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `onboarding_profile_completed` | User completes the user account onboarding step | `app/routes/_authenticated-routes+/onboarding+/user-account.tsx` |
| `organization_created` | User submits the create organization form | `app/features/organizations/create-organization/create-organization-form-card.tsx` |
| `paste_created` | User creates a new paste | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/pastes.tsx` |
| `contact_sales_submitted` | User submits the enterprise contact sales form | `app/features/billing/contact-sales/contact-sales-team.tsx` |
| `subscription_checkout_started` | User initiates a Stripe checkout session (server-side) | `app/features/billing/billing-action.server.ts` |
| `member_invited_by_email` | Admin invites a team member by email | `app/features/organizations/settings/team-members/invite-by-email-card.tsx` |
| `checkout_completed` | Stripe checkout session completed — payment confirmed (server-side webhook) | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Stripe subscription deleted/cancelled (server-side webhook) | `app/features/billing/stripe-event-handlers.server.ts` |

---

## Next steps

We've prepared five key insights for your "Analytics basics" dashboard. Create it in PostHog using the links below:

1. **Signup → Activation funnel** — tracks the conversion path from registration to onboarding and first organization creation:
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImZpbHRlcnMiOnsiZXZlbnRzIjpbeyJpZCI6InJlZ2lzdGVyX3N1Ym1pdHRlZCIsIm5hbWUiOiJyZWdpc3Rlcl9zdWJtaXR0ZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9LHsiaWQiOiJ1c2VyX3NpZ25lZF91cCIsIm5hbWUiOiJ1c2VyX3NpZ25lZF91cCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MX0seyJpZCI6Im9uYm9hcmRpbmdfcHJvZmlsZV9jb21wbGV0ZWQiLCJuYW1lIjoib25ib2FyZGluZ19wcm9maWxlX2NvbXBsZXRlZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6Mn0seyJpZCI6Im9yZ2FuaXphdGlvbl9jcmVhdGVkIiwibmFtZSI6Im9yZ2FuaXphdGlvbl9jcmVhdGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjozfV19fQ==)

2. **Subscription conversion funnel** — tracks users who start a checkout and complete payment:
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImZpbHRlcnMiOnsiZXZlbnRzIjpbeyJpZCI6InN1YnNjcmlwdGlvbl9jaGVja291dF9zdGFydGVkIiwibmFtZSI6InN1YnNjcmlwdGlvbl9jaGVja291dF9zdGFydGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfSx7ImlkIjoiY2hlY2tvdXRfY29tcGxldGVkIiwibmFtZSI6ImNoZWNrb3V0X2NvbXBsZXRlZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MX1dfX0=)

3. **New signups over time** — daily trend of `user_signed_up` to monitor growth:
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZmlsdGVycyI6eyJldmVudHMiOlt7ImlkIjoidXNlcl9zaWduZWRfdXAiLCJuYW1lIjoidXNlcl9zaWduZWRfdXAiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XX19)

4. **Subscription cancellations over time** — trend of `subscription_cancelled` to monitor churn:
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZmlsdGVycyI6eyJldmVudHMiOlt7ImlkIjoic3Vic2NyaXB0aW9uX2NhbmNlbGxlZCIsIm5hbWUiOiJzdWJzY3JpcHRpb25fY2FuY2VsbGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfV19fQ==)

5. **Enterprise lead volume** — trend of `contact_sales_submitted` events to monitor pipeline top of funnel:
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiVFJFTkRTIiwiZmlsdGVycyI6eyJldmVudHMiOlt7ImlkIjoiY29udGFjdF9zYWxlc19zdWJtaXR0ZWQiLCJuYW1lIjoiY29udGFjdF9zYWxlc19zdWJtaXR0ZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XX19)

Once you've created these insights, add them all to a new **"Analytics basics"** dashboard:
[Open Dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

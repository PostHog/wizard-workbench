<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics, session replay, and error tracking into this React Router v7 Framework mode SaaS template. The integration includes:

- **Client-side SDK**: PostHog JS initialized in `entry.client.tsx` with `PostHogProvider` wrapping the app, enabling autocapture, session replay, and tracing headers for client/server correlation.
- **Server-side SDK**: A PostHog Node.js middleware (`app/lib/posthog-middleware.ts`) wired into the root middleware chain, creating a per-request PostHog client that automatically correlates server-side events with the client session via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers.
- **User identification**: Called in the sidebar layout (authenticated routes) via `posthog.identify()` to link the database user ID to the PostHog session. On logout, `posthog.reset()` clears the session.
- **Error tracking**: `posthog.captureException()` added to the root `ErrorBoundary` to capture unhandled React errors.
- **Business events**: 12 events tracked across authentication, onboarding, billing, and team management flows (see table below).

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired server-side when a new user account is created after OAuth callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_in` | Fired server-side when an existing user completes authentication via OAuth callback. | `app/routes/_user-authentication+/_anonymous-routes+/auth.callback.ts` |
| `user_logged_out` | Fired client-side when a user clicks the logout button. | `app/features/organizations/layout/nav-user.tsx` |
| `organization_created` | Fired server-side when a new organization is saved to the database. | `app/features/organizations/create-organization/create-organization-action.server.ts`, `app/features/onboarding/organization/onboarding-organization-action.server.ts` |
| `subscription_checkout_started` | Fired server-side when a user initiates a Stripe checkout session to subscribe. | `app/features/billing/billing-action.server.ts` |
| `subscription_created` | Fired server-side via Stripe webhook when a checkout session completes and subscription is activated. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_cancelled` | Fired server-side when a user initiates a subscription cancellation through the billing portal. | `app/features/billing/billing-action.server.ts` |
| `subscription_deleted` | Fired server-side via Stripe webhook when a subscription is permanently deleted. | `app/features/billing/stripe-event-handlers.server.ts` |
| `subscription_plan_switched` | Fired server-side when a user switches to a different subscription plan tier. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired server-side when a user resumes a previously cancelled subscription. | `app/features/billing/billing-action.server.ts` |
| `organization_member_invited` | Fired server-side when an admin sends an email invitation to a new team member. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_form_submitted` | Fired server-side when a user submits the contact sales form for enterprise pricing. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1761309)
- **New signups over time**: https://us.posthog.com/project/483112/insights/oeH05rMp
- **Signup to subscription conversion funnel**: https://us.posthog.com/project/483112/insights/TsFl7Pl6
- **Subscription events**: https://us.posthog.com/project/483112/insights/BAGTKwdI
- **Team growth**: https://us.posthog.com/project/483112/insights/TPD2NTAn
- **User engagement**: https://us.posthog.com/project/483112/insights/BbibsqTY

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies in the sidebar layout on every page load for authenticated users, which covers returning visitors. Verify this fires correctly in staging.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

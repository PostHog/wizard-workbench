# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15.5.7 App Router SaaS application. The integration adds comprehensive event tracking for user acquisition, authentication, account management, team collaboration, and subscription lifecycle — covering both client-side and server-side events.

## Summary of Changes

### Core Infrastructure
- **instrumentation-client.ts**: Added PostHog client-side initialization using the modern `instrumentation-client.ts` pattern (recommended for Next.js 15.3+). Configured with automatic exception tracking and debug mode support.
- **lib/posthog-server.ts**: Created server-side PostHog client helper for capturing backend events with proper session management and shutdown handling.
- **next.config.ts**: Added reverse proxy configuration to route PostHog ingestion and asset requests through your application, improving data delivery and privacy.
- **.env.local**: Configured with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

### Authentication & User Management Events
- **app/(login)/actions.ts**: Instrumented all authentication flows with comprehensive event tracking:
  - User sign-up tracking (with source attribution: self vs invitation)
  - User sign-in tracking with server-side identification
  - User sign-out event capture
  - Password update event logging
  - Account information update (name/email) with user re-identification
  - Account deletion initiation tracking
  - Team creation events during sign-up
  - Team member invitation tracking
  - Team member removal tracking
  - Invitation acceptance tracking

### Pricing & Subscription Events
- **app/(dashboard)/pricing/submit-button.tsx**: Added client-side event capture for checkout initiation.
- **app/api/stripe/checkout/route.ts**: Captures subscription checkout completion with plan and customer details.
- **app/api/stripe/webhook/route.ts**: Tracks subscription status updates and cancellations via Stripe webhooks.
- **lib/payments/actions.ts**: Captures customer portal access events for subscription management.

## Event Tracking Table

| Event Name | Description | File |
|---|---|---|
| user_signed_up | User creates a new account via sign-up form. | app/(login)/actions.ts |
| user_signed_in | User successfully signs in to their account. | app/(login)/actions.ts |
| user_signed_out | User signs out of their account. | app/(login)/actions.ts |
| user_password_updated | User changes their password. | app/(login)/actions.ts |
| user_account_updated | User updates their account name or email. | app/(login)/actions.ts |
| account_deletion_initiated | User deletes their account. | app/(login)/actions.ts |
| team_created | New team is created during sign-up process. | app/(login)/actions.ts |
| team_member_invited | Team owner invites a new member to the team. | app/(login)/actions.ts |
| team_member_removed | Team member is removed from the team. | app/(login)/actions.ts |
| invitation_accepted | New user accepts team invitation and creates account. | app/(login)/actions.ts |
| checkout_initiated | User starts the checkout process for a subscription plan. | app/(dashboard)/pricing/submit-button.tsx |
| subscription_checkout_completed | Stripe checkout session successfully completed. | app/api/stripe/checkout/route.ts |
| subscription_updated | Team subscription status updated via Stripe webhook. | app/api/stripe/webhook/route.ts |
| subscription_cancelled | Team subscription cancelled via Stripe webhook. | app/api/stripe/webhook/route.ts |
| customer_portal_opened | User opens Stripe customer portal to manage subscription. | lib/payments/actions.ts |

## Analytics Dashboard & Insights

We've created an analytics dashboard with key insights to monitor your SaaS metrics:

**Dashboard:** https://us.posthog.com/project/228144/dashboard/1792894

**Insights:**
- [Sign-ups Over Time](https://us.posthog.com/project/228144/insights/fXz6zdQ8) - Daily user acquisition trends
- [Signup to Subscription Conversion Funnel](https://us.posthog.com/project/228144/insights/e7pvFxPc) - Conversion from sign-up → checkout → subscription
- [Team Subscription Status](https://us.posthog.com/project/228144/insights/Mnds6Rfq) - Active subscriptions vs cancellations over time
- [User Login Activity](https://us.posthog.com/project/228144/insights/vCJNU90k) - Daily active users (engagement/retention)
- [Team Collaboration Activity](https://us.posthog.com/project/228144/insights/cLeRSS2j) - Team member invites and removals

## Next Steps

The dashboard and insights are ready to use. As users interact with your application:
1. Sign-ups will be captured both client-side (via identify calls) and server-side
2. Login events will track daily active users for retention analysis
3. The conversion funnel will show drop-off between sign-up, checkout, and subscription completion
4. Subscription events will help monitor churn and lifecycle changes
5. Team collaboration events will surface how actively teams are using the platform

## Verify Before Merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` so collaborators know what to configure.
- [ ] Confirm the returning-visitor path also calls `identify` — verify that users who sign out and sign back in are correctly identified (currently handled in signIn action).
- [ ] Test the sign-up and sign-in flows locally with PostHog debug mode enabled to verify events are capturing correctly.
- [ ] Wire source-map upload into CI/CD (e.g., `posthog-cli sourcemap`) for production stack trace de-minification in the Next.js build output.

### Agent Skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can reference this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

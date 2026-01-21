# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js Pages Router SaaS application. The integration includes both client-side and server-side event tracking, user identification, and error tracking capabilities.

## Integration Summary

### Core Setup Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization using Next.js 15.3+ instrumentation
- `lib/posthog-server.ts` - Server-side PostHog Node.js client for API routes
- `.env.local` - Environment variables for PostHog API key and host
- `next.config.ts` - Updated with reverse proxy rewrites for reliable event delivery

### Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Fired when a new user successfully creates an account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | Fired when a user successfully signs in | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | Fired when a user signs out | `pages/api/auth/sign-out.ts` |
| `checkout_started` | Fired when a user initiates the checkout process from pricing page | `pages/pricing.tsx` |
| `checkout_session_created` | Fired when a Stripe checkout session is successfully created | `pages/api/stripe/create-checkout.ts` |
| `subscription_updated` | Fired when a subscription is updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_deleted` | Fired when a subscription is cancelled/deleted via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Fired when a team owner invites a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Fired when a team member is removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | Fired when a user updates their account information | `pages/api/account/update.ts` |
| `invite_form_submitted` | Fired when the invite team member form is submitted on the client | `pages/dashboard/index.tsx` |
| `manage_subscription_clicked` | Fired when user clicks to manage their subscription | `pages/dashboard/index.tsx` |

### User Identification
- Users are identified on successful login/signup using their email as the distinct ID
- Server-side identification is synchronized with client-side for accurate user tracking
- Person properties include email, name, team_id, and user_role

### Error Tracking
- Automatic exception capture is enabled via `capture_exceptions: true` in the client configuration
- Unhandled errors are automatically sent to PostHog for monitoring

## Next steps

### Create Your Dashboard
Visit your PostHog project to create an "Analytics basics" dashboard with these recommended insights:

1. **Signup to Checkout Funnel** - Track conversion from `user_signed_up` → `checkout_started` → `checkout_session_created`
2. **Daily Active Users** - Unique users by day based on any event
3. **Subscription Lifecycle** - Track `subscription_updated` and `subscription_deleted` events
4. **Team Growth** - Monitor `team_member_invited` events over time
5. **Authentication Activity** - Compare `user_signed_in` vs `user_signed_out` patterns

### PostHog Project
- **PostHog Host**: https://us.i.posthog.com
- **Project Settings**: https://us.posthog.com/project/settings

### Recommended Next Steps
1. Set up feature flags for A/B testing new features
2. Create cohorts based on subscription status for targeted analysis
3. Configure session replay to understand user behavior
4. Set up alerts for critical events like subscription cancellations

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Ensure these are set in your production environment:
```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

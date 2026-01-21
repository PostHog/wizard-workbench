<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side tracking** via `posthog-node` for capturing critical business events
- **Reverse proxy configuration** in `next.config.ts` to improve tracking reliability
- **User identification** on both client and server sides for consistent user tracking
- **PostHog reset** on logout to maintain clean session data

## Events Implemented

| Event Name | Description | File(s) |
|------------|-------------|---------|
| `user_signed_up` | User successfully completes account registration | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_in` | User successfully logs into their account | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_out` | User logs out of their account | `app/(login)/actions.ts`, `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiates checkout process for a subscription plan | `lib/payments/stripe.ts` |
| `checkout_completed` | User successfully completes checkout and subscription is created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changes (upgrade, downgrade, or status change) | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | User cancels their subscription | `app/api/stripe/webhook/route.ts` |
| `pricing_plan_selected` | User clicks to select a pricing plan from pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `account_updated` | User updates their account information (name/email) | `app/(login)/actions.ts` |
| `password_updated` | User successfully changes their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account | `app/(login)/actions.ts` |
| `team_member_invited` | Team owner invites a new member to the team | `app/(login)/actions.ts` |
| `team_member_removed` | Team owner removes a member from the team | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepts a team invitation during signup | `app/(login)/actions.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - PostHog server-side client utility
- `.env` - Environment variables for PostHog

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/actions.ts` - Added server-side event tracking for auth events
- `app/(login)/login.tsx` - Added client-side identify and event tracking
- `app/(dashboard)/layout.tsx` - Added PostHog reset on signout
- `app/(dashboard)/pricing/submit-button.tsx` - Added pricing plan selection tracking
- `app/api/stripe/checkout/route.ts` - Added checkout completed tracking
- `app/api/stripe/webhook/route.ts` - Added subscription event tracking
- `lib/payments/stripe.ts` - Added checkout started tracking

## Next steps

We've instrumented your application with comprehensive analytics tracking. To view your analytics:

1. Visit your [PostHog Dashboard](https://us.posthog.com/project/settings) to see captured events
2. Create custom insights based on the events above
3. Set up funnels to track user conversion (e.g., `user_signed_up` → `checkout_started` → `checkout_completed`)

### Recommended Insights to Create

1. **Signup to Paid Conversion Funnel**: Track `user_signed_up` → `pricing_plan_selected` → `checkout_started` → `checkout_completed`
2. **User Retention**: Track `user_signed_in` events over time
3. **Churn Analysis**: Monitor `subscription_canceled` and `account_deleted` events
4. **Team Growth**: Track `team_member_invited` and `invitation_accepted` events
5. **Settings Engagement**: Monitor `account_updated` and `password_updated` events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** using `posthog-node` for server actions and API routes
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain
- **User identification** on both client and server sides for unified user tracking
- **Error tracking** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_in` | User successfully authenticated and signed in | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member from the team | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted an invitation to join a team | `app/(login)/actions.ts` |
| `checkout_initiated` | User clicked to start checkout process | `lib/payments/actions.ts` |
| `subscription_created` | User completed checkout and created subscription | `app/api/stripe/checkout/route.ts` |
| `customer_portal_opened` | User opened Stripe customer portal | `lib/payments/actions.ts` |

## Files Created/Modified

### New Files
- `.env` - Environment variables for PostHog configuration
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `app/(login)/actions.ts` - Added server-side event tracking
- `app/(login)/login.tsx` - Added client-side identification
- `lib/payments/actions.ts` - Added payment event tracking
- `app/api/stripe/checkout/route.ts` - Added subscription event tracking

## Next steps

We've instrumented your application with comprehensive event tracking. To view your analytics:

- [PostHog Dashboard](https://us.posthog.com/project) - View your project dashboard
- Create custom insights based on the events above, such as:
  - **Sign-up to Subscription Funnel**: `user_signed_up` → `checkout_initiated` → `subscription_created`
  - **Churn Analysis**: Track `account_deleted` events over time
  - **Team Growth**: Monitor `team_member_invited` and `invitation_accepted` events

### Recommended Insights to Create

1. **Conversion Funnel**: Sign Up → Checkout → Subscription
2. **User Retention**: Track sign-ins over time cohorts
3. **Churn Rate**: Account deletions as a percentage of active users
4. **Team Collaboration**: Team invitations sent vs accepted
5. **Revenue Events**: Checkout initiations vs successful subscriptions

### Agent skill

We've configured PostHog using the modern Next.js 15.3+ approach with `instrumentation-client.ts`. This is the recommended pattern and should not be combined with PostHogProvider components or other initialization approaches.

Key implementation details:
- Client-side: Use `posthog.capture()` and `posthog.identify()` from `posthog-js`
- Server-side: Use `getPostHogClient()` from `lib/posthog-server.ts`
- Always use environment variables: `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

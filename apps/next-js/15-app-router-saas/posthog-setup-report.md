# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the Next.js 15.3+ recommended approach
- **Server-side tracking** via `posthog-node` for accurate server-side event capture
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain (helps with ad blockers)
- **User identification** on both client and server side for complete user journey tracking
- **Error tracking** for catching and reporting exceptions in critical payment flows

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User completed account registration | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_in` | User successfully logged in to their account | `app/(login)/actions.ts`, `app/(login)/login.tsx` |
| `user_signed_out` | User logged out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated a subscription checkout flow | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed subscription checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription was updated | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | User's subscription was canceled | `app/api/stripe/webhook/route.ts` |
| `password_updated` | User changed their account password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted a team invitation during sign up | `app/(login)/actions.ts` |

## Files Modified

| File | Changes |
|------|---------|
| `instrumentation-client.ts` | **Created** - Client-side PostHog initialization |
| `lib/posthog-server.ts` | **Created** - Server-side PostHog client |
| `.env` | **Created** - PostHog environment variables |
| `next.config.ts` | **Modified** - Added reverse proxy rewrites for PostHog |
| `app/(login)/login.tsx` | **Modified** - Added client-side user identification and event tracking |
| `app/(login)/actions.ts` | **Modified** - Added server-side tracking for all auth actions |
| `app/(dashboard)/pricing/submit-button.tsx` | **Modified** - Added checkout started tracking |
| `app/api/stripe/checkout/route.ts` | **Modified** - Added checkout completion and error tracking |
| `app/api/stripe/webhook/route.ts` | **Modified** - Added subscription event tracking |

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We recommend creating the following insights and dashboards in your PostHog project to monitor user behavior:

### Recommended Insights

1. **Signup to Checkout Funnel** - Track conversion from `user_signed_up` → `checkout_started` → `checkout_completed`
2. **User Authentication Trends** - Monitor `user_signed_in`, `user_signed_out` events over time
3. **Subscription Lifecycle** - Track `checkout_completed`, `subscription_updated`, `subscription_canceled`
4. **Team Growth** - Monitor `team_member_invited`, `invitation_accepted`, `team_member_removed`
5. **Account Health** - Track `account_deleted` events as a churn indicator

### Creating Your Dashboard

1. Log in to [PostHog](https://us.posthog.com)
2. Navigate to **Dashboards** → **New Dashboard**
3. Name it "SaaS Analytics"
4. Add insights using the events listed above

### Useful Links

- [PostHog Dashboard](https://us.posthog.com/project/dashboards)
- [PostHog Events](https://us.posthog.com/project/events)
- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)

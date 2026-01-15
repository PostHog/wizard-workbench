# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (Next.js 15.3+ recommended approach)
- **Server-side PostHog client** for tracking events in API routes and webhooks
- **Reverse proxy configuration** in `next.config.ts` for improved tracking reliability
- **User identification** on sign-in and sign-up events
- **Event tracking** for key business actions across authentication, payments, and team management

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/login.tsx` |
| `user_signed_up` | User successfully created a new account | `app/(login)/login.tsx` |
| `user_signed_out` | User signed out from their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User initiated a checkout flow for subscription | `app/(dashboard)/pricing/submit-button.tsx` |
| `checkout_completed` | User successfully completed checkout and subscription | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | Subscription was cancelled via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `team_member_invited` | User invited a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removed a team member | `app/(dashboard)/dashboard/page.tsx` |
| `manage_subscription_clicked` | User clicked to manage their subscription | `app/(dashboard)/dashboard/page.tsx` |
| `password_updated` | User updated their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_updated` | User updated their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `account_deleted` | User deleted their account | `app/(dashboard)/dashboard/security/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign-in/sign-up events and user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started event
- `app/api/stripe/checkout/route.ts` - Added checkout completed server-side event
- `app/api/stripe/webhook/route.ts` - Added subscription webhook events
- `app/(dashboard)/dashboard/page.tsx` - Added team management events
- `app/(dashboard)/dashboard/security/page.tsx` - Added password and account deletion events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update event

## Next steps

### Recommended Dashboard Insights

Create these insights in your PostHog dashboard to track key business metrics:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` → `checkout_started` → `checkout_completed`
2. **User Authentication Trends** - Monitor `user_signed_in`, `user_signed_up`, `user_signed_out` over time
3. **Subscription Health** - Track `subscription_updated` vs `subscription_cancelled` ratio
4. **Team Engagement** - Monitor `team_member_invited` and `team_member_removed` events
5. **Churn Indicators** - Track `account_deleted` and `subscription_cancelled` events

### Environment Variables

Make sure these environment variables are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Additional Resources

- [PostHog Next.js Documentation](https://posthog.com/docs/libraries/next-js)
- [PostHog Event Tracking](https://posthog.com/docs/product-analytics/capture-events)
- [PostHog User Identification](https://posthog.com/docs/product-analytics/identify)

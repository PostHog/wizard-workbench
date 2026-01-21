# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes:

- **Client-side initialization** using Next.js 15.3+ `instrumentation-client.ts` for automatic pageview tracking, session replay, and exception capture
- **Server-side tracking** using `posthog-node` for all critical business events
- **Reverse proxy configuration** via Next.js rewrites to improve event delivery reliability
- **User identification** on sign-in and sign-up events to link anonymous sessions to authenticated users

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_in` | User successfully signed in to their account | `app/(login)/actions.ts` |
| `user_signed_up` | User successfully created a new account | `app/(login)/actions.ts` |
| `user_signed_out` | User signed out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account | `app/(login)/actions.ts` |
| `account_updated` | User updated their account information | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted a team invitation during signup | `app/(login)/actions.ts` |
| `checkout_started` | User started the checkout process for a subscription | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed checkout and subscription was created | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription was updated via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User's subscription was cancelled | `app/api/stripe/webhook/route.ts` |
| `pricing_page_cta_clicked` | User clicked 'Get Started' button on pricing page | `app/(dashboard)/pricing/submit-button.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client singleton
- `.env` - Environment variables for PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/actions.ts` - Added server-side event tracking for auth events
- `lib/payments/actions.ts` - Added checkout started event tracking
- `app/api/stripe/checkout/route.ts` - Added checkout completed event tracking
- `app/api/stripe/webhook/route.ts` - Added subscription webhook event tracking
- `app/(dashboard)/pricing/submit-button.tsx` - Added client-side CTA click tracking

## Next steps

### Create Your Analytics Dashboard

Visit your PostHog project to create insights and dashboards based on the events we've instrumented:

1. **Sign-up to Checkout Funnel** - Track conversion from signup → checkout_started → checkout_completed
   - Create at: https://us.posthog.com/insights/new

2. **User Retention Analysis** - Monitor user_signed_in events over time
   - Create at: https://us.posthog.com/insights/new

3. **Churn Tracking** - Monitor account_deleted and subscription_cancelled events
   - Create at: https://us.posthog.com/insights/new

4. **Team Growth** - Track team_member_invited and invitation_accepted events
   - Create at: https://us.posthog.com/insights/new

5. **Revenue Events** - Monitor checkout_completed and subscription changes
   - Create at: https://us.posthog.com/insights/new

### Suggested Insights to Create

1. **Signup Funnel**: `user_signed_up` → `checkout_started` → `checkout_completed`
2. **Daily Active Users**: Count of unique users with `user_signed_in` events
3. **Churn Rate**: Ratio of `subscription_cancelled` to total active subscriptions
4. **Team Engagement**: `team_member_invited` trends over time
5. **Pricing Page Conversion**: `pricing_page_cta_clicked` → `checkout_completed`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure to set the following environment variables in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 Pages Router SaaS project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended approach for Next.js 15.3+
- **Server-side tracking** via `posthog-node` with a reusable client helper in `lib/posthog-server.ts`
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` to avoid ad blockers
- **User identification** on both client and server sides when users sign up or sign in
- **Error tracking** with `captureException` for authentication failures and checkout errors
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Triggered when a new user successfully creates an account | `pages/api/auth/sign-up.ts`, `components/login.tsx` |
| `user_signed_in` | Triggered when a user successfully logs into their account | `pages/api/auth/sign-in.ts`, `components/login.tsx` |
| `user_signed_out` | Triggered when a user logs out of their account | `pages/api/auth/sign-out.ts` |
| `checkout_started` | Triggered when a user initiates the checkout flow for a subscription | `pages/api/stripe/create-checkout.ts` |
| `checkout_completed` | Triggered when a user successfully completes checkout | `pages/api/stripe/checkout.ts` |
| `customer_portal_opened` | Triggered when a user accesses the Stripe customer portal | `pages/api/stripe/customer-portal.ts` |
| `subscription_updated` | Triggered when a subscription is updated via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `subscription_cancelled` | Triggered when a subscription is cancelled via Stripe webhook | `pages/api/stripe/webhook.ts` |
| `team_member_invited` | Triggered when a user sends an invitation to a new team member | `pages/api/team/invite.ts` |
| `team_member_removed` | Triggered when a team member is removed from the team | `pages/api/team/remove-member.ts` |
| `account_updated` | Triggered when a user updates their account information | `pages/api/account/update.ts` |
| `pricing_page_cta_clicked` | Triggered when a user clicks the Get Started button on pricing | `pages/pricing.tsx` |

## Files Created

| File | Purpose |
|------|---------|
| `instrumentation-client.ts` | PostHog client-side initialization |
| `lib/posthog-server.ts` | Server-side PostHog client helper |
| `.env` | Environment variables for PostHog |

## Files Modified

| File | Changes |
|------|---------|
| `next.config.ts` | Added reverse proxy rewrites for PostHog |
| `pages/api/auth/sign-up.ts` | Added user signup event and identify |
| `pages/api/auth/sign-in.ts` | Added user sign-in event and identify |
| `pages/api/auth/sign-out.ts` | Added user sign-out event |
| `pages/api/stripe/create-checkout.ts` | Added checkout started event |
| `pages/api/stripe/checkout.ts` | Added checkout completed event |
| `pages/api/stripe/customer-portal.ts` | Added customer portal opened event |
| `pages/api/stripe/webhook.ts` | Added subscription events |
| `pages/api/team/invite.ts` | Added team member invited event |
| `pages/api/team/remove-member.ts` | Added team member removed event |
| `pages/api/account/update.ts` | Added account updated event |
| `components/login.tsx` | Added client-side identify and auth events |
| `pages/pricing.tsx` | Added pricing CTA click event |

## Next steps

We've instrumented your application with comprehensive PostHog event tracking. Here are recommended insights and dashboards to create in PostHog:

### Recommended Insights

1. **Sign-up to Checkout Conversion Funnel**
   - Events: `user_signed_up` → `pricing_page_cta_clicked` → `checkout_started` → `checkout_completed`
   - Type: Funnel analysis

2. **User Authentication Overview**
   - Events: `user_signed_up`, `user_signed_in`, `user_signed_out`
   - Type: Trends over time

3. **Subscription Health**
   - Events: `checkout_completed`, `subscription_updated`, `subscription_cancelled`
   - Type: Trends to monitor subscription activity

4. **Team Engagement**
   - Events: `team_member_invited`, `team_member_removed`
   - Type: Trends to track team growth

5. **User Retention - Daily Active Sign-ins**
   - Events: `user_signed_in`
   - Type: Stickiness or retention analysis

### Access Your PostHog Dashboard

Visit your PostHog project at: https://us.i.posthog.com

To create the "Analytics basics" dashboard:
1. Navigate to Dashboards → New Dashboard
2. Name it "Analytics basics"
3. Add insights using the events listed above
4. Focus on conversion funnels and retention metrics

## Configuration Summary

- **PostHog Host**: `https://us.i.posthog.com` (proxied through `/ingest`)
- **API Key**: Stored in `NEXT_PUBLIC_POSTHOG_KEY` environment variable
- **Exception Tracking**: Enabled via `capture_exceptions: true`
- **Debug Mode**: Enabled in development environment

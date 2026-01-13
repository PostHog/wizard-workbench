# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Next.js SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for Next.js 15.3+ using the recommended approach
- **Server-side tracking** via `lib/posthog-server.ts` for backend event capture
- **Reverse proxy configuration** in `next.config.ts` to route analytics through your domain
- **User identification** on login/signup forms to link anonymous and authenticated user sessions
- **Event tracking** across authentication, team management, and payment flows
- **Error tracking** with exception capture for checkout failures
- **Session reset** on logout to properly separate user sessions

## Events Implemented

| Event Name | Description | File(s) |
|------------|-------------|---------|
| `user_signed_up` | User successfully creates a new account | `app/(login)/actions.ts` |
| `user_signed_in` | User successfully logs into their account | `app/(login)/actions.ts` |
| `user_signed_out` | User signs out of their account | `app/(login)/actions.ts` |
| `password_updated` | User successfully updates their password | `app/(login)/actions.ts` |
| `account_deleted` | User deletes their account | `app/(login)/actions.ts` |
| `account_updated` | User updates their account information | `app/(login)/actions.ts` |
| `team_member_invited` | User invites a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removes a team member from the team | `app/(login)/actions.ts` |
| `checkout_started` | User initiates checkout for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completes checkout | `app/api/stripe/checkout/route.ts` |
| `subscription_portal_opened` | User opens the subscription management portal | `lib/payments/actions.ts` |
| `pricing_page_viewed` | User views the pricing page (funnel top) | `app/(dashboard)/pricing/page.tsx` |

## Files Created/Modified

### New Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `app/(dashboard)/pricing/pricing-tracker.tsx` - Pricing page view tracker component
- `.env` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `app/(login)/login.tsx` - Added PostHog identify on form submit
- `app/(login)/actions.ts` - Added server-side event tracking for all auth actions
- `lib/payments/actions.ts` - Added checkout and portal events
- `app/api/stripe/checkout/route.ts` - Added checkout completion and error tracking
- `app/(dashboard)/pricing/page.tsx` - Added pricing page tracker
- `app/(dashboard)/layout.tsx` - Added PostHog reset on sign out

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

To view your analytics and create insights based on the events instrumented:

1. **Access PostHog Dashboard**: https://us.posthog.com/
2. **Create recommended insights**:
   - **Signup to Checkout Funnel**: Track conversion from `user_signed_up` → `pricing_page_viewed` → `checkout_started` → `checkout_completed`
   - **User Retention**: Analyze `user_signed_in` events over time
   - **Churn Analysis**: Monitor `account_deleted` events and correlate with user activity
   - **Team Growth**: Track `team_member_invited` events
   - **Subscription Management**: Monitor `subscription_portal_opened` for potential churn signals

3. **Create a dashboard** named "Analytics basics" with insights for:
   - Signup funnel conversion rates
   - Daily/weekly active users
   - Account deletion trends (churn)
   - Subscription conversion funnel
   - Team collaboration metrics

## Verification

Run the development server with `pnpm dev` and perform the following actions to verify events are being captured:
- Sign up for a new account
- Sign in/out
- Visit the pricing page
- Update account settings
- Invite team members

Check the PostHog dashboard to confirm events are appearing with the correct properties.

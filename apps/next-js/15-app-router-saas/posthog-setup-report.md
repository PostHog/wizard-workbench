# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 15 SaaS project with PostHog analytics. The integration includes:

- **Client-side initialization** using the `instrumentation-client.ts` approach recommended for Next.js 15.3+
- **Server-side tracking** with `posthog-node` for backend events
- **Reverse proxy configuration** via Next.js rewrites to `/ingest` for improved ad-blocker resilience
- **User identification** on both client and server side for seamless cross-platform analytics
- **Environment variables** properly configured using Next.js conventions (`NEXT_PUBLIC_*`)

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `sign_up_submitted` | User submitted the sign-up form to create a new account | `app/(login)/login.tsx` |
| `sign_up_completed` | User successfully completed account registration | `app/(login)/actions.ts` |
| `sign_in_submitted` | User submitted the sign-in form to log into their account | `app/(login)/login.tsx` |
| `sign_in_completed` | User successfully signed in | `app/(login)/actions.ts` |
| `sign_out` | User signed out of their account | `app/(login)/actions.ts` |
| `checkout_started` | User initiated checkout process for a subscription plan | `lib/payments/actions.ts` |
| `checkout_completed` | User successfully completed the checkout and subscribed to a plan | `app/api/stripe/checkout/route.ts` |
| `pricing_plan_selected` | User clicked to select a pricing plan on the pricing page | `app/(dashboard)/pricing/submit-button.tsx` |
| `password_updated` | User successfully updated their password | `app/(login)/actions.ts` |
| `account_updated` | User successfully updated their account information | `app/(login)/actions.ts` |
| `account_deleted` | User deleted their account (churn event) | `app/(login)/actions.ts` |
| `team_member_invited` | User invited a new team member | `app/(login)/actions.ts` |
| `team_member_removed` | User removed a team member from their team | `app/(login)/actions.ts` |
| `invitation_accepted` | User accepted a team invitation and joined a team | `app/(login)/actions.ts` |

## Files Created/Modified

### New Files Created
- `.env` - PostHog environment variables
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client helper

### Files Modified
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `app/(login)/login.tsx` - Added client-side form submission tracking and user identification
- `app/(login)/actions.ts` - Added server-side tracking for all authentication and team management events
- `lib/payments/actions.ts` - Added checkout started tracking
- `app/api/stripe/checkout/route.ts` - Added checkout completed (conversion) tracking
- `app/(dashboard)/pricing/submit-button.tsx` - Added pricing plan selection tracking

## Configuration Details

### Environment Variables
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Reverse Proxy Routes
- `/ingest/static/*` → `https://us-assets.i.posthog.com/static/*`
- `/ingest/*` → `https://us.i.posthog.com/*`

## Next steps

We recommend creating the following insights and dashboard in PostHog based on the events we just instrumented:

### Recommended Dashboard: "Analytics basics"
Create this dashboard in the PostHog UI with the following insights:

1. **Sign-up to Checkout Conversion Funnel**
   - Steps: `sign_up_completed` → `pricing_plan_selected` → `checkout_started` → `checkout_completed`
   - Type: Funnel visualization

2. **User Authentication Activity**
   - Events: `sign_in_completed`, `sign_up_completed`, `sign_out`
   - Type: Trends chart (daily/weekly)

3. **Churn Events**
   - Event: `account_deleted`
   - Type: Trends chart with breakdown by time period

4. **Team Growth**
   - Events: `team_member_invited`, `invitation_accepted`, `team_member_removed`
   - Type: Trends chart

5. **Revenue Conversion Rate**
   - Funnel: `checkout_started` → `checkout_completed`
   - Type: Funnel with conversion rate

### Creating the Dashboard
1. Go to PostHog → Dashboards → New Dashboard
2. Name it "Analytics basics"
3. Add the insights above using the event names exactly as documented

### Links
- PostHog App: https://us.posthog.com
- Project Settings: https://us.posthog.com/project/settings
- Create Dashboard: https://us.posthog.com/dashboard/new
- PostHog Docs: https://posthog.com/docs

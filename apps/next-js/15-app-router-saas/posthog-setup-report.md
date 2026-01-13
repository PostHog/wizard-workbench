# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic page views and exception tracking
- **Server-side tracking** capability via `lib/posthog-server.ts` for backend events
- **Reverse proxy configuration** in `next.config.ts` to route analytics through your domain (avoiding ad blockers)
- **User identification** on sign-in/sign-up to link anonymous and authenticated sessions
- **Event tracking** for key user actions across the application

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `sign_in_submitted` | User submitted the sign-in form | `app/(login)/login.tsx` |
| `sign_up_submitted` | User submitted the sign-up form | `app/(login)/login.tsx` |
| `pricing_plan_selected` | User clicked to start checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `password_update_submitted` | User submitted the password update form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_delete_submitted` | User submitted the account deletion form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_update_submitted` | User submitted account information update | `app/(dashboard)/dashboard/general/page.tsx` |
| `team_member_invited` | User invited a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removed a team member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `subscription_management_clicked` | User clicked to manage their subscription via Stripe portal | `app/(dashboard)/dashboard/page.tsx` |
| `cta_deploy_clicked` | User clicked the deploy your own CTA button on the homepage | `app/(dashboard)/cta-buttons.tsx` |
| `cta_view_code_clicked` | User clicked the view code CTA button on the homepage | `app/(dashboard)/cta-buttons.tsx` |

## Files Created/Modified

### New Files
- `.env` - Environment variables for PostHog API key and host
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `app/(dashboard)/cta-buttons.tsx` - Client components for homepage CTAs with tracking

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `app/(login)/login.tsx` - Added sign-in/sign-up tracking and user identification
- `app/(dashboard)/pricing/submit-button.tsx` - Added pricing plan selection tracking
- `app/(dashboard)/dashboard/security/page.tsx` - Added password update and account deletion tracking
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update tracking
- `app/(dashboard)/dashboard/page.tsx` - Added team management and subscription tracking
- `app/(dashboard)/page.tsx` - Updated to use CTA button components

## Next steps

### Create Recommended Dashboards and Insights

Log into your PostHog dashboard to create the following insights:

1. **Sign-up to Pricing Funnel** - Track conversion from `sign_up_submitted` to `pricing_plan_selected`
2. **User Retention** - Monitor `sign_in_submitted` events over time
3. **Churn Indicators** - Track `account_delete_submitted` events
4. **Team Growth** - Monitor `team_member_invited` events
5. **CTA Performance** - Compare `cta_deploy_clicked` vs `cta_view_code_clicked`

### PostHog Dashboard Links

After your app starts receiving events, create insights at:
- Dashboard: https://us.posthog.com/project/dashboard
- Events Explorer: https://us.posthog.com/project/events

### Environment Variables

Make sure the following environment variables are set in your production environment:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

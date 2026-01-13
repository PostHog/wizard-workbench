# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ approach
- **Server-side PostHog client** for future server-side event tracking
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain
- **Environment variables** configured in `.env` for the PostHog API key and host
- **User identification** on sign-in and sign-up to link anonymous sessions to authenticated users
- **PostHog reset** on sign-out to properly separate user sessions
- **13 custom events** tracking key user actions across the application

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | User successfully completed the sign-up form and created an account | `app/(login)/login.tsx` |
| `user_signed_in` | User successfully signed in to their account | `app/(login)/login.tsx` |
| `user_signed_out` | User clicked the sign out button and signed out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | User clicked the Get Started button to initiate a subscription checkout | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_managed` | User clicked to manage their subscription in the customer portal | `app/(dashboard)/dashboard/page.tsx` |
| `account_updated` | User successfully updated their account information (name/email) | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | User successfully changed their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_initiated` | User initiated the account deletion process | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_invited` | Team owner sent an invitation to a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Team owner removed a member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `terminal_commands_copied` | User copied the terminal setup commands from the homepage | `app/(dashboard)/terminal.tsx` |
| `deploy_cta_clicked` | User clicked the Deploy your own CTA button on the homepage | `app/(dashboard)/cta-buttons.tsx` |
| `view_code_clicked` | User clicked the View the code CTA button on the homepage | `app/(dashboard)/cta-buttons.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables for PostHog configuration
- `app/(dashboard)/cta-buttons.tsx` - Client components for CTA tracking

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `app/(login)/login.tsx` - Added user identification and sign-in/sign-up events
- `app/(dashboard)/layout.tsx` - Added sign-out event and PostHog reset
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started event
- `app/(dashboard)/dashboard/page.tsx` - Added subscription, team invite, and team member events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account updated event
- `app/(dashboard)/dashboard/security/page.tsx` - Added password and account deletion events
- `app/(dashboard)/terminal.tsx` - Added terminal commands copied event
- `app/(dashboard)/page.tsx` - Updated to use tracked CTA button components

## Next steps

We recommend creating the following insights and dashboards in PostHog to monitor user behavior based on the events we just instrumented:

### Suggested Insights to Create

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` → `checkout_started`
2. **User Retention by Subscription** - Track `subscription_managed` events over time
3. **Team Growth** - Monitor `team_member_invited` and `team_member_removed` events
4. **Account Churn Risk** - Track `account_deletion_initiated` events
5. **Homepage Engagement** - Track `deploy_cta_clicked`, `view_code_clicked`, and `terminal_commands_copied`

### PostHog Dashboard

Access your PostHog dashboard to create insights and monitor these events:
- **PostHog US**: https://us.posthog.com

### Additional Recommendations

1. **Enable Session Replay** - The integration includes `capture_exceptions: true` for error tracking
2. **Set up Feature Flags** - Use PostHog feature flags for gradual rollouts
3. **Add Server-side Events** - Use `lib/posthog-server.ts` to track server-side events like successful payments via Stripe webhooks

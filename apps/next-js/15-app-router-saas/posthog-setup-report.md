# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your Next.js 15 SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+)
- **Server-side tracking** capability via `lib/posthog-server.ts` using `posthog-node`
- **Reverse proxy configuration** in `next.config.ts` to route analytics through your domain
- **User identification** on sign-in and sign-up form submissions
- **Event tracking** for key business actions throughout the application
- **Error tracking** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `sign_up_form_submitted` | User submits the sign up form | `app/(login)/login.tsx` |
| `sign_in_form_submitted` | User submits the sign in form | `app/(login)/login.tsx` |
| `pricing_plan_selected` | User clicks to select a pricing plan and start checkout | `app/(dashboard)/pricing/submit-button.tsx` |
| `account_settings_updated` | User updates their account information (name, email) | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_change_submitted` | User submits form to change their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_requested` | User submits request to delete their account | `app/(dashboard)/dashboard/security/page.tsx` |
| `team_member_invited` | User invites a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | User removes a team member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `manage_subscription_clicked` | User clicks to manage their subscription via Stripe portal | `app/(dashboard)/dashboard/page.tsx` |
| `deploy_cta_clicked` | User clicks the 'Deploy your own' CTA button on homepage | `app/(dashboard)/cta-buttons.tsx` |
| `view_code_clicked` | User clicks the 'View the code' button on homepage | `app/(dashboard)/cta-buttons.tsx` |

## Files Created/Modified

### New Files
- `.env` - PostHog environment variables
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `app/(dashboard)/cta-buttons.tsx` - CTA button components with tracking

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign-in/sign-up tracking and user identification
- `app/(dashboard)/pricing/submit-button.tsx` - Added pricing plan selection tracking
- `app/(dashboard)/dashboard/general/page.tsx` - Added account settings update tracking
- `app/(dashboard)/dashboard/security/page.tsx` - Added password change and account deletion tracking
- `app/(dashboard)/dashboard/page.tsx` - Added team management and subscription tracking
- `app/(dashboard)/page.tsx` - Updated to use tracked CTA buttons

## Environment Variables

The following environment variables have been configured in `.env`:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We recommend creating the following insights in your PostHog dashboard to monitor user behavior based on the events we just instrumented:

1. **Sign-up to Pricing Funnel** - Track conversion from `sign_up_form_submitted` → `pricing_plan_selected`
2. **User Engagement Trends** - Monitor trends of `sign_in_form_submitted` over time
3. **Team Growth Metrics** - Track `team_member_invited` events to measure team expansion
4. **Churn Indicators** - Monitor `account_deletion_requested` and `password_change_submitted` events
5. **CTA Performance** - Compare `deploy_cta_clicked` vs `view_code_clicked` to optimize homepage

### Useful Links

- [PostHog Dashboard](https://us.posthog.com/project/dashboard)
- [PostHog Events](https://us.posthog.com/project/events)
- [PostHog Documentation](https://posthog.com/docs)
- [Next.js Integration Guide](https://posthog.com/docs/libraries/next-js)

## Technical Notes

- PostHog is initialized using `instrumentation-client.ts`, which is the recommended approach for Next.js 15.3+ applications
- The reverse proxy configuration routes all PostHog requests through `/ingest/*` to avoid ad blockers
- User identification happens on form submission using the email address as the distinct ID
- Error tracking is automatically enabled via `capture_exceptions: true`

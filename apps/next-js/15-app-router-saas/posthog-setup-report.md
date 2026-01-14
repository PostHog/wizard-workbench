# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js App Router project. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side tracking** using `posthog-node` for API routes and webhooks
- **Reverse proxy configuration** through Next.js rewrites to bypass ad blockers
- **User identification** on sign-in and sign-up flows
- **Error tracking** enabled via `capture_exceptions: true`

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `sign_in_submitted` | User submits the sign in form | `app/(login)/login.tsx` |
| `sign_up_submitted` | User submits the sign up form | `app/(login)/login.tsx` |
| `checkout_started` | User clicks to start checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |
| `password_update_submitted` | User submits the password update form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_delete_submitted` | User submits the account deletion form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_update_submitted` | User submits account information changes | `app/(dashboard)/dashboard/general/page.tsx` |
| `stripe_checkout_completed` | User successfully completes Stripe checkout | `app/api/stripe/checkout/route.ts` |
| `stripe_checkout_failed` | Stripe checkout processing encountered an error | `app/api/stripe/checkout/route.ts` |
| `subscription_updated` | User's subscription status changed via webhook | `app/api/stripe/webhook/route.ts` |
| `subscription_cancelled` | User's subscription was cancelled | `app/api/stripe/webhook/route.ts` |
| `deploy_button_clicked` | User clicks the deploy button on homepage | `app/(dashboard)/page.tsx` |
| `view_code_clicked` | User clicks the view code button on homepage | `app/(dashboard)/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `app/(dashboard)/pricing/pricing-page-tracker.tsx` - Pricing page view tracker component
- `app/(dashboard)/tracked-buttons.tsx` - Tracked button components for homepage
- `.env` - Environment variables for PostHog

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added sign in/up tracking and user identification
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout tracking
- `app/(dashboard)/pricing/page.tsx` - Added pricing page view tracking
- `app/(dashboard)/dashboard/security/page.tsx` - Added password/delete tracking
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update tracking
- `app/api/stripe/checkout/route.ts` - Added server-side checkout tracking
- `app/api/stripe/webhook/route.ts` - Added server-side subscription tracking
- `app/(dashboard)/page.tsx` - Added button click tracking

## Next steps

### Create Your Analytics Dashboard

To create a dashboard with the events we've implemented, go to your PostHog project and create insights for:

1. **Sign-up to Checkout Funnel**: A funnel insight tracking `sign_up_submitted` → `pricing_page_viewed` → `checkout_started` → `stripe_checkout_completed`
2. **Authentication Trends**: A trends insight tracking `sign_in_submitted` and `sign_up_submitted` over time
3. **Checkout Conversion Rate**: A funnel from `checkout_started` to `stripe_checkout_completed`
4. **Churn Analysis**: Track `subscription_cancelled` and `account_delete_submitted` events
5. **Homepage Engagement**: Track `deploy_button_clicked` and `view_code_clicked` clicks

### Environment Variables

Make sure to set the following environment variables in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

The skill includes:
- Example code patterns for Next.js App Router
- Documentation references
- Best practices for event tracking and user identification

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router application. This integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the modern Next.js 15.3+ approach
- **Server-side tracking** using the `posthog-node` SDK with a reusable client in `lib/posthog-server.ts`
- **Reverse proxy** configured in `next.config.ts` to improve tracking reliability and avoid ad blockers
- **User identification** on both client and server during sign-in and sign-up flows
- **Error tracking** with `posthog.captureException()` for catching and reporting errors
- **Event tracking** for key business actions including authentication, checkout, subscription management, and team collaboration

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `sign_in_form_submitted` | User submitted the sign in form (client-side) | `components/login.tsx` |
| `sign_up_form_submitted` | User submitted the sign up form (client-side) | `components/login.tsx` |
| `user_signed_in` | User successfully signed in (client + server) | `components/login.tsx`, `pages/api/auth/sign-in.ts` |
| `user_signed_up` | User successfully created a new account (client + server) | `components/login.tsx`, `pages/api/auth/sign-up.ts` |
| `user_signed_out` | User signed out of their account (server-side) | `pages/api/auth/sign-out.ts` |
| `checkout_initiated` | User clicked to start checkout on pricing page (client-side) | `pages/pricing.tsx` |
| `checkout_completed` | User completed Stripe checkout (server-side) | `pages/api/stripe/checkout.ts` |
| `subscription_updated` | Subscription status changed via Stripe webhook (server-side) | `pages/api/stripe/webhook.ts` |
| `manage_subscription_clicked` | User clicked to manage subscription (client-side) | `pages/dashboard/index.tsx` |
| `invitation_sent` | User submitted team member invitation form (client-side) | `pages/dashboard/index.tsx` |
| `team_member_invited` | Team owner invited a new member (server-side) | `pages/api/team/invite.ts` |
| `team_member_removed` | Team owner removed a member (server-side) | `pages/api/team/remove-member.ts` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - PostHog client-side initialization
- `lib/posthog-server.ts` - Server-side PostHog client factory
- `.env` - Environment variables with PostHog configuration

### Modified Files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `components/login.tsx` - Added user identification and auth event tracking
- `pages/pricing.tsx` - Added checkout initiation tracking
- `pages/dashboard/index.tsx` - Added subscription and invitation tracking
- `pages/api/auth/sign-in.ts` - Added server-side sign-in tracking
- `pages/api/auth/sign-up.ts` - Added server-side sign-up tracking
- `pages/api/auth/sign-out.ts` - Added server-side sign-out tracking
- `pages/api/stripe/checkout.ts` - Added checkout completion tracking
- `pages/api/stripe/webhook.ts` - Added subscription update tracking
- `pages/api/team/invite.ts` - Added team invitation tracking
- `pages/api/team/remove-member.ts` - Added team member removal tracking
- `.env.example` - Added PostHog environment variable examples

## Next steps

1. **Verify your PostHog project key** is correctly set in the `.env` file
2. **Run your application** and test the tracking by signing in/up and navigating through the app
3. **Check PostHog dashboard** to see your events flowing in
4. **Create custom insights** based on the events implemented:
   - **Sign-up to Checkout Funnel**: Track conversion from signup to checkout completion
   - **User Retention**: Monitor sign-in events over time
   - **Team Growth**: Track invitation and team member events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```
NEXT_PUBLIC_POSTHOG_KEY=phc_sBGFIjin7AfcLwLJ4yc79wY84KHkvrTw5SnUeKD0SWE
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

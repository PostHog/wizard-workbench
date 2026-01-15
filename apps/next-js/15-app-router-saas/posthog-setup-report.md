# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` using the recommended Next.js 15.3+ pattern
- **Server-side PostHog client** in `lib/posthog-server.ts` for backend event tracking
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through `/ingest` for improved reliability and ad-blocker bypass
- **Environment variables** configured in `.env` with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`
- **User identification** on sign-in and sign-up to correlate anonymous and authenticated user sessions
- **11 custom events** tracking key user actions across authentication, subscription management, and team collaboration flows

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_signed_up` | Track when a user successfully creates a new account | `app/(login)/login.tsx` |
| `user_signed_in` | Track when a user successfully signs into their account | `app/(login)/login.tsx` |
| `user_signed_out` | Track when a user signs out of their account | `app/(dashboard)/layout.tsx` |
| `checkout_started` | Track when a user initiates checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_managed` | Track when a user clicks to manage their subscription | `app/(dashboard)/dashboard/page.tsx` |
| `password_updated` | Track when a user successfully updates their password | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | Track when a user initiates account deletion (churn event) | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_updated` | Track when a user updates their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `team_member_invited` | Track when a team owner invites a new member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Track when a team member is removed from the team | `app/(dashboard)/dashboard/page.tsx` |
| `pricing_page_viewed` | Track when a user views the pricing page (top of conversion funnel) | `app/(dashboard)/pricing/page.tsx` |

## Files Created/Modified

### New Files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `app/(dashboard)/pricing/pricing-page-tracker.tsx` - Client component for pricing page view tracking
- `.env` - Environment variables including PostHog configuration

### Modified Files
- `next.config.ts` - Added PostHog reverse proxy rewrites
- `app/(login)/login.tsx` - Added sign-up/sign-in events and user identification
- `app/(dashboard)/layout.tsx` - Added sign-out event
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout started event
- `app/(dashboard)/pricing/page.tsx` - Added pricing page tracker
- `app/(dashboard)/dashboard/page.tsx` - Added subscription and team management events
- `app/(dashboard)/dashboard/security/page.tsx` - Added password update and account deletion events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update event

## Next steps

### Recommended Dashboard & Insights

Create a dashboard called "Analytics basics" in PostHog with the following insights:

1. **Sign-up to Checkout Funnel**
   - Funnel: `user_signed_up` → `pricing_page_viewed` → `checkout_started`
   - Measures conversion from sign-up through to payment initiation

2. **User Authentication Overview**
   - Trends: `user_signed_up`, `user_signed_in`, `user_signed_out` over time
   - Track daily/weekly authentication activity

3. **Churn Indicators**
   - Trends: `account_deleted` events over time
   - Monitor account deletion as a key churn metric

4. **Team Growth**
   - Trends: `team_member_invited` vs `team_member_removed`
   - Track team expansion and contraction

5. **Subscription Engagement**
   - Trends: `subscription_managed`, `checkout_started`
   - Monitor billing-related user engagement

### Creating Your Dashboard

1. Go to your PostHog project at https://us.i.posthog.com
2. Navigate to Dashboards → New Dashboard
3. Name it "Analytics basics"
4. Add insights using the events listed above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

The skill includes:
- Example project code demonstrating best practices
- Documentation for Next.js App Router integration
- Guidelines for user identification and error tracking

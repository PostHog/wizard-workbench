# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js Pages Router SaaS application. The integration includes client-side event tracking via `instrumentation-client.ts`, a server-side PostHog client for API routes, and a reverse proxy configuration for improved tracking reliability.

## Integration Summary

### Files Created
- `instrumentation-client.ts` - Client-side PostHog initialization with error tracking enabled
- `lib/posthog-server.ts` - Server-side PostHog client for API route tracking
- `.env` - Environment variables for PostHog configuration

### Files Modified
- `next.config.ts` - Added reverse proxy rewrites for `/ingest/*` routes
- `.env.example` - Added PostHog environment variable documentation
- `components/login.tsx` - Added user identification and sign in/up events
- `components/header.tsx` - Added sign out event with PostHog reset
- `pages/pricing.tsx` - Added pricing page viewed and checkout started events
- `pages/dashboard/index.tsx` - Added team member invite/remove and customer portal events
- `pages/dashboard/general.tsx` - Added account updated event

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user signed up` | User successfully creates a new account | `components/login.tsx` |
| `user signed in` | User successfully signs into their account | `components/login.tsx` |
| `sign in failed` | User sign in attempt failed | `components/login.tsx` |
| `sign up failed` | User sign up attempt failed | `components/login.tsx` |
| `user signed out` | User signs out of their account | `components/header.tsx` |
| `pricing page viewed` | User views the pricing page (top of conversion funnel) | `pages/pricing.tsx` |
| `checkout started` | User initiates checkout for a pricing plan | `pages/pricing.tsx` |
| `team member invited` | User sends an invitation to a new team member | `pages/dashboard/index.tsx` |
| `team member removed` | User removes a team member from the team | `pages/dashboard/index.tsx` |
| `customer portal opened` | User opens Stripe customer portal to manage subscription | `pages/dashboard/index.tsx` |
| `account updated` | User updates their account information | `pages/dashboard/general.tsx` |

## Next steps

### Create Your Dashboard

To visualize these events, create a dashboard in PostHog with these recommended insights:

1. **Sign Up to Checkout Funnel** - Track conversion from `user signed up` -> `pricing page viewed` -> `checkout started`
2. **Authentication Success Rate** - Compare `user signed in` vs `sign in failed` events
3. **User Engagement** - Track `account updated`, `team member invited`, and `customer portal opened` over time
4. **Churn Indicators** - Monitor `user signed out` and `team member removed` events
5. **Pricing Page Effectiveness** - Analyze `pricing page viewed` to `checkout started` conversion rate

Visit your PostHog dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

## Environment Variables

Make sure these are set in your production environment:

```
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Next.js SaaS application. The integration includes client-side event tracking with automatic pageview capture, user identification on sign-in/sign-up, and server-side PostHog support for backend analytics.

## Files Created/Modified

### New Files
| File | Description |
|------|-------------|
| `instrumentation-client.ts` | Client-side PostHog initialization using the recommended Next.js 15.3+ approach |
| `lib/posthog-server.ts` | Server-side PostHog client for backend analytics |
| `components/tracked-link.tsx` | Reusable component for tracking external link clicks |
| `.env` | Environment variables for PostHog configuration |

### Modified Files
| File | Description |
|------|-------------|
| `next.config.ts` | Added reverse proxy rewrites for PostHog to avoid ad blockers |
| `app/(login)/login.tsx` | Added sign-in/sign-up event tracking and user identification |
| `app/(dashboard)/pricing/submit-button.tsx` | Added checkout event tracking |
| `app/(dashboard)/dashboard/security/page.tsx` | Added password update and account deletion tracking |
| `app/(dashboard)/dashboard/general/page.tsx` | Added account update tracking |
| `app/(dashboard)/dashboard/page.tsx` | Added team management event tracking |
| `app/(dashboard)/page.tsx` | Added CTA click tracking for homepage |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `sign_in_submitted` | User submits the sign in form | `app/(login)/login.tsx` |
| `sign_up_submitted` | User submits the sign up form to create a new account | `app/(login)/login.tsx` |
| `checkout_started` | User clicks Get Started button to begin checkout | `app/(dashboard)/pricing/submit-button.tsx` |
| `password_update_submitted` | User submits the password update form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deletion_submitted` | User submits the account deletion form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_update_submitted` | User submits changes to their account information | `app/(dashboard)/dashboard/general/page.tsx` |
| `team_member_invited` | Owner invites a new team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Team member is removed from the team | `app/(dashboard)/dashboard/page.tsx` |
| `subscription_managed` | User clicks to manage their subscription | `app/(dashboard)/dashboard/page.tsx` |
| `deploy_cta_clicked` | User clicks the Deploy CTA button on homepage | `app/(dashboard)/page.tsx` |
| `view_code_clicked` | User clicks the View code button on homepage | `app/(dashboard)/page.tsx` |

## User Identification

PostHog user identification is automatically triggered on:
- **Sign In**: Users are identified with their email when signing in
- **Sign Up**: Users are identified with their email when creating a new account
- **Account Deletion**: PostHog session is reset when users delete their account

## Next steps

We recommend building the following insights and dashboards in PostHog to track your key business metrics:

### Suggested Dashboard: "Analytics Basics"

1. **Sign-up to Checkout Funnel**
   - Events: `sign_up_submitted` -> `checkout_started`
   - Type: Funnel
   - Purpose: Track conversion from sign-up to payment initiation

2. **User Authentication Trends**
   - Events: `sign_in_submitted`, `sign_up_submitted`
   - Type: Trends
   - Purpose: Monitor daily/weekly authentication activity

3. **Account Churn Events**
   - Events: `account_deletion_submitted`
   - Type: Trends
   - Purpose: Track account deletion rate over time

4. **Team Engagement**
   - Events: `team_member_invited`, `team_member_removed`
   - Type: Trends
   - Purpose: Monitor team collaboration activity

5. **Homepage CTA Performance**
   - Events: `deploy_cta_clicked`, `view_code_clicked`
   - Type: Trends
   - Purpose: Track engagement with homepage CTAs

### Creating Dashboards

To create these insights, go to your PostHog dashboard:
- **PostHog US**: https://us.posthog.com/project/insights/new
- **PostHog EU**: https://eu.posthog.com/project/insights/new

## Configuration

Environment variables are stored in `.env`:
```
NEXT_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The reverse proxy is configured in `next.config.ts` to route PostHog traffic through `/ingest/*` to avoid ad blockers.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

The skill includes:
- Example project code for reference
- Official PostHog Next.js documentation
- User identification best practices
- Workflow guides for future integrations

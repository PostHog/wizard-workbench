# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js App Router project with PostHog analytics. The integration includes:

- **Client-side initialization** via `instrumentation-client.ts` for automatic pageview tracking, session replay, and exception capture
- **Reverse proxy configuration** in `next.config.ts` to route PostHog requests through your domain, improving tracking reliability
- **Server-side PostHog client** in `lib/posthog-server.ts` for future server-side event tracking
- **User identification** on sign-in and sign-up flows
- **Custom event tracking** for key business actions across the application

## Events implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_up` | User successfully completed sign up form | `app/(login)/login.tsx` |
| `user_signed_in` | User successfully completed sign in form | `app/(login)/login.tsx` |
| `checkout_started` | User clicked to start checkout for a pricing plan | `app/(dashboard)/pricing/submit-button.tsx` |
| `subscription_managed` | User clicked to manage their subscription in customer portal | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_invited` | Owner submitted form to invite a team member | `app/(dashboard)/dashboard/page.tsx` |
| `team_member_removed` | Owner removed a team member from the team | `app/(dashboard)/dashboard/page.tsx` |
| `account_updated` | User submitted account information update form | `app/(dashboard)/dashboard/general/page.tsx` |
| `password_updated` | User submitted password update form | `app/(dashboard)/dashboard/security/page.tsx` |
| `account_deleted` | User submitted account deletion form | `app/(dashboard)/dashboard/security/page.tsx` |
| `terminal_copied` | User copied the terminal commands from landing page | `app/(dashboard)/terminal.tsx` |

## Files created/modified

### New files
- `instrumentation-client.ts` - Client-side PostHog initialization
- `lib/posthog-server.ts` - Server-side PostHog client
- `.env` - Environment variables for PostHog configuration

### Modified files
- `next.config.ts` - Added reverse proxy rewrites for PostHog
- `app/(login)/login.tsx` - Added user identification and sign-in/sign-up events
- `app/(dashboard)/pricing/submit-button.tsx` - Added checkout event
- `app/(dashboard)/dashboard/page.tsx` - Added team management events
- `app/(dashboard)/dashboard/general/page.tsx` - Added account update event
- `app/(dashboard)/dashboard/security/page.tsx` - Added password and account deletion events
- `app/(dashboard)/terminal.tsx` - Added terminal copy event

## Next steps

### Configure your environment

Make sure your `.env` file contains the PostHog configuration:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Suggested dashboard insights

Once your PostHog project is receiving events, create the following insights:

1. **Sign-up to Checkout Funnel** - Track conversion from `user_signed_up` to `checkout_started`
2. **User Activation Rate** - Percentage of sign-ups that complete checkout
3. **Team Collaboration** - Track `team_member_invited` events over time
4. **Account Health** - Monitor `account_deleted` events as a churn indicator
5. **Engagement** - Track `terminal_copied` events as a landing page engagement metric

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This context will help you prevent the model from using out-of-date approaches to the PostHog integration.

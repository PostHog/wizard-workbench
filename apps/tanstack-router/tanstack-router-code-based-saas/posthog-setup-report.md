# PostHog post-wizard report

The wizard has completed a deep integration of your CloudFlow SaaS application with PostHog product analytics. The integration includes:

- **PostHog Provider**: Wrapped your application with `PostHogProvider` in the root route component (`RootComponent`)
- **User Identification**: Users are automatically identified when they sign in, and their identity is reset on sign out
- **Event Tracking**: Key business events are tracked throughout the application including authentication, invoicing, and upgrade flows
- **Reverse Proxy**: Configured Vite's development server to proxy PostHog requests through `/ingest` for better ad-blocker resistance
- **Environment Variables**: Uses `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` from your `.env` file

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | Tracks when a user successfully logs in to the application | `src/main.tsx` |
| `user_signed_out` | Tracks when a user logs out of the application | `src/main.tsx` |
| `invoice_created` | Tracks when a user successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | Tracks when a user updates an existing invoice | `src/main.tsx` |
| `upgrade_clicked` | Tracks when a user clicks the upgrade button on the profile page | `src/main.tsx` |
| `team_member_viewed` | Tracks when a user views a team member's profile | `src/main.tsx` |
| `invoice_link_clicked` | Tracks when a user clicks the View Invoice link from the home page | `src/main.tsx` |

## Files Modified

- `vite.config.js` - Added PostHog reverse proxy configuration
- `src/main.tsx` - Added PostHogProvider, user identification, and event tracking
- `src/vite-env.d.ts` - Added TypeScript types for Vite environment variables
- `.env` - Contains PostHog API key and host (already configured)

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/238460/dashboard/1227372) - Core analytics dashboard for CloudFlow

### Insights
- [User Authentication Activity](https://us.posthog.com/project/238460/insights/YKgvfz4Q) - Tracks user sign-ins and sign-outs over time
- [Invoice Activity](https://us.posthog.com/project/238460/insights/ImUh7pc6) - Tracks invoice creation and updates over time
- [Upgrade Button Clicks](https://us.posthog.com/project/238460/insights/41yBjGCf) - Tracks upgrade button clicks - potential revenue opportunities
- [Team Engagement](https://us.posthog.com/project/238460/insights/UfmNPquY) - Tracks team member profile views - collaboration activity
- [Sign-in to Invoice Creation Funnel](https://us.posthog.com/project/238460/insights/RnX3YfhV) - Conversion funnel from user sign-in to invoice creation

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

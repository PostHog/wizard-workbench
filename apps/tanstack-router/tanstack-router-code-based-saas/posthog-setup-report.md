# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloudFlow SaaS application. This integration includes:

- **PostHog Provider Setup**: Wrapped the root component with `PostHogProvider` for global analytics access
- **User Identification**: Users are identified on login with their username, enabling cross-session tracking
- **Event Tracking**: Added comprehensive event tracking for key business actions
- **Error Tracking**: Integrated `captureException` for error monitoring on invoice operations
- **Session Management**: Implemented `posthog.reset()` on logout to properly end user sessions
- **Reverse Proxy**: Configured Vite proxy for PostHog ingestion to avoid ad blockers

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `user_signed_in` | Fired when a user successfully logs in | `src/main.tsx` (LoginComponent) |
| `user_signed_out` | Fired when a user logs out | `src/main.tsx` (LoginComponent, ProfileComponent) |
| `invoice_created` | Fired when a new invoice is created (conversion event) | `src/main.tsx` (InvoicesIndexComponent) |
| `invoice_create_failed` | Fired when invoice creation fails | `src/main.tsx` (InvoicesIndexComponent) |
| `invoice_updated` | Fired when an existing invoice is updated | `src/main.tsx` (InvoiceComponent) |
| `invoice_update_failed` | Fired when invoice update fails | `src/main.tsx` (InvoiceComponent) |
| `invoice_viewed` | Fired when a user views a specific invoice | `src/main.tsx` (InvoiceComponent) |
| `team_member_viewed` | Fired when a user views a team member's profile | `src/main.tsx` (UserComponent) |
| `team_members_filtered` | Fired when a user sorts the team members list | `src/main.tsx` (UsersLayoutComponent) |
| `upgrade_clicked` | Fired when a user clicks the upgrade button (conversion intent) | `src/main.tsx` (ProfileComponent) |

## Configuration Files Modified

- `.env` - Added PostHog API key and host environment variables
- `vite.config.js` - Added reverse proxy configuration for `/ingest` endpoint
- `src/vite-env.d.ts` - Added TypeScript type definitions for Vite environment variables
- `src/main.tsx` - Main application file with PostHog integration

## Environment Variables

The following environment variables are required:

```
VITE_PUBLIC_POSTHOG_KEY=<your-posthog-project-api-key>
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We recommend creating the following insights in your PostHog dashboard to monitor user behavior:

1. **User Authentication Funnel**: Track `user_signed_in` to `invoice_created` conversion
2. **Invoice Lifecycle**: Monitor `invoice_viewed` -> `invoice_updated` patterns
3. **Upgrade Funnel**: Track users from `upgrade_clicked` to conversion
4. **Error Rate**: Monitor `invoice_create_failed` and `invoice_update_failed` rates
5. **Team Engagement**: Track `team_member_viewed` and `team_members_filtered` activity

To create these insights:
1. Go to your [PostHog dashboard](https://us.posthog.com)
2. Navigate to Insights and create new visualizations using the events above
3. Create a dashboard named "Analytics basics" to group these insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your React TanStack Router (file-based) project with PostHog analytics. The following changes were made:

## Integration Summary

1. **PostHog Provider Setup** (`src/routes/__root.tsx`)
   - Added `PostHogProvider` wrapper around the entire application
   - Configured with environment variables for API key and host
   - Enabled automatic exception capture and debug mode in development

2. **Environment Variables** (`.env`)
   - Added `VITE_PUBLIC_POSTHOG_KEY` for the PostHog API key
   - Added `VITE_PUBLIC_POSTHOG_HOST` for the PostHog host URL

3. **TypeScript Configuration** (`src/vite-env.d.ts`)
   - Created Vite environment type definitions for PostHog environment variables

4. **User Identification** (`src/routes/login.tsx`)
   - Users are identified on login with their username
   - Session is reset on logout to maintain clean user data

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `user_logged_in` | User successfully signed in to their account | `src/routes/login.tsx` |
| `user_logged_out` | User signed out of their account | `src/routes/login.tsx` |
| `invoice_created` | User created a new invoice - conversion event | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_viewed` | User viewed a specific invoice - funnel event | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_updated` | User updated an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | User toggled internal notes visibility | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_viewed` | User viewed a team member profile | `src/routes/dashboard.users.user.tsx` |
| `profile_settings_viewed` | User viewed their account settings | `src/routes/_auth.profile.tsx` |
| `upgrade_clicked` | User clicked upgrade button - conversion intent | `src/routes/_auth.profile.tsx` |
| `cta_dashboard_clicked` | User clicked Go to Dashboard CTA from home | `src/routes/index.tsx` |
| `cta_signin_clicked` | User clicked Sign In CTA from home | `src/routes/index.tsx` |
| `pending_invoice_clicked` | User clicked to view pending invoice notification | `src/routes/index.tsx` |

## Recommended Dashboard: "Analytics Basics"

Create a dashboard with the following insights to track key business metrics:

### 1. User Authentication Funnel
- **Type**: Funnel
- **Events**: `user_logged_in` → `invoice_viewed` → `invoice_created`
- **Purpose**: Track conversion from login to invoice creation

### 2. Invoice Management Activity
- **Type**: Trends
- **Events**: `invoice_created`, `invoice_updated`, `invoice_viewed`
- **Purpose**: Monitor daily invoice-related activities

### 3. Upgrade Intent Tracking
- **Type**: Trends
- **Events**: `profile_settings_viewed`, `upgrade_clicked`
- **Purpose**: Track users showing upgrade intent

### 4. Homepage CTA Effectiveness
- **Type**: Trends
- **Events**: `cta_dashboard_clicked`, `cta_signin_clicked`, `pending_invoice_clicked`
- **Purpose**: Measure homepage call-to-action performance

### 5. User Retention
- **Type**: Retention
- **Starting Event**: `user_logged_in`
- **Returning Event**: `user_logged_in`
- **Purpose**: Track user return rate over time

## Next steps

To view your analytics data:

1. **Access PostHog**: Visit https://us.i.posthog.com
2. **Create Dashboard**: Navigate to Dashboards → New Dashboard → Name it "Analytics Basics"
3. **Add Insights**: Create the recommended insights above using the events we've implemented

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

## Running the Application

1. Ensure environment variables are set in `.env`:
   ```
   VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
   VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open http://localhost:3000 and interact with the app to generate events

</wizard-report>

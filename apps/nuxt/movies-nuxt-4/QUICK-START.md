# Quick Start - PostHog Dashboard Creation

Follow these direct links to create your analytics dashboard quickly.

## Step 1: Create Dashboard

1. Go to: https://us.posthog.com/project/2/dashboard
2. Click "New Dashboard"
3. Enter:
   - Name: `Analytics basics`
   - Description: `Core analytics for Nuxt Movies: user authentication, content engagement, and search behavior`
4. Click "Create"

## Step 2: Create Insights

Click each link below to create a new insight. After configuring each one, save it to the "Analytics basics" dashboard.

### Insight 1: Login to First Media View Funnel
**Link:** https://us.posthog.com/project/2/insights/new

Configuration:
- Change to "Funnel" insight type
- Step 1: Add event `user_logged_in`
- Step 2: Add event `media_viewed`
- Set conversion window to 1 day
- Save as "Login to First Media View Funnel"

### Insight 2: Daily Active Users
**Link:** https://us.posthog.com/project/2/insights/new

Configuration:
- Keep "Trends" insight type
- Add event `user_logged_in`
- Change math to "Unique users"
- Set interval to "Day"
- Save as "Daily Active Users"

### Insight 3: Top Search Queries
**Link:** https://us.posthog.com/project/2/insights/new

Configuration:
- Keep "Trends" insight type
- Add event `search_performed`
- Click "Add breakdown" → "Event property" → `search_query`
- Change display to "Table"
- Save as "Top Search Queries"

### Insight 4: Media Views by Type
**Link:** https://us.posthog.com/project/2/insights/new

Configuration:
- Keep "Trends" insight type
- Add event `media_viewed`
- Click "Add breakdown" → "Event property" → `media_type`
- Set interval to "Day"
- Save as "Media Views by Type"

### Insight 5: Error Rate Trend
**Link:** https://us.posthog.com/project/2/insights/new

Configuration:
- Keep "Trends" insight type
- Add event `error_displayed`
- Set interval to "Day"
- Save as "Error Rate Trend"

## Step 3: View Your Dashboard

Return to the dashboard list and open "Analytics basics":
https://us.posthog.com/project/2/dashboard

## All Dashboard URLs

Once created, your resources will be at these URLs (IDs will vary):

- Dashboard: `https://us.posthog.com/project/2/dashboard/[DASHBOARD_ID]`
- Insight 1: `https://us.posthog.com/project/2/insights/[INSIGHT_ID_1]`
- Insight 2: `https://us.posthog.com/project/2/insights/[INSIGHT_ID_2]`
- Insight 3: `https://us.posthog.com/project/2/insights/[INSIGHT_ID_3]`
- Insight 4: `https://us.posthog.com/project/2/insights/[INSIGHT_ID_4]`
- Insight 5: `https://us.posthog.com/project/2/insights/[INSIGHT_ID_5]`

## For More Details

See the comprehensive guides:
- `posthog-dashboard-setup.md` - Detailed instructions with screenshots
- `posthog-insights-config.json` - Complete JSON configuration
- `POSTHOG-SETUP-SUMMARY.md` - Overview and next steps

## Time Estimate

Total setup time: 10-15 minutes

- Dashboard creation: 1 minute
- Each insight: 2-3 minutes
- Total: ~10-15 minutes

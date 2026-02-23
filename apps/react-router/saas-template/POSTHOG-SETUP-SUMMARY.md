# PostHog Dashboard Setup - Summary

## Current Status

Due to API key permission limitations, the dashboard and insights could not be created automatically. The current API key (`phx_API_KEY_IS_HARDCODED`) has the following scope restrictions:

- Missing: `dashboard:write` - Required to create dashboards
- Missing: `insight:write` - Required to create insights
- Missing: `query:read` - Required to execute HogQL queries

## What Has Been Prepared

Three comprehensive setup files have been created:

### 1. posthog-dashboard-setup.json
Complete JSON configuration with all query definitions that can be:
- Used with the PostHog API (when you have proper API key scopes)
- Imported into PostHog's query editor (JSON mode)
- Used as reference for manual setup

### 2. create-posthog-dashboard.py
A Python script that automates the entire setup process:
- Creates the "Analytics basics" dashboard
- Creates all 5 insights with proper queries
- Adds insights to the dashboard
- Outputs all URLs for easy access

**To use this script:**
```bash
export POSTHOG_API_KEY="your_api_key_with_write_scopes"
python3 create-posthog-dashboard.py
```

### 3. POSTHOG-DASHBOARD-SETUP.md
Comprehensive manual setup guide with:
- Step-by-step UI instructions for each insight
- JSON query definitions for advanced mode
- HogQL alternatives for SQL-based creation
- Troubleshooting tips
- Verification steps

## Dashboard Specifications

### Dashboard Details
- **Name:** Analytics basics
- **Description:** Key business metrics for the SaaS app: conversions, churn, and user engagement
- **Pinned:** Yes
- **Project ID:** 2 (PostHog App + Website)

### Insights Included

#### 1. User Signup Funnel
- **Type:** Funnel (4 steps)
- **Events:** user_registered → user_signed_up_completed → onboarding_user_account_completed → onboarding_organization_created
- **Date Range:** Last 30 days
- **Conversion Window:** 7 days
- **Purpose:** Track signup completion rate and identify drop-off points

#### 2. Subscription Conversion Rate
- **Type:** Trend (2 series line chart)
- **Events:** subscription_checkout_started vs checkout_session_completed
- **Interval:** Daily
- **Date Range:** Last 30 days
- **Purpose:** Monitor checkout conversion performance

#### 3. Subscription Churn
- **Type:** Trend (2 series line chart)
- **Events:** subscription_cancelled vs subscription_resumed
- **Interval:** Weekly
- **Date Range:** Last 90 days
- **Purpose:** Track churn trends and recovery rates

#### 4. Daily Active Users (Logins)
- **Type:** Trend (unique users)
- **Event:** user_logged_in
- **Interval:** Daily
- **Date Range:** Last 30 days
- **Purpose:** Monitor daily engagement and retention

#### 5. Contact Sales Submissions
- **Type:** Trend (bar chart)
- **Event:** contact_sales_submitted
- **Interval:** Daily
- **Date Range:** Last 90 days
- **Purpose:** Track enterprise sales interest

## Expected URLs (After Creation)

When the dashboard and insights are created, they will be accessible at these URL patterns:

**Dashboard URL:**
```
https://us.posthog.com/project/2/dashboard/{DASHBOARD_ID}
```

**Insight URLs:**
```
https://us.posthog.com/project/2/insights/{INSIGHT_SHORT_ID}
```

## Example Reference

For reference, there's already a similar dashboard in your PostHog project:
- **Dashboard ID:** 1295821
- **URL:** https://us.posthog.com/project/2/dashboard/1295821

This dashboard has a similar structure but tracks slightly different events. You can use it as a template or modify it to match your exact requirements.

## Next Steps

Choose one of these options to proceed:

### Option A: Automated Setup (Recommended)
1. Create a new PostHog Personal API Key with these scopes:
   - `dashboard:write`
   - `insight:write`
2. Set the API key: `export POSTHOG_API_KEY="your_new_key"`
3. Run: `python3 create-posthog-dashboard.py`
4. The script will output all URLs

### Option B: Manual Setup via UI
1. Open the [POSTHOG-DASHBOARD-SETUP.md](./POSTHOG-DASHBOARD-SETUP.md) file
2. Follow the "Method 2: Manual Setup via PostHog UI" section
3. Create each insight step-by-step in the PostHog UI
4. Add all insights to your dashboard

### Option C: Use HogQL Editor
1. Open PostHog SQL Editor
2. Copy HogQL queries from POSTHOG-DASHBOARD-SETUP.md
3. Run each query and save as insight
4. Create dashboard and add saved insights

## API Key Creation Instructions

To create an API key with proper scopes:

1. Go to: https://us.posthog.com/settings/user-api-keys
2. Click "Create personal API key"
3. Name it: "Dashboard Creation"
4. Select scopes:
   - ✓ dashboard:write
   - ✓ insight:write
5. Click "Create key"
6. Copy the key (starts with `phx_`)
7. Use it with the Python script

## Events Being Tracked

Ensure your application is sending these events to PostHog:

**Authentication & Signup:**
- user_registered
- user_logged_in
- user_signed_up_completed

**Onboarding:**
- onboarding_user_account_completed
- onboarding_organization_created

**Organization Management:**
- organization_created
- team_member_invited
- team_member_role_changed

**Subscriptions:**
- subscription_checkout_started
- checkout_session_completed
- subscription_cancelled
- subscription_resumed

**Other Actions:**
- contact_sales_submitted
- user_account_deleted

## Verification Checklist

After setup, verify:

- [ ] Dashboard appears in your PostHog dashboards list
- [ ] Dashboard is pinned for easy access
- [ ] All 5 insights are visible on the dashboard
- [ ] User Signup Funnel shows all 4 steps
- [ ] Subscription Conversion Rate shows 2 trend lines
- [ ] Subscription Churn shows 2 trend lines
- [ ] Daily Active Users shows login trends
- [ ] Contact Sales Submissions shows bar chart data
- [ ] All insights display data (if events have been sent)
- [ ] Date ranges are correct for each insight

## Support & Documentation

- **Setup Guide:** [POSTHOG-DASHBOARD-SETUP.md](./POSTHOG-DASHBOARD-SETUP.md)
- **JSON Config:** [posthog-dashboard-setup.json](./posthog-dashboard-setup.json)
- **Automation Script:** [create-posthog-dashboard.py](./create-posthog-dashboard.py)
- **PostHog Docs:** https://posthog.com/docs
- **API Reference:** https://posthog.com/docs/api

## Notes

- The dashboard tracks React Router SaaS application events
- All queries use standard PostHog InsightVizNode format
- HogQL alternatives are provided for SQL-based workflows
- Date ranges are optimized for typical SaaS metrics (30d for engagement, 90d for churn)
- Funnel conversion window is set to 7 days (adjustable based on your user journey)

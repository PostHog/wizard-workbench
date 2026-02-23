# PostHog Analytics Dashboard Setup

This document provides complete instructions for creating an "Analytics basics" dashboard with 5 key insights for your React Router SaaS application.

## Overview

The dashboard tracks these key business metrics:
- **User Signup Funnel**: Complete conversion flow from registration to organization creation
- **Subscription Conversion Rate**: Checkout initiation vs completion
- **Subscription Churn**: Cancellations vs resumptions
- **Daily Active Users**: Login activity trends
- **Contact Sales Submissions**: Sales inquiry volume

## Events Being Tracked

The dashboard uses these events from your application:
- `user_registered`
- `user_logged_in`
- `user_signed_up_completed`
- `onboarding_user_account_completed`
- `onboarding_organization_created`
- `organization_created`
- `team_member_invited`
- `team_member_role_changed`
- `subscription_checkout_started`
- `subscription_cancelled`
- `subscription_resumed`
- `checkout_session_completed`
- `contact_sales_submitted`
- `user_account_deleted`

## Setup Methods

### Method 1: Automated Setup (Recommended)

**Requirements:**
- PostHog API key with `dashboard:write` and `insight:write` scopes

**Steps:**

1. Set your API key as an environment variable:
   ```bash
   export POSTHOG_API_KEY="phx_your_api_key_here"
   ```

2. Run the creation script:
   ```bash
   python3 create-posthog-dashboard.py
   ```

3. The script will output the dashboard URL and all insight URLs

**Note:** The current API key in the environment (`phx_API_KEY_IS_HARDCODED`) does not have the required write scopes. You'll need to create a new API key with the proper permissions in PostHog settings.

### Method 2: Manual Setup via PostHog UI

#### Step 1: Create the Dashboard

1. Navigate to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
2. Click **"New dashboard"**
3. Enter the following details:
   - **Name:** `Analytics basics`
   - **Description:** `Key business metrics for the SaaS app: conversions, churn, and user engagement`
4. Click **"Create"**

#### Step 2: Create Insights

For each insight below, click **"New insight"** on your dashboard and follow the specific instructions:

---

### Insight 1: User Signup Funnel

**Type:** Funnel

**Configuration:**
1. Select **"Funnel"** as the insight type
2. Add the following steps in order:
   - Step 1: `user_registered` (label: "User Registered")
   - Step 2: `user_signed_up_completed` (label: "Signup Completed")
   - Step 3: `onboarding_user_account_completed` (label: "Account Setup Completed")
   - Step 4: `onboarding_organization_created` (label: "Organization Created")
3. Set date range: **Last 30 days**
4. Set conversion window: **7 days**
5. Name: `User Signup Funnel`
6. Description: `Tracks the complete user signup flow from registration through onboarding steps`

**JSON Query (Advanced Mode):**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "FunnelsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "event": "user_registered",
        "custom_name": "User Registered"
      },
      {
        "kind": "EventsNode",
        "event": "user_signed_up_completed",
        "custom_name": "Signup Completed"
      },
      {
        "kind": "EventsNode",
        "event": "onboarding_user_account_completed",
        "custom_name": "Account Setup Completed"
      },
      {
        "kind": "EventsNode",
        "event": "onboarding_organization_created",
        "custom_name": "Organization Created"
      }
    ],
    "dateRange": {
      "date_from": "-30d"
    },
    "funnelsFilter": {
      "funnelWindowInterval": 7,
      "funnelWindowIntervalUnit": "day"
    }
  }
}
```

---

### Insight 2: Subscription Conversion Rate

**Type:** Trend

**Configuration:**
1. Select **"Trend"** as the insight type
2. Add two series:
   - Series 1: `subscription_checkout_started` (label: "Checkout Started")
   - Series 2: `checkout_session_completed` (label: "Checkout Completed")
3. Set interval: **Daily**
4. Set date range: **Last 30 days**
5. Display type: **Line graph**
6. Name: `Subscription Conversion Rate`
7. Description: `Daily trend comparing users who start checkout vs those who complete it`

**JSON Query (Advanced Mode):**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "math": "total",
        "event": "subscription_checkout_started",
        "custom_name": "Checkout Started"
      },
      {
        "kind": "EventsNode",
        "math": "total",
        "event": "checkout_session_completed",
        "custom_name": "Checkout Completed"
      }
    ],
    "interval": "day",
    "dateRange": {
      "date_from": "-30d"
    },
    "trendsFilter": {
      "display": "ActionsLineGraph"
    },
    "version": 2
  }
}
```

**HogQL Alternative:**
```sql
SELECT
  toDate(timestamp) as date,
  event,
  count() as count
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
  AND event IN ['subscription_checkout_started', 'checkout_session_completed']
GROUP BY date, event
ORDER BY date, event
```

---

### Insight 3: Subscription Churn

**Type:** Trend

**Configuration:**
1. Select **"Trend"** as the insight type
2. Add two series:
   - Series 1: `subscription_cancelled` (label: "Subscriptions Cancelled")
   - Series 2: `subscription_resumed` (label: "Subscriptions Resumed")
3. Set interval: **Weekly**
4. Set date range: **Last 90 days**
5. Display type: **Line graph**
6. Name: `Subscription Churn`
7. Description: `Weekly comparison of subscription cancellations vs resumptions`

**JSON Query (Advanced Mode):**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "math": "total",
        "event": "subscription_cancelled",
        "custom_name": "Subscriptions Cancelled"
      },
      {
        "kind": "EventsNode",
        "math": "total",
        "event": "subscription_resumed",
        "custom_name": "Subscriptions Resumed"
      }
    ],
    "interval": "week",
    "dateRange": {
      "date_from": "-90d"
    },
    "trendsFilter": {
      "display": "ActionsLineGraph"
    },
    "version": 2
  }
}
```

**HogQL Alternative:**
```sql
SELECT
  toStartOfWeek(timestamp) as week,
  event,
  count() as count
FROM events
WHERE timestamp >= now() - INTERVAL 90 DAY
  AND event IN ['subscription_cancelled', 'subscription_resumed']
GROUP BY week, event
ORDER BY week, event
```

---

### Insight 4: Daily Active Users (Logins)

**Type:** Trend

**Configuration:**
1. Select **"Trend"** as the insight type
2. Add one series:
   - Series: `user_logged_in` (label: "Daily Active Users")
   - Math: **Unique users** (DAU)
3. Set interval: **Daily**
4. Set date range: **Last 30 days**
5. Display type: **Line graph**
6. Name: `Daily Active Users (Logins)`
7. Description: `Daily count of unique users logging into the application`

**JSON Query (Advanced Mode):**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "math": "dau",
        "event": "user_logged_in",
        "custom_name": "Daily Active Users"
      }
    ],
    "interval": "day",
    "dateRange": {
      "date_from": "-30d"
    },
    "trendsFilter": {
      "display": "ActionsLineGraph"
    },
    "version": 2
  }
}
```

**HogQL Alternative:**
```sql
SELECT
  toDate(timestamp) as date,
  uniq(person_id) as daily_active_users
FROM events
WHERE timestamp >= now() - INTERVAL 30 DAY
  AND event = 'user_logged_in'
GROUP BY date
ORDER BY date
```

---

### Insight 5: Contact Sales Submissions

**Type:** Trend

**Configuration:**
1. Select **"Trend"** as the insight type
2. Add one series:
   - Series: `contact_sales_submitted` (label: "Sales Inquiries")
   - Math: **Total count**
3. Set interval: **Daily**
4. Set date range: **Last 90 days**
5. Display type: **Bar chart**
6. Name: `Contact Sales Submissions`
7. Description: `Daily trend of contact sales form submissions over the past 90 days`

**JSON Query (Advanced Mode):**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "math": "total",
        "event": "contact_sales_submitted",
        "custom_name": "Sales Inquiries"
      }
    ],
    "interval": "day",
    "dateRange": {
      "date_from": "-90d"
    },
    "trendsFilter": {
      "display": "ActionsBarValue"
    },
    "version": 2
  }
}
```

**HogQL Alternative:**
```sql
SELECT
  toDate(timestamp) as date,
  count() as submissions
FROM events
WHERE timestamp >= now() - INTERVAL 90 DAY
  AND event = 'contact_sales_submitted'
GROUP BY date
ORDER BY date
```

---

## Method 3: Using HogQL Directly

If you prefer to use SQL-like queries, you can create insights using HogQL:

1. Go to **Data Management** → **SQL Editor** in PostHog
2. Paste any of the HogQL queries provided above
3. Run the query to see results
4. Click **"Save as insight"**
5. Add the insight to your dashboard

## Verification

After setup, your dashboard should display:

1. **User Signup Funnel** - Shows drop-off at each stage of the signup process
2. **Subscription Conversion Rate** - Two lines comparing checkout starts vs completions
3. **Subscription Churn** - Two lines showing cancellations and resumptions
4. **Daily Active Users** - Single line showing daily login trends
5. **Contact Sales Submissions** - Bar chart showing sales inquiry volume

## Files Included

- **posthog-dashboard-setup.json** - Complete JSON configuration for API-based setup
- **create-posthog-dashboard.py** - Python script for automated dashboard creation
- **POSTHOG-DASHBOARD-SETUP.md** - This file with manual setup instructions

## Troubleshooting

### API Key Issues

If you get a `permission_denied` error, your API key needs these scopes:
- `dashboard:write` - To create dashboards
- `insight:write` - To create insights
- `query:read` - To execute HogQL queries (optional)

To create a new API key:
1. Go to [PostHog Settings → Personal API Keys](https://us.posthog.com/settings/user-api-keys)
2. Click **"Create personal API key"**
3. Select the required scopes
4. Save the key securely

### Events Not Showing Up

If events aren't appearing in your insights:
1. Verify events are being sent to PostHog (check the Events page)
2. Ensure event names match exactly (case-sensitive)
3. Check the date range includes when events were sent
4. Confirm your project ID is correct (currently: project 2)

## Additional Resources

- [PostHog API Documentation](https://posthog.com/docs/api)
- [HogQL Reference](https://posthog.com/docs/hogql)
- [Funnel Insights Guide](https://posthog.com/docs/product-analytics/funnels)
- [Trend Insights Guide](https://posthog.com/docs/product-analytics/trends)

## Support

For issues with this setup:
1. Check the PostHog documentation
2. Review the event definitions in your PostHog project
3. Verify your API key has the correct scopes
4. Contact PostHog support if you need assistance with API access

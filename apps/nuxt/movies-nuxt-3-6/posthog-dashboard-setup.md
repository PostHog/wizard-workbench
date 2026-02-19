# PostHog Dashboard Setup for Nuxt Movies App

## Overview
This document provides the complete API calls and JSON payloads to create the "Analytics basics" dashboard with 5 key insights for the Nuxt Movies application.

## Prerequisites
- PostHog Personal API Key with `dashboard:write` and `insight:write` scopes
- Project ID: `2`
- PostHog Region: US (https://us.posthog.com)

## Current API Key Limitation
The current API key (`POSTHOG_PERSONAL_API_KEY`) only has read permissions and is missing:
- `dashboard:write` scope (required to create dashboards)
- `insight:write` scope (required to create insights)

## Events Tracked in the App
The Nuxt Movies app currently tracks these events:
- `user_logged_in` - When a user successfully logs in
- `user_logged_out` - When a user logs out
- `search_performed` - When a user performs a search (with query and result_count properties)
- `media_viewed` - When a user views a movie/TV show (with media_type, media_id, and media_title properties)

## Setup Instructions

### Step 1: Create the Dashboard

```bash
curl -X POST "https://us.posthog.com/api/projects/2/dashboards/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics basics",
    "description": "Core analytics dashboard for the Nuxt Movies app tracking user logins, media views, searches, and churn events."
  }'
```

Save the `id` from the response - you'll need it to add insights to the dashboard.

### Step 2: Create Insight 1 - Daily Logins

```bash
curl -X POST "https://us.posthog.com/api/projects/2/insights/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Logins",
    "description": "Daily count of user login events",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "user_logged_in",
          "name": "user_logged_in",
          "math": "total"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "trendsFilter": {
        "display": "ActionsLineGraph"
      }
    }
  }'
```

### Step 3: Create Insight 2 - Login to Media View Funnel

```bash
curl -X POST "https://us.posthog.com/api/projects/2/insights/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Login to Media View Funnel",
    "description": "Conversion funnel from user login to media view",
    "query": {
      "kind": "FunnelsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "user_logged_in",
          "name": "user_logged_in"
        },
        {
          "kind": "EventsNode",
          "event": "media_viewed",
          "name": "media_viewed"
        }
      ],
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "funnelsFilter": {
        "funnelWindowInterval": 14,
        "funnelWindowIntervalUnit": "day"
      }
    }
  }'
```

### Step 4: Create Insight 3 - Search Activity

```bash
curl -X POST "https://us.posthog.com/api/projects/2/insights/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Search Activity",
    "description": "Trend of search performed events over time",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "search_performed",
          "name": "search_performed",
          "math": "total"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "trendsFilter": {
        "display": "ActionsLineGraph"
      }
    }
  }'
```

### Step 5: Create Insight 4 - Active Users (Logins)

```bash
curl -X POST "https://us.posthog.com/api/projects/2/insights/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Active Users (Logins)",
    "description": "Unique users who logged in over time",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "user_logged_in",
          "name": "user_logged_in",
          "math": "dau"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "trendsFilter": {
        "display": "ActionsLineGraph"
      }
    }
  }'
```

### Step 6: Create Insight 5 - Logout Events (Churn Signal)

```bash
curl -X POST "https://us.posthog.com/api/projects/2/insights/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Logout Events (Churn Signal)",
    "description": "Daily count of user logout events as a churn indicator",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "user_logged_out",
          "name": "user_logged_out",
          "math": "total"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "trendsFilter": {
        "display": "ActionsLineGraph"
      }
    }
  }'
```

### Step 7: Add Insights to Dashboard

After creating each insight, save the insight `id` from the response. Then add each insight to the dashboard:

```bash
curl -X PATCH "https://us.posthog.com/api/projects/2/dashboards/{dashboard_id}/" \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "tiles": [
      {
        "insight": {insight_1_id},
        "layouts": {
          "sm": {"x": 0, "y": 0, "w": 6, "h": 5}
        }
      },
      {
        "insight": {insight_2_id},
        "layouts": {
          "sm": {"x": 6, "y": 0, "w": 6, "h": 5}
        }
      },
      {
        "insight": {insight_3_id},
        "layouts": {
          "sm": {"x": 0, "y": 5, "w": 6, "h": 5}
        }
      },
      {
        "insight": {insight_4_id},
        "layouts": {
          "sm": {"x": 6, "y": 5, "w": 6, "h": 5}
        }
      },
      {
        "insight": {insight_5_id},
        "layouts": {
          "sm": {"x": 0, "y": 10, "w": 6, "h": 5}
        }
      }
    ]
  }'
```

## Alternative: Create via PostHog UI

If you don't have an API key with write permissions, you can create these insights manually in the PostHog UI:

1. Go to https://us.posthog.com/project/2/dashboards
2. Click "New dashboard"
3. Name it "Analytics basics" with the description above
4. Click "Add insight" for each of the 5 insights
5. Configure each insight using the parameters from the JSON payloads above
6. Use the JSON source editor (click the `{}` icon) to paste the query JSON directly

## Dashboard URL Format

Once created, the dashboard will be accessible at:
```
https://us.posthog.com/project/2/dashboard/{dashboard_id}
```

Each insight will be accessible at:
```
https://us.posthog.com/project/2/insights/{insight_id}
```

## Notes

- All insights use a 30-day lookback period by default (`-30d`)
- The funnel uses a 14-day window for conversion tracking
- Math types:
  - `total` - Total count of events
  - `dau` - Daily Active Users (unique users per day)
- Display type `ActionsLineGraph` creates a line chart visualization

## References

- [PostHog Trends Documentation](https://posthog.com/docs/product-analytics/trends)
- [PostHog Funnels Guide](https://visionlabs.com/academy/posthog/funnels/)
- [PostHog API Documentation](https://posthog.com/docs/api)

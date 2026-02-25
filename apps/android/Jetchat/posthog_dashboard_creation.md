# PostHog Dashboard and Insights Creation for Jetchat

This document contains all the API payloads needed to create a comprehensive analytics dashboard for the Jetchat Android app.

## Prerequisites

- PostHog Project ID: `238460`
- PostHog Personal API Key with `dashboard:write` and `insight:write` scopes
- PostHog API Base URL: `https://us.posthog.com/api`

## API Authentication

All requests require the Authorization header:
```
Authorization: Bearer YOUR_API_KEY_HERE
```

## Step 1: Create Dashboard

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/dashboards/`

**Payload:**
```json
{
  "name": "Analytics basics",
  "description": "Core analytics dashboard for tracking user engagement, messaging activity, and key business metrics for the Jetchat Android app",
  "pinned": false
}
```

**Expected Response:** Dashboard object with `id` field. Save this ID for linking insights.

---

## Step 2: Create Insights

### Insight 1: Daily Active Users

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/insights/`

**Payload:**
```json
{
  "name": "Daily Active Users",
  "description": "Unique users triggering any event per day",
  "query": {
    "kind": "InsightVizNode",
    "source": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": null,
          "custom_name": "Daily Active Users",
          "math": "dau"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "properties": [],
      "filterTestAccounts": false,
      "trendsFilter": {
        "display": "ActionsLineGraph",
        "showLegend": true
      }
    }
  },
  "favorited": false
}
```

**Notes:**
- `math: "dau"` calculates daily active users
- `event: null` means counting across all events
- Date range is last 30 days

---

### Insight 2: Login Funnel

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/insights/`

**Payload:**
```json
{
  "name": "Login Funnel",
  "description": "Conversion from login to sending first message",
  "query": {
    "kind": "InsightVizNode",
    "source": {
      "kind": "FunnelsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "user_logged_in",
          "custom_name": "User Logged In"
        },
        {
          "kind": "EventsNode",
          "event": "message_sent",
          "custom_name": "Message Sent"
        }
      ],
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "properties": [],
      "filterTestAccounts": false,
      "funnelsFilter": {
        "funnelWindowInterval": 14,
        "funnelWindowIntervalUnit": "day",
        "layout": "horizontal"
      }
    }
  },
  "favorited": false
}
```

**Notes:**
- Tracks conversion from login to first message sent
- 14-day conversion window

---

### Insight 3: Messages Sent Per Day

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/insights/`

**Payload:**
```json
{
  "name": "Messages Sent Per Day",
  "description": "Total count of messages sent per day",
  "query": {
    "kind": "InsightVizNode",
    "source": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "message_sent",
          "custom_name": "Messages Sent",
          "math": "total"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "properties": [],
      "filterTestAccounts": false,
      "trendsFilter": {
        "display": "ActionsLineGraph",
        "showLegend": false
      }
    }
  },
  "favorited": false
}
```

**Notes:**
- `math: "total"` counts total events
- Shows daily trend of message volume

---

### Insight 4: Voice Recording Completion Rate

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/insights/`

**Payload:**
```json
{
  "name": "Voice Recording Completion Rate",
  "description": "Percentage of voice recordings that are completed vs cancelled",
  "query": {
    "kind": "InsightVizNode",
    "source": {
      "kind": "FunnelsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "voice_recording_started",
          "custom_name": "Recording Started"
        },
        {
          "kind": "EventsNode",
          "event": "voice_recording_completed",
          "custom_name": "Recording Completed"
        }
      ],
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "properties": [],
      "filterTestAccounts": false,
      "funnelsFilter": {
        "funnelWindowInterval": 1,
        "funnelWindowIntervalUnit": "hour",
        "layout": "horizontal"
      }
    }
  },
  "favorited": false
}
```

**Notes:**
- 1-hour conversion window (recordings should complete quickly)
- Shows completion rate funnel

---

### Insight 5: Channel Engagement

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/insights/`

**Payload:**
```json
{
  "name": "Channel Engagement",
  "description": "Channel switching activity broken down by channel",
  "query": {
    "kind": "InsightVizNode",
    "source": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "chat_channel_switched",
          "custom_name": "Channel Switches",
          "math": "total"
        }
      ],
      "interval": "day",
      "dateRange": {
        "date_from": "-30d",
        "date_to": null
      },
      "properties": [],
      "filterTestAccounts": false,
      "trendsFilter": {
        "display": "ActionsLineGraph",
        "showLegend": true
      },
      "breakdownFilter": {
        "breakdown_type": "event",
        "breakdown": "channel"
      }
    }
  },
  "favorited": false
}
```

**Notes:**
- Broken down by the `channel` property
- Shows which channels are most active

---

## Step 3: Add Insights to Dashboard

After creating each insight, you'll receive an `id` and `short_id` in the response. Use the `short_id` to add the insight to your dashboard.

**Endpoint:** `POST https://us.posthog.com/api/projects/238460/dashboards/{dashboard_id}/tiles/`

**Payload for each insight:**
```json
{
  "insight": "{insight_short_id}"
}
```

Replace `{dashboard_id}` with the dashboard ID from Step 1 and `{insight_short_id}` with each insight's short_id.

---

## Complete curl Script

Here's a bash script that creates everything (requires API key with write permissions):

```bash
#!/bin/bash

API_KEY="YOUR_API_KEY_HERE"
PROJECT_ID="238460"
BASE_URL="https://us.posthog.com/api/projects/${PROJECT_ID}"

# Step 1: Create Dashboard
echo "Creating dashboard..."
DASHBOARD_RESPONSE=$(curl -s -X POST "${BASE_URL}/dashboards/" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics basics",
    "description": "Core analytics dashboard for tracking user engagement, messaging activity, and key business metrics for the Jetchat Android app",
    "pinned": false
  }')

DASHBOARD_ID=$(echo $DASHBOARD_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "Dashboard created with ID: $DASHBOARD_ID"

# Step 2: Create Insights
echo "Creating Insight 1: Daily Active Users..."
INSIGHT1=$(curl -s -X POST "${BASE_URL}/insights/" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Active Users",
    "description": "Unique users triggering any event per day",
    "query": {
      "kind": "InsightVizNode",
      "source": {
        "kind": "TrendsQuery",
        "series": [{
          "kind": "EventsNode",
          "event": null,
          "custom_name": "Daily Active Users",
          "math": "dau"
        }],
        "interval": "day",
        "dateRange": {"date_from": "-30d", "date_to": null},
        "properties": [],
        "filterTestAccounts": false,
        "trendsFilter": {"display": "ActionsLineGraph", "showLegend": true}
      }
    },
    "favorited": false
  }')

INSIGHT1_SHORT_ID=$(echo $INSIGHT1 | python3 -c "import sys, json; print(json.load(sys.stdin)['short_id'])")
echo "Insight 1 created: $INSIGHT1_SHORT_ID"

# Add Insight 1 to Dashboard
curl -s -X POST "${BASE_URL}/dashboards/${DASHBOARD_ID}/tiles/" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"insight\": \"${INSIGHT1_SHORT_ID}\"}"

# Repeat for remaining insights (Insights 2-5)...
# [Additional insight creation commands would follow the same pattern]

echo "Done! Visit: https://us.posthog.com/project/${PROJECT_ID}/dashboard/${DASHBOARD_ID}"
```

---

## Dashboard URL

After creation, your dashboard will be available at:
```
https://us.posthog.com/project/238460/dashboard/{dashboard_id}
```

Replace `{dashboard_id}` with the ID returned from Step 1.

---

## Event Tracking Reference

The Jetchat app currently tracks these events:

1. **user_logged_in** - User logged in (property: username)
2. **user_logged_out** - User logged out
3. **message_sent** - Message sent (properties: channel, message_length)
4. **profile_viewed** - Profile screen viewed (property: user_id)
5. **chat_channel_switched** - User switched channels (property: channel)
6. **voice_recording_started** - Voice recording started
7. **voice_recording_completed** - Voice recording finished
8. **voice_recording_cancelled** - Voice recording cancelled
9. **emoji_selector_opened** - Emoji selector opened
10. **author_profile_clicked** - Clicked on user profile in conversation
11. **drawer_opened** - Navigation drawer opened

---

## Troubleshooting

**Error: "API key missing required scope 'dashboard:write'"**
- Your API key needs write permissions. Create a new Personal API Key in PostHog with the following scopes:
  - `dashboard:write`
  - `insight:write`
  - `query:read`

**Error: "Event not found"**
- Make sure the Jetchat app is sending events to PostHog
- Verify events exist by visiting: https://us.posthog.com/project/238460/events

**No data showing in insights**
- Check that the date range includes periods when events were sent
- Verify test account filtering isn't excluding your data
- Ensure events have been ingested (there may be a small delay)

# PostHog Dashboard Solution for Jetchat Android App

## Summary

This document provides the complete solution for creating a PostHog dashboard with insights for the Jetchat Android chat application. Due to API scope limitations with Personal API keys, the solution is documented with complete query structures that can be used with proper authentication.

## Dashboard Structure

**Dashboard Name:** Analytics basics
**Description:** Key business metrics for the Jetchat Android app: user authentication, messaging, and engagement.

## Insights Configuration

### Insight 1: Daily Active Users (Login Rate)

**Type:** Trend Query
**Description:** Trend of user_logged_in events over time

**Query Structure:**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "event": "user_logged_in",
        "custom_name": "User Logged In",
        "math": "total"
      }
    ],
    "dateRange": {
      "date_from": "-30d",
      "date_to": null
    },
    "interval": "day",
    "properties": [],
    "filterTestAccounts": false
  }
}
```

---

### Insight 2: Message Sending Volume

**Type:** Trend Query
**Description:** Trend of message_sent events over time

**Query Structure:**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "event": "message_sent",
        "custom_name": "Message Sent",
        "math": "total"
      }
    ],
    "dateRange": {
      "date_from": "-30d",
      "date_to": null
    },
    "interval": "day",
    "properties": [],
    "filterTestAccounts": false
  }
}
```

---

### Insight 3: Login to Message Conversion Funnel

**Type:** Funnel Query
**Description:** Funnel from user_logged_in -> message_sent

**Query Structure:**
```json
{
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
      "layout": "vertical",
      "breakdownAttributionType": "first_touch",
      "funnelOrderType": "ordered",
      "funnelVizType": "steps",
      "funnelWindowInterval": 14,
      "funnelWindowIntervalUnit": "day",
      "funnelStepReference": "total"
    }
  }
}
```

---

### Insight 4: User Churn Signal (Logout Rate)

**Type:** Trend Query
**Description:** Trend of user_logged_out events over time

**Query Structure:**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "event": "user_logged_out",
        "custom_name": "User Logged Out",
        "math": "total"
      }
    ],
    "dateRange": {
      "date_from": "-30d",
      "date_to": null
    },
    "interval": "day",
    "properties": [],
    "filterTestAccounts": false
  }
}
```

---

###  Insight 5: Feature Engagement: Profile Views vs Drawer Opens

**Type:** Trend Query (Multiple Events)
**Description:** Trend comparing profile_viewed and drawer_opened events

**Query Structure:**
```json
{
  "kind": "InsightVizNode",
  "source": {
    "kind": "TrendsQuery",
    "series": [
      {
        "kind": "EventsNode",
        "event": "profile_viewed",
        "custom_name": "Profile Viewed",
        "math": "total"
      },
      {
        "kind": "EventsNode",
        "event": "drawer_opened",
        "custom_name": "Drawer Opened",
        "math": "total"
      }
    ],
    "dateRange": {
      "date_from": "-30d",
      "date_to": null
    },
    "interval": "day",
    "properties": [],
    "filterTestAccounts": false
  }
}
```

---

## Implementation Methods

### Method 1: Using PostHog MCP Server Tools

The PostHog MCP server provides tools for creating dashboards and insights programmatically:

**Required Tools:**
- `dashboard-create` - Create a new dashboard
- `insight-create-from-query` - Create insights from query objects
- `add-insight-to-dashboard` - Add created insights to the dashboard

**Authentication:**
Use the MCP Server preset API key which includes the necessary `dashboard:write` and `insight:write` scopes.

### Method 2: Manual Creation via PostHog UI

1. Navigate to PostHog dashboard at https://us.posthog.com/project/{project_id}/dashboards
2. Click "New Dashboard"
3. Name it "Analytics basics" with the description provided
4. For each insight:
   - Click "New Insight"
   - Select the appropriate query type (Trends or Funnels)
   - Use the SQL editor or visual builder with the query structures above
   - Save the insight
   - Add it to the dashboard

### Method 3: Using PostHog API with Proper Scopes

**Prerequisites:**
- API Key with `dashboard:write` and `insight:write` scopes
- Project ID

**Endpoints:**
```
POST /api/projects/{project_id}/dashboards/
POST /api/projects/{project_id}/insights/
PATCH /api/projects/{project_id}/dashboards/{dashboard_id}/
```

## Event Tracking Requirements

For these insights to work, ensure the Jetchat Android app is tracking these events:

1. **user_logged_in** - Fired when a user successfully logs in
2. **user_logged_out** - Fired when a user logs out via the drawer menu
3. **message_sent** - Fired when a user sends a chat message
4. **profile_viewed** - Fired when navigating to another user's profile
5. **drawer_opened** - Fired when the navigation drawer is opened

## Expected Dashboard URL Format

```
https://us.posthog.com/project/{project_id}/dashboard/{dashboard_id}
```

## Expected Insight URL Format

```
https://us.posthog.com/project/{project_id}/insights/{insight_short_id}
```

## Notes

- All insights use a 30-day rolling window (`date_from: "-30d"`)
- Daily interval is used for trend queries
- The funnel has a 14-day conversion window
- Test accounts are not filtered in these queries (set `filterTestAccounts: true` if needed)

## References

- [PostHog Model Context Protocol Documentation](https://posthog.com/docs/model-context-protocol)
- [PostHog MCP GitHub Repository](https://github.com/PostHog/mcp)
- [PostHog API Documentation](https://posthog.com/docs/api)
- [HogQL Query Documentation](https://posthog.com/docs/hogql)

---

## Technical Implementation Details

### API Scope Issue

The current Personal API key (`POSTHOG_PERSONAL_API_KEY`) is missing required scopes:
- `dashboard:write` - Required for creating dashboards
- `insight:write` - Required for creating insights

### Solution

To implement this programmatically, use one of the following approaches:

1. **Create a new API key** with the MCP Server preset at: https://us.posthog.com/settings/user-api-keys
2. **Use the MCP Server** at https://mcp.posthog.com/sse which handles authentication internally
3. **Manually create** through the PostHog UI using the query structures provided above

The Python script `create_posthog_dashboard.py` in this directory contains the complete implementation logic and can be used once proper API credentials are configured.

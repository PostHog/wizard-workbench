# PostHog Dashboard Setup for Nuxt Movies

This guide provides complete instructions and JSON configurations to create an "Analytics basics" dashboard with 5 key insights for the Nuxt Movies application.

## Dashboard Configuration

**Name:** Analytics basics
**Description:** Core analytics for Nuxt Movies: user authentication, content engagement, and search behavior
**Project ID:** 2
**PostHog Instance:** https://us.posthog.com

## Quick Links

- **Dashboard List:** https://us.posthog.com/project/2/dashboard
- **Create New Dashboard:** https://us.posthog.com/project/2/dashboard (click "New Dashboard")
- **Create New Insight:** https://us.posthog.com/project/2/insights/new

## Instrumented Events

The Nuxt Movies app tracks these events:
- `user_logged_in` - User successfully logs in (client-side)
- `login_failed` - Login attempt fails (client-side)
- `user_logged_out` - User logs out (client-side)
- `media_viewed` - User views a movie/TV show detail page (properties: media_type, media_id, media_title)
- `search_performed` - User performs a search (properties: search_query, result_count)
- `person_viewed` - User views a person page (properties: person_id, person_name)
- `error_displayed` - Global error page shown (properties: status_code, error_message, is_404)
- `server_user_logged_in` - Server-side login event

## Insights to Create

### 1. Login to First Media View Funnel

**Type:** Funnel
**Description:** Conversion funnel showing users who log in and then view media content

**Configuration:**
- **Insight Type:** Funnel
- **Step 1:** Event = `user_logged_in`
- **Step 2:** Event = `media_viewed`
- **Conversion Window:** 1 day
- **Date Range:** Last 30 days

**Query JSON:**
```json
{
  "kind": "FunnelsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "user_logged_in",
      "name": "User Logged In"
    },
    {
      "kind": "EventsNode",
      "event": "media_viewed",
      "name": "Media Viewed"
    }
  ],
  "funnelsFilter": {
    "funnelWindowInterval": 1,
    "funnelWindowIntervalUnit": "day"
  },
  "dateRange": {
    "date_from": "-30d"
  }
}
```

**Steps to Create:**
1. Go to https://us.posthog.com/project/2/insights/new
2. Select "Funnel" as insight type
3. Add first step: Select event `user_logged_in`
4. Add second step: Select event `media_viewed`
5. Set conversion window to 1 day
6. Save as "Login to First Media View Funnel"
7. Add to "Analytics basics" dashboard

---

### 2. Daily Active Users

**Type:** Trends
**Description:** Unique users logging in each day

**Configuration:**
- **Insight Type:** Trends
- **Event:** `user_logged_in`
- **Math:** Unique users (DAU)
- **Interval:** Day
- **Date Range:** Last 30 days

**Query JSON:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "user_logged_in",
      "name": "User Logged In",
      "math": "dau"
    }
  ],
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

**Steps to Create:**
1. Go to https://us.posthog.com/project/2/insights/new
2. Select "Trends" as insight type
3. Add series: Select event `user_logged_in`
4. Change "Count of events" to "Unique users"
5. Set interval to "Day"
6. Save as "Daily Active Users"
7. Add to "Analytics basics" dashboard

---

### 3. Top Search Queries

**Type:** Trends (Table View)
**Description:** Most popular search queries performed by users

**Configuration:**
- **Insight Type:** Trends
- **Event:** `search_performed`
- **Breakdown:** By property `search_query`
- **Display:** Table
- **Date Range:** Last 30 days

**Query JSON:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "search_performed",
      "name": "Search Performed",
      "math": "total"
    }
  ],
  "breakdownFilter": {
    "breakdown": "search_query",
    "breakdown_type": "event"
  },
  "trendsFilter": {
    "display": "ActionsTable"
  },
  "dateRange": {
    "date_from": "-30d"
  }
}
```

**Steps to Create:**
1. Go to https://us.posthog.com/project/2/insights/new
2. Select "Trends" as insight type
3. Add series: Select event `search_performed`
4. Click "Add breakdown" → "Event property" → Select `search_query`
5. Change chart display to "Table"
6. Save as "Top Search Queries"
7. Add to "Analytics basics" dashboard

---

### 4. Media Views by Type

**Type:** Trends
**Description:** Trend of media views broken down by media type (movie vs TV show)

**Configuration:**
- **Insight Type:** Trends
- **Event:** `media_viewed`
- **Breakdown:** By property `media_type`
- **Interval:** Day
- **Date Range:** Last 30 days

**Query JSON:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "media_viewed",
      "name": "Media Viewed",
      "math": "total"
    }
  ],
  "breakdownFilter": {
    "breakdown": "media_type",
    "breakdown_type": "event"
  },
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

**Steps to Create:**
1. Go to https://us.posthog.com/project/2/insights/new
2. Select "Trends" as insight type
3. Add series: Select event `media_viewed`
4. Click "Add breakdown" → "Event property" → Select `media_type`
5. Set interval to "Day"
6. Save as "Media Views by Type"
7. Add to "Analytics basics" dashboard

---

### 5. Error Rate Trend

**Type:** Trends
**Description:** Daily trend of error page displays

**Configuration:**
- **Insight Type:** Trends
- **Event:** `error_displayed`
- **Interval:** Day
- **Date Range:** Last 30 days

**Query JSON:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "error_displayed",
      "name": "Error Displayed",
      "math": "total"
    }
  ],
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

**Steps to Create:**
1. Go to https://us.posthog.com/project/2/insights/new
2. Select "Trends" as insight type
3. Add series: Select event `error_displayed`
4. Set interval to "Day"
5. Save as "Error Rate Trend"
6. Add to "Analytics basics" dashboard

---

## Complete Setup Instructions

### Step 1: Create the Dashboard

1. Navigate to https://us.posthog.com/project/2/dashboard
2. Click the "New Dashboard" button
3. Enter:
   - **Name:** Analytics basics
   - **Description:** Core analytics for Nuxt Movies: user authentication, content engagement, and search behavior
4. Optionally pin the dashboard for easy access
5. Click "Create"

### Step 2: Create Each Insight

Follow the steps above for each of the 5 insights. After creating each insight:
1. Click "Save" or "Save & add to dashboard"
2. Select the "Analytics basics" dashboard
3. Choose a position on the dashboard

### Step 3: Arrange Dashboard

1. Return to https://us.posthog.com/project/2/dashboard
2. Open the "Analytics basics" dashboard
3. Drag and arrange the insights as desired
4. Resize tiles for optimal viewing

## Expected Dashboard URLs

After creation, your dashboard and insights will be accessible at:

- **Dashboard:** https://us.posthog.com/project/2/dashboard/[DASHBOARD_ID]
- **Insight 1:** https://us.posthog.com/project/2/insights/[INSIGHT_ID_1]
- **Insight 2:** https://us.posthog.com/project/2/insights/[INSIGHT_ID_2]
- **Insight 3:** https://us.posthog.com/project/2/insights/[INSIGHT_ID_3]
- **Insight 4:** https://us.posthog.com/project/2/insights/[INSIGHT_ID_4]
- **Insight 5:** https://us.posthog.com/project/2/insights/[INSIGHT_ID_5]

(The actual IDs will be assigned by PostHog upon creation)

## Additional Analytics Ideas

Consider adding these insights in the future:
- Login failure rate (login_failed events over time)
- Most viewed actors/directors (person_viewed events by person_name)
- Error breakdown by status code (error_displayed broken down by status_code)
- Search success rate (search_performed with result_count > 0)
- User engagement funnel (user_logged_in → search_performed → media_viewed)

## Troubleshooting

- **Events not showing up:** Ensure the app is running and generating events. Check the Events page in PostHog.
- **Breakdowns not available:** Verify that the event properties are being sent correctly. Check a sample event in the Events explorer.
- **API limitations:** The current API key has limited permissions and cannot programmatically create dashboards. Manual creation through the UI is required.

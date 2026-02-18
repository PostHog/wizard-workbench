# PostHog Dashboard Setup Guide: Analytics Basics

This guide explains how to create a PostHog dashboard with insights for the Acme AI SaaS application.

## Prerequisites

### Create a Personal API Key with Required Scopes

The current personal API key doesn't have the required `dashboard:write` and `insight:write` scopes. You need to:

1. Go to your PostHog account settings: https://us.posthog.com/settings/user-api-keys
2. Click "+ Create a personal API Key"
3. Give it a label: "Dashboard & Insight Creation"
4. Select the following scopes:
   - `dashboard:write`
   - `insight:write`
5. Click "Create key"
6. **Immediately copy the key value** (you'll only see it once)
7. Update the `POSTHOG_PERSONAL_API_KEY` environment variable

## Dashboard Details

**Name:** Analytics basics
**Description:** Core analytics dashboard for Acme AI SaaS - tracking user signups, content generation, API key usage, and credit consumption

**Project ID:** 238460
**PostHog Host:** https://us.posthog.com

## Insights to Create

### 1. Signup to First Generation Funnel
**Type:** Funnel (FunnelsQuery)
**Description:** Tracking conversion from user signup to first content generation

**Events:**
- user_signed_up
- content_generated

**Query Structure:**
```json
{
  "kind": "FunnelsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "user_signed_up",
      "name": "user_signed_up"
    },
    {
      "kind": "EventsNode",
      "event": "content_generated",
      "name": "content_generated"
    }
  ],
  "funnelsFilter": {
    "funnelWindowIntervalUnit": "day",
    "funnelWindowInterval": 14
  }
}
```

### 2. Daily Content Generation Trend
**Type:** Trends (TrendsQuery)
**Description:** Content generation events over time, broken down by generation type

**Events:**
- content_generated

**Breakdown:** generation_type (event property)
**Display:** ActionsLineGraph

**Query Structure:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "content_generated",
      "name": "content_generated"
    }
  ],
  "trendsFilter": {
    "display": "ActionsLineGraph"
  },
  "breakdownFilter": {
    "breakdown": "generation_type",
    "breakdown_type": "event"
  },
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

### 3. User Auth Trend
**Type:** Trends (TrendsQuery)
**Description:** User login and signup trends over the last 30 days

**Events:**
- user_logged_in
- user_signed_up

**Display:** ActionsLineGraph

**Query Structure:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "user_logged_in",
      "name": "user_logged_in"
    },
    {
      "kind": "EventsNode",
      "event": "user_signed_up",
      "name": "user_signed_up"
    }
  ],
  "trendsFilter": {
    "display": "ActionsLineGraph"
  },
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

### 4. Insufficient Credits (Churn Signal)
**Type:** Trends (TrendsQuery)
**Description:** Tracking insufficient credits events - potential upgrade triggers

**Events:**
- insufficient_credits

**Display:** ActionsLineGraph

**Query Structure:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "insufficient_credits",
      "name": "insufficient_credits"
    }
  ],
  "trendsFilter": {
    "display": "ActionsLineGraph"
  },
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

### 5. API Adoption
**Type:** Trends (TrendsQuery)
**Description:** API key creation and revocation trends

**Events:**
- api_key_created
- api_key_revoked

**Display:** ActionsBar

**Query Structure:**
```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "api_key_created",
      "name": "api_key_created"
    },
    {
      "kind": "EventsNode",
      "event": "api_key_revoked",
      "name": "api_key_revoked"
    }
  ],
  "trendsFilter": {
    "display": "ActionsBar"
  },
  "interval": "day",
  "dateRange": {
    "date_from": "-30d"
  }
}
```

## Automated Setup Script

A Python script (`create_posthog_dashboard.py`) has been created to automate this process.

### Usage:

1. First, create a Personal API Key with the required scopes (see Prerequisites above)

2. Update the environment variable:
   ```bash
   export POSTHOG_PERSONAL_API_KEY="your_new_key_here"
   ```

3. Run the script:
   ```bash
   python create_posthog_dashboard.py
   ```

The script will:
- Create the "Analytics basics" dashboard
- Create all 5 insights
- Link each insight to the dashboard
- Output the dashboard and insight URLs

## Manual API Calls

If you prefer to create the dashboard and insights manually via curl:

### 1. Create Dashboard
```bash
curl -X POST "https://us.posthog.com/api/projects/238460/dashboards/" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics basics",
    "description": "Core analytics dashboard for Acme AI SaaS - tracking user signups, content generation, API key usage, and credit consumption"
  }'
```

### 2. Create Insights
For each insight, use:
```bash
curl -X POST "https://us.posthog.com/api/projects/238460/insights/" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "INSIGHT_NAME",
    "description": "INSIGHT_DESCRIPTION",
    "query": {QUERY_JSON},
    "dashboards": [DASHBOARD_ID]
  }'
```

Replace:
- `YOUR_API_KEY` with your properly scoped personal API key
- `INSIGHT_NAME` with the insight name
- `INSIGHT_DESCRIPTION` with the insight description
- `{QUERY_JSON}` with the query structure from above
- `DASHBOARD_ID` with the ID returned from step 1

## Expected Events

The dashboard expects the following custom events to be tracked in your Acme AI SaaS application:

- `user_signed_up` - When a new user creates an account
- `user_logged_in` - When a user logs in (already exists in your app)
- `content_generated` - When AI content is generated
  - Property: `generation_type` - The type of content generated
- `insufficient_credits` - When a user tries to generate content but doesn't have enough credits
- `api_key_created` - When a user creates a new API key
- `api_key_revoked` - When a user revokes an API key

## Resources

- [PostHog Personal API Keys Documentation](https://github.com/PostHog/posthog.com/blob/master/contents/docs/integrate/_snippets/obtain-personal-api-key.mdx)
- [PostHog API Documentation](https://posthog.com/docs/api)
- PostHog Project Dashboard URL: https://us.posthog.com/project/238460/dashboard/

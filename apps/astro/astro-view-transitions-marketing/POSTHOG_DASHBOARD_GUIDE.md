# NeuralFlow AI Marketing Dashboard Guide

This guide provides complete instructions for creating a PostHog analytics dashboard for the NeuralFlow AI marketing site.

## Overview

The dashboard tracks core marketing metrics across:
- **Conversion funnel** (Features → Pricing → CTA)
- **CTA engagement** by location
- **Pricing plan** selection breakdown
- **Documentation** section engagement
- **Daily traffic** trends

## Prerequisites

### 1. PostHog Personal API Key

You need a Personal API Key with the following scopes:
- `dashboard:write` - Required to create dashboards
- `insight:write` - Required to create insights

**How to create an API key:**

1. Log in to your PostHog account
2. Navigate to **Settings** → **Personal API Keys**
3. Click **+ Create a personal API Key**
4. Give it a name (e.g., "NeuralFlow Dashboard Creator")
5. Select the required scopes: `dashboard:write` and `insight:write`
6. Click **Create**
7. **Copy the API key immediately** (you won't see it again!)

### 2. PostHog Project ID

Find your project ID by:
1. Navigating to your PostHog project
2. Looking at the URL: `https://us.posthog.com/project/{PROJECT_ID}/...`
3. Or making an API call: `curl -H "Authorization: Bearer YOUR_API_KEY" https://us.posthog.com/api/projects/`

## Instrumented Events

The dashboard assumes these events are already instrumented in your marketing site:

| Event Name | Description | Properties |
|------------|-------------|------------|
| `cta_clicked` | Hero CTA "Start Free Trial" click | `location`, `label` |
| `docs_cta_clicked` | Hero "Read the Docs" click | `location`, `label` |
| `pricing_plan_selected` | Pricing plan button click | `plan` (starter/pro), `price_monthly`, `label` |
| `contact_sales_clicked` | Enterprise "Contact Sales" click | `plan` |
| `nav_get_started_clicked` | Nav "Get Started" CTA click | `location` |
| `docs_section_clicked` | Docs section card click | `section`, `label` |
| `features_viewed` | Features page view | - |
| `pricing_viewed` | Pricing page view | - |
| `$pageview` | Standard pageview event | (auto-captured by PostHog) |

## Usage

### Option 1: Python Script (Recommended)

The Python script provides better error handling and is more readable.

```bash
# Install dependencies (if needed)
pip install requests

# Set environment variables
export POSTHOG_API_KEY="phx_your_api_key_here"
export POSTHOG_PROJECT_ID="your_project_id"

# Run the script
python3 create_neuralflow_dashboard.py
```

### Option 2: Bash Script

The bash script uses curl and requires `jq` for JSON parsing.

```bash
# Install jq if needed
sudo apt-get install jq  # Debian/Ubuntu
brew install jq          # macOS

# Set environment variables
export POSTHOG_API_KEY="phx_your_api_key_here"
export POSTHOG_PROJECT_ID="your_project_id"

# Make script executable and run
chmod +x create_neuralflow_dashboard.sh
./create_neuralflow_dashboard.sh
```

## Dashboard Structure

### Dashboard: "Analytics basics"

**Description:** Core analytics dashboard for NeuralFlow AI - tracking CTAs, pricing funnel, feature discovery, and docs engagement

**Insights:**

#### 1. Conversion Funnel: Features → Pricing → CTA
- **Type:** Funnel
- **Purpose:** Track top-of-funnel progression
- **Steps:**
  1. `features_viewed` - Features page view
  2. `pricing_viewed` - Pricing page view
  3. `cta_clicked` OR `pricing_plan_selected` - Conversion action
- **Window:** 14 days

#### 2. CTA Clicks by Location
- **Type:** Trends (Line chart)
- **Purpose:** Compare CTA engagement across different locations
- **Events:**
  - `cta_clicked` - Hero CTA
  - `nav_get_started_clicked` - Navigation CTA
  - `docs_cta_clicked` - Documentation CTA
- **Date Range:** Last 30 days

#### 3. Pricing Plan Selection Breakdown
- **Type:** Trends with breakdown
- **Purpose:** Identify which pricing tier is most popular
- **Event:** `pricing_plan_selected`
- **Breakdown:** By `plan` property (starter/pro)
- **Date Range:** Last 30 days

#### 4. Docs Section Engagement
- **Type:** Trends with breakdown
- **Purpose:** Identify which documentation sections are most valuable
- **Event:** `docs_section_clicked`
- **Breakdown:** By `section` property
- **Date Range:** Last 30 days

#### 5. Daily Active Visitors (Pageviews)
- **Type:** Trends (Line chart)
- **Purpose:** Monitor overall traffic trends
- **Event:** `$pageview`
- **Date Range:** Last 30 days

## API Reference

### Create Dashboard

```bash
POST /api/projects/{project_id}/dashboards/

Headers:
  Authorization: Bearer {api_key}
  Content-Type: application/json

Body:
{
  "name": "Analytics basics",
  "description": "Core analytics dashboard...",
  "pinned": true
}
```

### Create Insight

```bash
POST /api/projects/{project_id}/insights/

Headers:
  Authorization: Bearer {api_key}
  Content-Type: application/json

Body:
{
  "name": "Insight Name",
  "description": "Insight description",
  "query": {
    "kind": "TrendsQuery" | "FunnelsQuery",
    "series": [...],
    ...
  },
  "dashboards": [dashboard_id]
}
```

## Query Formats

### Trends Query Example

```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "event_name",
      "name": "Display Name"
    }
  ],
  "interval": "day",
  "trendsFilter": {
    "display": "ActionsLineGraph"
  },
  "dateRange": {
    "date_from": "-30d"
  }
}
```

### Funnel Query Example

```json
{
  "kind": "FunnelsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "step1_event",
      "name": "Step 1"
    },
    {
      "kind": "EventsNode",
      "event": "step2_event",
      "name": "Step 2"
    }
  ],
  "funnelsFilter": {
    "funnelWindowInterval": 14,
    "funnelWindowIntervalUnit": "day"
  }
}
```

### Breakdown Query Example

```json
{
  "kind": "TrendsQuery",
  "series": [
    {
      "kind": "EventsNode",
      "event": "event_name",
      "name": "Display Name"
    }
  ],
  "breakdownFilter": {
    "breakdown": "property_name",
    "breakdown_type": "event"
  },
  "interval": "day",
  "trendsFilter": {
    "display": "ActionsLineGraph"
  },
  "dateRange": {
    "date_from": "-30d"
  }
}
```

## Troubleshooting

### Error: "API key missing required scope"

**Problem:** Your API key doesn't have the necessary permissions.

**Solution:**
1. Go to PostHog Settings → Personal API Keys
2. Create a new key with `dashboard:write` and `insight:write` scopes
3. Update your `POSTHOG_API_KEY` environment variable

### Error: "Authentication credentials were not provided"

**Problem:** The API key is not being sent correctly.

**Solution:**
- Verify the API key is set: `echo $POSTHOG_API_KEY`
- Ensure it starts with `phx_`
- Check that the Authorization header format is: `Bearer {api_key}`

### Error: "Project not found"

**Problem:** Invalid project ID.

**Solution:**
1. Verify your project ID is correct
2. Check that your API key has access to the project
3. List available projects: `curl -H "Authorization: Bearer $POSTHOG_API_KEY" https://us.posthog.com/api/projects/`

### Insights not showing data

**Problem:** Events haven't been captured yet or event names don't match.

**Solution:**
1. Verify events are being captured: Go to PostHog → Events
2. Check event names match exactly (case-sensitive)
3. Ensure event properties exist (for breakdown insights)
4. Wait a few minutes for data to process

## Next Steps

After creating the dashboard:

1. **Customize layouts:** Drag and resize insight tiles in the dashboard
2. **Add descriptions:** Add context to each insight for team members
3. **Set up alerts:** Configure alerts for important metrics
4. **Create subscriptions:** Schedule email reports for stakeholders
5. **Add filters:** Apply dashboard-wide filters (e.g., by traffic source)
6. **Share:** Generate a shareable link for external stakeholders

## Resources

- [PostHog API Documentation](https://posthog.com/docs/api)
- [PostHog Query Types](https://posthog.com/docs/product-analytics/query-types)
- [Personal API Keys Guide](https://posthog.com/docs/api/overview#personal-api-keys)
- [Dashboard Features](https://posthog.com/docs/product-analytics/dashboards)

## Support

For issues or questions:
- PostHog Community: https://posthog.com/questions
- PostHog Docs: https://posthog.com/docs
- GitHub Issues: https://github.com/PostHog/posthog/issues

# NeuralFlow AI PostHog Dashboard - Creation Summary

## Overview

I've created a complete implementation guide and automation scripts for creating a PostHog analytics dashboard for the NeuralFlow AI marketing site. While I couldn't create the dashboard directly due to API key permission limitations (the available key lacks `dashboard:write` and `insight:write` scopes), I've provided everything needed to create it with proper credentials.

## What Was Created

### 1. Python Script (`create_neuralflow_dashboard.py`)
- **Recommended approach** - Clean, readable, with error handling
- Automatically creates dashboard and all 5 insights
- Provides progress feedback and URLs for created resources
- Requires: Python 3, `requests` library

### 2. Bash Script (`create_neuralflow_dashboard.sh`)
- Alternative approach using curl
- Same functionality as Python script
- Requires: `bash`, `curl`, `jq`

### 3. Comprehensive Guide (`POSTHOG_DASHBOARD_GUIDE.md`)
- Complete documentation with prerequisites
- Event schema reference
- Dashboard structure details
- API reference and query formats
- Troubleshooting guide
- Next steps after creation

### 4. API Payloads (`api_payloads.json`)
- Raw JSON payloads for each API call
- Curl command examples
- Useful for manual testing or integration into other tools

## Dashboard Structure

### Dashboard: "Analytics basics"
**Purpose:** Core analytics dashboard for NeuralFlow AI marketing site

**5 Insights Included:**

1. **Conversion Funnel: Features → Pricing → CTA**
   - Type: Funnel (3 steps)
   - Tracks: `features_viewed` → `pricing_viewed` → (`cta_clicked` OR `pricing_plan_selected`)
   - Window: 14 days
   - **Purpose:** Understand top-of-funnel conversion rates

2. **CTA Clicks by Location**
   - Type: Trends (multi-series line chart)
   - Tracks: `cta_clicked`, `nav_get_started_clicked`, `docs_cta_clicked`
   - **Purpose:** Compare engagement across different CTA locations

3. **Pricing Plan Selection Breakdown**
   - Type: Trends with breakdown by `plan` property
   - Tracks: `pricing_plan_selected` broken down by plan (starter/pro)
   - **Purpose:** Identify which pricing tier is most popular

4. **Docs Section Engagement**
   - Type: Trends with breakdown by `section` property
   - Tracks: `docs_section_clicked` broken down by section
   - **Purpose:** Identify which documentation sections are most valuable

5. **Daily Active Visitors (Pageviews)**
   - Type: Trends (line chart)
   - Tracks: `$pageview` (standard PostHog event)
   - **Purpose:** Monitor overall traffic trends

## Required Events

The dashboard assumes these events are instrumented:

| Event | Description | Key Properties |
|-------|-------------|----------------|
| `cta_clicked` | Hero CTA click | `location`, `label` |
| `docs_cta_clicked` | Docs CTA click | `location`, `label` |
| `pricing_plan_selected` | Pricing plan selection | `plan`, `price_monthly`, `label` |
| `contact_sales_clicked` | Enterprise contact | `plan` |
| `nav_get_started_clicked` | Nav CTA click | `location` |
| `docs_section_clicked` | Docs section click | `section`, `label` |
| `features_viewed` | Features page view | - |
| `pricing_viewed` | Pricing page view | - |
| `$pageview` | Page view (auto-tracked) | - |

## How to Use

### Quick Start

```bash
# 1. Create PostHog Personal API Key with required scopes:
#    - dashboard:write
#    - insight:write
#    Visit: https://us.posthog.com/settings/user-api-keys

# 2. Set environment variables
export POSTHOG_API_KEY="phx_your_api_key_here"
export POSTHOG_PROJECT_ID="your_project_id"

# 3. Run Python script (recommended)
python3 create_neuralflow_dashboard.py

# OR run Bash script
./create_neuralflow_dashboard.sh
```

### Expected Output

```
==================================================
NeuralFlow AI Dashboard Creation
==================================================
Project ID: 19618
PostHog Host: https://us.posthog.com

Creating dashboard "Analytics basics"...
✓ Dashboard created successfully!
  Dashboard ID: 12345
  Dashboard URL: https://us.posthog.com/project/19618/dashboard/12345

Creating Insight 1: Conversion Funnel...
✓ Insight 1 created successfully!
  Insight ID: 67890
  Insight URL: https://us.posthog.com/project/19618/insights/67890

[... continues for all 5 insights ...]

==================================================
Dashboard Creation Complete!
==================================================

Dashboard URL:
  https://us.posthog.com/project/19618/dashboard/12345

Insights Created (5/5):
  1. Conversion Funnel: Features → Pricing → CTA: https://...
  2. CTA Clicks by Location: https://...
  3. Pricing Plan Selection Breakdown: https://...
  4. Docs Section Engagement: https://...
  5. Daily Active Visitors (Pageviews): https://...
```

## Why Direct Creation Wasn't Possible

The PostHog MCP server API key available in this environment (`POSTHOG_PERSONAL_API_KEY`) has read-only permissions. The error encountered was:

```
"API key missing required scope 'dashboard:write'"
"API key missing required scope 'insight:write'"
```

**Solution:** Create a new Personal API Key with the required write scopes from your PostHog account settings, then run the provided scripts.

## Files Created

All files are located in: `/home/runner/work/wizard-workbench/wizard-workbench/apps/astro/astro-view-transitions-marketing/`

1. `create_neuralflow_dashboard.py` - Python automation script
2. `create_neuralflow_dashboard.sh` - Bash automation script
3. `POSTHOG_DASHBOARD_GUIDE.md` - Comprehensive documentation
4. `api_payloads.json` - Raw API payloads for reference
5. `DASHBOARD_CREATION_SUMMARY.md` - This summary document

## Next Steps

1. **Create API Key:**
   - Go to PostHog → Settings → Personal API Keys
   - Create key with `dashboard:write` and `insight:write` scopes

2. **Run Script:**
   - Export the API key and project ID as environment variables
   - Run either the Python or Bash script

3. **Verify Dashboard:**
   - Visit the dashboard URL provided in the output
   - Ensure all 5 insights are visible
   - Wait a few minutes for data to populate (if events are being captured)

4. **Customize:**
   - Rearrange insight tiles by dragging
   - Adjust date ranges as needed
   - Add dashboard-wide filters
   - Set up alerts for key metrics

5. **Share:**
   - Generate shareable link for stakeholders
   - Set up email subscriptions for regular reports

## API Reference Summary

### Create Dashboard
```bash
POST /api/projects/{project_id}/dashboards/
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "name": "Dashboard Name",
  "description": "Description",
  "pinned": true
}
```

### Create Insight
```bash
POST /api/projects/{project_id}/insights/
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "name": "Insight Name",
  "description": "Description",
  "query": { ... },
  "dashboards": [dashboard_id]
}
```

## Troubleshooting

### Authentication Errors
- Verify API key has correct scopes: `dashboard:write`, `insight:write`
- Check API key format starts with `phx_`
- Ensure project ID is correct

### No Data in Insights
- Verify events are being captured in PostHog Events tab
- Check event names match exactly (case-sensitive)
- Ensure event properties exist for breakdown insights
- Allow a few minutes for data processing

### Script Errors
- Python: Ensure `requests` library is installed (`pip install requests`)
- Bash: Ensure `jq` is installed (`apt-get install jq` or `brew install jq`)

## Resources

- **PostHog API Docs:** https://posthog.com/docs/api
- **Personal API Keys:** https://posthog.com/docs/api/overview#personal-api-keys
- **Dashboard Features:** https://posthog.com/docs/product-analytics/dashboards
- **Query Types:** https://posthog.com/docs/product-analytics/query-types

## Support

For questions or issues:
- PostHog Community: https://posthog.com/questions
- PostHog Slack: https://posthog.com/slack
- GitHub Issues: https://github.com/PostHog/posthog/issues

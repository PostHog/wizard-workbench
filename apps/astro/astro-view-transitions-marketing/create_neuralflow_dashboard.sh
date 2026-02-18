#!/bin/bash

# NeuralFlow AI Marketing Dashboard & Insights Creation Script
# This script creates a PostHog dashboard with 5 insights for tracking marketing performance
#
# Prerequisites:
# 1. PostHog Personal API Key with scopes: dashboard:write, insight:write
# 2. Project ID for the PostHog project
#
# Usage:
#   export POSTHOG_API_KEY="your_personal_api_key_with_write_scopes"
#   export POSTHOG_PROJECT_ID="your_project_id"
#   ./create_neuralflow_dashboard.sh

set -e

# Configuration
POSTHOG_API_KEY="${POSTHOG_API_KEY:-}"
POSTHOG_PROJECT_ID="${POSTHOG_PROJECT_ID:-19618}"
POSTHOG_HOST="${POSTHOG_HOST:-https://us.posthog.com}"

if [ -z "$POSTHOG_API_KEY" ]; then
    echo "Error: POSTHOG_API_KEY environment variable is required"
    echo "Please create a Personal API Key with dashboard:write and insight:write scopes"
    echo "Visit: https://us.posthog.com/settings/user-api-keys"
    exit 1
fi

echo "Creating NeuralFlow AI Analytics Dashboard..."
echo "Project ID: $POSTHOG_PROJECT_ID"
echo "PostHog Host: $POSTHOG_HOST"
echo ""

# Step 1: Create Dashboard
echo "Step 1: Creating dashboard 'Analytics basics'..."
DASHBOARD_RESPONSE=$(curl -s -X POST "${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/dashboards/" \
  -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics basics",
    "description": "Core analytics dashboard for NeuralFlow AI - tracking CTAs, pricing funnel, feature discovery, and docs engagement",
    "pinned": true
  }')

DASHBOARD_ID=$(echo "$DASHBOARD_RESPONSE" | jq -r '.id')
DASHBOARD_URL="${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}/dashboard/${DASHBOARD_ID}"

if [ "$DASHBOARD_ID" = "null" ] || [ -z "$DASHBOARD_ID" ]; then
    echo "Error creating dashboard:"
    echo "$DASHBOARD_RESPONSE" | jq '.'
    exit 1
fi

echo "✓ Dashboard created successfully!"
echo "  Dashboard ID: $DASHBOARD_ID"
echo "  Dashboard URL: $DASHBOARD_URL"
echo ""

# Step 2: Create Insight 1 - Conversion Funnel: Features → Pricing → CTA
echo "Step 2: Creating Insight 1: Conversion Funnel..."
INSIGHT1_RESPONSE=$(curl -s -X POST "${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/" \
  -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Conversion Funnel: Features → Pricing → CTA",
    "description": "Tracks top-of-funnel progression from features page through pricing to CTA clicks",
    "query": {
      "kind": "FunnelsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "features_viewed",
          "name": "Features Viewed"
        },
        {
          "kind": "EventsNode",
          "event": "pricing_viewed",
          "name": "Pricing Viewed"
        },
        {
          "kind": "EventsNode",
          "event": null,
          "name": "CTA or Plan Selected",
          "custom_name": "CTA or Plan Selected",
          "properties": [],
          "math": "total",
          "actions": [
            {
              "kind": "EventsNode",
              "event": "cta_clicked"
            },
            {
              "kind": "EventsNode",
              "event": "pricing_plan_selected"
            }
          ]
        }
      ],
      "funnelsFilter": {
        "funnelWindowInterval": 14,
        "funnelWindowIntervalUnit": "day"
      }
    },
    "dashboards": ['$DASHBOARD_ID']
  }')

INSIGHT1_ID=$(echo "$INSIGHT1_RESPONSE" | jq -r '.id')
INSIGHT1_URL="${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}/insights/${INSIGHT1_ID}"

if [ "$INSIGHT1_ID" = "null" ] || [ -z "$INSIGHT1_ID" ]; then
    echo "Error creating Insight 1:"
    echo "$INSIGHT1_RESPONSE" | jq '.'
else
    echo "✓ Insight 1 created successfully!"
    echo "  Insight ID: $INSIGHT1_ID"
    echo "  Insight URL: $INSIGHT1_URL"
fi
echo ""

# Step 3: Create Insight 2 - CTA Clicks by Location
echo "Step 3: Creating Insight 2: CTA Clicks by Location..."
INSIGHT2_RESPONSE=$(curl -s -X POST "${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/" \
  -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CTA Clicks by Location",
    "description": "Shows which CTAs drive the most engagement across the site",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "cta_clicked",
          "name": "Hero CTA Clicked"
        },
        {
          "kind": "EventsNode",
          "event": "nav_get_started_clicked",
          "name": "Nav Get Started Clicked"
        },
        {
          "kind": "EventsNode",
          "event": "docs_cta_clicked",
          "name": "Docs CTA Clicked"
        }
      ],
      "interval": "day",
      "trendsFilter": {
        "display": "ActionsLineGraph"
      },
      "dateRange": {
        "date_from": "-30d"
      }
    },
    "dashboards": ['$DASHBOARD_ID']
  }')

INSIGHT2_ID=$(echo "$INSIGHT2_RESPONSE" | jq -r '.id')
INSIGHT2_URL="${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}/insights/${INSIGHT2_ID}"

if [ "$INSIGHT2_ID" = "null" ] || [ -z "$INSIGHT2_ID" ]; then
    echo "Error creating Insight 2:"
    echo "$INSIGHT2_RESPONSE" | jq '.'
else
    echo "✓ Insight 2 created successfully!"
    echo "  Insight ID: $INSIGHT2_ID"
    echo "  Insight URL: $INSIGHT2_URL"
fi
echo ""

# Step 4: Create Insight 3 - Pricing Plan Selection Breakdown
echo "Step 4: Creating Insight 3: Pricing Plan Selection Breakdown..."
INSIGHT3_RESPONSE=$(curl -s -X POST "${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/" \
  -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pricing Plan Selection Breakdown",
    "description": "Shows which pricing tier (Starter/Pro) is most popular",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "pricing_plan_selected",
          "name": "Pricing Plan Selected"
        }
      ],
      "breakdownFilter": {
        "breakdown": "plan",
        "breakdown_type": "event"
      },
      "interval": "day",
      "trendsFilter": {
        "display": "ActionsLineGraph"
      },
      "dateRange": {
        "date_from": "-30d"
      }
    },
    "dashboards": ['$DASHBOARD_ID']
  }')

INSIGHT3_ID=$(echo "$INSIGHT3_RESPONSE" | jq -r '.id')
INSIGHT3_URL="${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}/insights/${INSIGHT3_ID}"

if [ "$INSIGHT3_ID" = "null" ] || [ -z "$INSIGHT3_ID" ]; then
    echo "Error creating Insight 3:"
    echo "$INSIGHT3_RESPONSE" | jq '.'
else
    echo "✓ Insight 3 created successfully!"
    echo "  Insight ID: $INSIGHT3_ID"
    echo "  Insight URL: $INSIGHT3_URL"
fi
echo ""

# Step 5: Create Insight 4 - Docs Section Engagement
echo "Step 5: Creating Insight 4: Docs Section Engagement..."
INSIGHT4_RESPONSE=$(curl -s -X POST "${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/" \
  -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Docs Section Engagement",
    "description": "Shows which docs sections users explore most",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "docs_section_clicked",
          "name": "Docs Section Clicked"
        }
      ],
      "breakdownFilter": {
        "breakdown": "section",
        "breakdown_type": "event"
      },
      "interval": "day",
      "trendsFilter": {
        "display": "ActionsLineGraph"
      },
      "dateRange": {
        "date_from": "-30d"
      }
    },
    "dashboards": ['$DASHBOARD_ID']
  }')

INSIGHT4_ID=$(echo "$INSIGHT4_RESPONSE" | jq -r '.id')
INSIGHT4_URL="${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}/insights/${INSIGHT4_ID}"

if [ "$INSIGHT4_ID" = "null" ] || [ -z "$INSIGHT4_ID" ]; then
    echo "Error creating Insight 4:"
    echo "$INSIGHT4_RESPONSE" | jq '.'
else
    echo "✓ Insight 4 created successfully!"
    echo "  Insight ID: $INSIGHT4_ID"
    echo "  Insight URL: $INSIGHT4_URL"
fi
echo ""

# Step 6: Create Insight 5 - Daily Active Visitors (Pageviews)
echo "Step 6: Creating Insight 5: Daily Active Visitors..."
INSIGHT5_RESPONSE=$(curl -s -X POST "${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/" \
  -H "Authorization: Bearer ${POSTHOG_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Active Visitors (Pageviews)",
    "description": "Shows overall daily traffic trend",
    "query": {
      "kind": "TrendsQuery",
      "series": [
        {
          "kind": "EventsNode",
          "event": "$pageview",
          "name": "Pageviews"
        }
      ],
      "interval": "day",
      "trendsFilter": {
        "display": "ActionsLineGraph"
      },
      "dateRange": {
        "date_from": "-30d"
      }
    },
    "dashboards": ['$DASHBOARD_ID']
  }')

INSIGHT5_ID=$(echo "$INSIGHT5_RESPONSE" | jq -r '.id')
INSIGHT5_URL="${POSTHOG_HOST}/project/${POSTHOG_PROJECT_ID}/insights/${INSIGHT5_ID}"

if [ "$INSIGHT5_ID" = "null" ] || [ -z "$INSIGHT5_ID" ]; then
    echo "Error creating Insight 5:"
    echo "$INSIGHT5_RESPONSE" | jq '.'
else
    echo "✓ Insight 5 created successfully!"
    echo "  Insight ID: $INSIGHT5_ID"
    echo "  Insight URL: $INSIGHT5_URL"
fi
echo ""

# Summary
echo "=========================================="
echo "NeuralFlow AI Dashboard Creation Complete!"
echo "=========================================="
echo ""
echo "Dashboard URL:"
echo "  $DASHBOARD_URL"
echo ""
echo "Insight URLs:"
echo "  1. Conversion Funnel: $INSIGHT1_URL"
echo "  2. CTA Clicks by Location: $INSIGHT2_URL"
echo "  3. Pricing Plan Selection: $INSIGHT3_URL"
echo "  4. Docs Section Engagement: $INSIGHT4_URL"
echo "  5. Daily Active Visitors: $INSIGHT5_URL"
echo ""
echo "Next steps:"
echo "  - Review the dashboard at: $DASHBOARD_URL"
echo "  - Customize insight layouts and colors as needed"
echo "  - Share with your team!"

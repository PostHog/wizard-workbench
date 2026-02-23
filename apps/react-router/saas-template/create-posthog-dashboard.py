#!/usr/bin/env python3
"""
PostHog Dashboard and Insights Creation Script

This script creates an "Analytics basics" dashboard with 5 key insights for a React Router SaaS app.

REQUIREMENTS:
- A PostHog API key with the following scopes:
  - dashboard:write
  - insight:write

USAGE:
    export POSTHOG_API_KEY="your_api_key_here"
    python3 create-posthog-dashboard.py

The script will:
1. Create a new dashboard named "Analytics basics"
2. Create 5 insights tracking key SaaS metrics
3. Add all insights to the dashboard
4. Print the dashboard URL and insight URLs
"""

import os
import json
import requests
from typing import Dict, List, Any

# Configuration
POSTHOG_API_KEY = os.getenv('POSTHOG_API_KEY', 'phx_API_KEY_IS_HARDCODED')
POSTHOG_BASE_URL = 'https://us.posthog.com'
PROJECT_ID = '@current'

# API Headers
HEADERS = {
    'Authorization': f'Bearer {POSTHOG_API_KEY}',
    'Content-Type': 'application/json'
}

# Dashboard Configuration
DASHBOARD_CONFIG = {
    "name": "Analytics basics",
    "description": "Key business metrics for the SaaS app: conversions, churn, and user engagement",
    "pinned": True
}

# Insights Configuration
INSIGHTS = [
    {
        "name": "User Signup Funnel",
        "description": "Tracks the complete user signup flow from registration through onboarding steps",
        "query": {
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
    },
    {
        "name": "Subscription Conversion Rate",
        "description": "Daily trend comparing users who start checkout vs those who complete it",
        "query": {
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
    },
    {
        "name": "Subscription Churn",
        "description": "Weekly comparison of subscription cancellations vs resumptions",
        "query": {
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
    },
    {
        "name": "Daily Active Users (Logins)",
        "description": "Daily count of unique users logging into the application",
        "query": {
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
    },
    {
        "name": "Contact Sales Submissions",
        "description": "Daily trend of contact sales form submissions over the past 90 days",
        "query": {
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
    }
]


def create_dashboard() -> Dict[str, Any]:
    """Create the Analytics basics dashboard."""
    print("\n" + "="*60)
    print("Creating dashboard...")
    print("="*60)

    url = f'{POSTHOG_BASE_URL}/api/projects/{PROJECT_ID}/dashboards/'
    response = requests.post(url, headers=HEADERS, json=DASHBOARD_CONFIG)

    if response.status_code in [200, 201]:
        dashboard = response.json()
        print(f"✓ Dashboard created successfully!")
        print(f"  ID: {dashboard['id']}")
        print(f"  Name: {dashboard['name']}")
        return dashboard
    else:
        print(f"✗ Failed to create dashboard")
        print(f"  Status: {response.status_code}")
        print(f"  Error: {response.text}")
        raise Exception(f"Failed to create dashboard: {response.text}")


def create_insight(insight_config: Dict[str, Any], dashboard_id: int) -> Dict[str, Any]:
    """Create a single insight."""
    print(f"\nCreating insight: {insight_config['name']}")

    # Prepare the payload
    payload = {
        "name": insight_config["name"],
        "description": insight_config["description"],
        "query": insight_config["query"]
    }

    url = f'{POSTHOG_BASE_URL}/api/projects/{PROJECT_ID}/insights/'
    response = requests.post(url, headers=HEADERS, json=payload)

    if response.status_code in [200, 201]:
        insight = response.json()
        print(f"✓ Insight created")
        print(f"  ID: {insight['id']}")
        print(f"  Short ID: {insight.get('short_id', 'N/A')}")
        return insight
    else:
        print(f"✗ Failed to create insight")
        print(f"  Status: {response.status_code}")
        print(f"  Error: {response.text}")
        raise Exception(f"Failed to create insight: {response.text}")


def add_insight_to_dashboard(dashboard_id: int, insight_id: int, order: int) -> None:
    """Add an insight to the dashboard."""
    print(f"  Adding to dashboard (order: {order})...")

    # Get current dashboard to retrieve existing tiles
    url = f'{POSTHOG_BASE_URL}/api/projects/{PROJECT_ID}/dashboards/{dashboard_id}/'
    response = requests.get(url, headers=HEADERS)

    if response.status_code != 200:
        print(f"  ✗ Failed to fetch dashboard")
        return

    dashboard = response.json()
    tiles = dashboard.get('tiles', [])

    # Add new tile
    new_tile = {
        "insight": insight_id,
        "color": None,
        "layouts": {}
    }
    tiles.append(new_tile)

    # Update dashboard
    update_payload = {"tiles": tiles}
    response = requests.patch(url, headers=HEADERS, json=update_payload)

    if response.status_code == 200:
        print(f"  ✓ Added to dashboard")
    else:
        print(f"  ✗ Failed to add to dashboard")
        print(f"    Status: {response.status_code}")
        print(f"    Error: {response.text}")


def main():
    """Main execution function."""
    print("\n" + "="*60)
    print("PostHog Dashboard Creation Script")
    print("="*60)
    print(f"\nBase URL: {POSTHOG_BASE_URL}")
    print(f"Project: {PROJECT_ID}")

    try:
        # Step 1: Create the dashboard
        dashboard = create_dashboard()
        dashboard_id = dashboard['id']
        team_id = dashboard.get('team')
        dashboard_url = f"{POSTHOG_BASE_URL}/project/{team_id}/dashboard/{dashboard_id}"

        # Step 2: Create insights and add them to the dashboard
        print("\n" + "="*60)
        print("Creating insights...")
        print("="*60)

        insight_urls = []
        for i, insight_config in enumerate(INSIGHTS, start=1):
            insight = create_insight(insight_config, dashboard_id)
            insight_id = insight['id']
            short_id = insight.get('short_id', insight_id)
            insight_url = f"{POSTHOG_BASE_URL}/project/{team_id}/insights/{short_id}"
            insight_urls.append({
                "name": insight_config["name"],
                "url": insight_url
            })

            # Add to dashboard
            add_insight_to_dashboard(dashboard_id, insight_id, i - 1)

        # Step 3: Print results
        print("\n" + "="*60)
        print("SUCCESS! Dashboard and insights created")
        print("="*60)
        print(f"\nDashboard URL:")
        print(f"  {dashboard_url}")
        print(f"\nInsight URLs:")
        for item in insight_urls:
            print(f"  {item['name']}:")
            print(f"    {item['url']}")

        # Save results to file
        results = {
            "dashboard": {
                "id": dashboard_id,
                "name": dashboard['name'],
                "url": dashboard_url
            },
            "insights": insight_urls
        }

        with open('posthog-dashboard-results.json', 'w') as f:
            json.dump(results, f, indent=2)

        print(f"\n✓ Results saved to posthog-dashboard-results.json")

    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("\nNOTE: The API key may not have the required scopes:")
        print("  - dashboard:write")
        print("  - insight:write")
        print("\nPlease check your API key permissions in PostHog.")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())

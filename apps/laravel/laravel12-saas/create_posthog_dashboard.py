#!/usr/bin/env python3
"""
Script to create PostHog dashboard and insights via API
"""
import os
import sys
import json
import requests

# Get credentials from environment or MCP
POSTHOG_API_KEY = os.getenv('POSTHOG_PERSONAL_API_KEY')
POSTHOG_PROJECT_ID = os.getenv('POSTHOG_PROJECT_ID')
POSTHOG_HOST = os.getenv('POSTHOG_HOST', 'https://us.posthog.com')

if not POSTHOG_API_KEY:
    print("Error: POSTHOG_PERSONAL_API_KEY environment variable is required")
    print("Please set it with: export POSTHOG_PERSONAL_API_KEY='your_key'")
    sys.exit(1)

if not POSTHOG_PROJECT_ID:
    print("Error: POSTHOG_PROJECT_ID environment variable is required")
    print("Please set it with: export POSTHOG_PROJECT_ID='your_project_id'")
    sys.exit(1)

# API configuration
headers = {
    'Authorization': f'Bearer {POSTHOG_API_KEY}',
    'Content-Type': 'application/json'
}

base_url = f'{POSTHOG_HOST}/api/projects/{POSTHOG_PROJECT_ID}'

def create_insight(name, query_data):
    """Create an insight in PostHog"""
    payload = {
        'name': name,
        'derived_name': name,
        'description': '',
        'query': query_data,
        'tags': []
    }

    response = requests.post(
        f'{base_url}/insights/',
        headers=headers,
        json=payload
    )

    if response.status_code in [200, 201]:
        insight = response.json()
        print(f"✓ Created insight: {name}")
        print(f"  ID: {insight['id']}")
        print(f"  URL: {POSTHOG_HOST}/project/{POSTHOG_PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"✗ Failed to create insight: {name}")
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

def create_dashboard(name, description, insight_ids):
    """Create a dashboard and add insights to it"""
    payload = {
        'name': name,
        'description': description,
        'pinned': False,
        'tags': []
    }

    response = requests.post(
        f'{base_url}/dashboards/',
        headers=headers,
        json=payload
    )

    if response.status_code not in [200, 201]:
        print(f"✗ Failed to create dashboard: {name}")
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.text}")
        return None

    dashboard = response.json()
    print(f"\n✓ Created dashboard: {name}")
    print(f"  ID: {dashboard['id']}")
    print(f"  URL: {POSTHOG_HOST}/project/{POSTHOG_PROJECT_ID}/dashboard/{dashboard['id']}")

    # Add insights to dashboard
    for idx, insight_id in enumerate(insight_ids):
        if insight_id:
            tile_payload = {
                'insight': insight_id,
                'layouts': {},
                'color': None
            }

            tile_response = requests.post(
                f'{base_url}/dashboards/{dashboard["id"]}/tiles/',
                headers=headers,
                json=tile_payload
            )

            if tile_response.status_code in [200, 201]:
                print(f"  ✓ Added insight {insight_id} to dashboard")
            else:
                print(f"  ✗ Failed to add insight {insight_id} to dashboard")

    return dashboard

def main():
    print("Creating PostHog Dashboard and Insights")
    print("=" * 60)
    print(f"Host: {POSTHOG_HOST}")
    print(f"Project ID: {POSTHOG_PROJECT_ID}")
    print()

    insights = []

    # 1. Trend: user_signed_up (last 30 days)
    print("Creating insights...")
    insight1 = create_insight(
        "User Signups (Last 30 Days)",
        {
            "kind": "TrendsQuery",
            "series": [
                {
                    "kind": "EventsNode",
                    "event": "user_signed_up",
                    "name": "user_signed_up"
                }
            ],
            "trendsFilter": {
                "display": "ActionsLineGraph"
            },
            "dateRange": {
                "date_from": "-30d"
            },
            "interval": "day"
        }
    )
    insights.append(insight1['id'] if insight1 else None)

    # 2. Trend: user_logged_in broken down by login_method (last 30 days)
    insight2 = create_insight(
        "User Logins by Method (Last 30 Days)",
        {
            "kind": "TrendsQuery",
            "series": [
                {
                    "kind": "EventsNode",
                    "event": "user_logged_in",
                    "name": "user_logged_in"
                }
            ],
            "breakdownFilter": {
                "breakdown": "login_method",
                "breakdown_type": "event"
            },
            "trendsFilter": {
                "display": "ActionsLineGraph"
            },
            "dateRange": {
                "date_from": "-30d"
            },
            "interval": "day"
        }
    )
    insights.append(insight2['id'] if insight2 else None)

    # 3. Funnel: user_signed_up → subscription_checkout_started → subscription_created
    insight3 = create_insight(
        "Subscription Conversion Funnel",
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
                    "event": "subscription_checkout_started",
                    "name": "subscription_checkout_started"
                },
                {
                    "kind": "EventsNode",
                    "event": "subscription_created",
                    "name": "subscription_created"
                }
            ],
            "funnelsFilter": {
                "funnelWindowInterval": 14,
                "funnelWindowIntervalUnit": "day"
            },
            "dateRange": {
                "date_from": "-30d"
            }
        }
    )
    insights.append(insight3['id'] if insight3 else None)

    # 4. Trend: subscription_plan_swapped (last 30 days)
    insight4 = create_insight(
        "Subscription Plan Changes (Last 30 Days)",
        {
            "kind": "TrendsQuery",
            "series": [
                {
                    "kind": "EventsNode",
                    "event": "subscription_plan_swapped",
                    "name": "subscription_plan_swapped"
                }
            ],
            "trendsFilter": {
                "display": "ActionsLineGraph"
            },
            "dateRange": {
                "date_from": "-30d"
            },
            "interval": "day"
        }
    )
    insights.append(insight4['id'] if insight4 else None)

    # 5. Trend: email_verified (last 30 days)
    insight5 = create_insight(
        "Email Verifications (Last 30 Days)",
        {
            "kind": "TrendsQuery",
            "series": [
                {
                    "kind": "EventsNode",
                    "event": "email_verified",
                    "name": "email_verified"
                }
            ],
            "trendsFilter": {
                "display": "ActionsLineGraph"
            },
            "dateRange": {
                "date_from": "-30d"
            },
            "interval": "day"
        }
    )
    insights.append(insight5['id'] if insight5 else None)

    # Create dashboard with all insights
    print()
    dashboard = create_dashboard(
        "Analytics basics",
        "Core analytics dashboard for the Laravel SaaS application — tracking user signups, logins, subscriptions, and key business conversions.",
        [i for i in insights if i is not None]
    )

    print("\n" + "=" * 60)
    print("Summary:")
    print(f"Created {len([i for i in insights if i])} insights")
    if dashboard:
        print(f"Dashboard URL: {POSTHOG_HOST}/project/{POSTHOG_PROJECT_ID}/dashboard/{dashboard['id']}")

if __name__ == '__main__':
    main()

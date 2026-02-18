#!/usr/bin/env python3
"""
Script to create a PostHog dashboard with insights for Acme AI SaaS
"""
import os
import requests
import json

# Configuration
POSTHOG_HOST = "https://us.posthog.com"
PERSONAL_API_KEY = os.environ.get("POSTHOG_PERSONAL_API_KEY", "phx_8HRlHpu8bUzaZsGTCAJpXkfVNNPBSYr8dcRywpdn5hHHGc5")
PROJECT_ID = 238460

# Headers for API requests
headers = {
    "Authorization": f"Bearer {PERSONAL_API_KEY}",
    "Content-Type": "application/json"
}

def create_dashboard():
    """Create the Analytics basics dashboard"""
    url = f"{POSTHOG_HOST}/api/projects/{PROJECT_ID}/dashboards/"

    data = {
        "name": "Analytics basics",
        "description": "Core analytics dashboard for Acme AI SaaS - tracking user signups, content generation, API key usage, and credit consumption"
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code in [200, 201]:
        dashboard = response.json()
        print(f"✅ Dashboard created successfully!")
        print(f"   Dashboard ID: {dashboard['id']}")
        print(f"   Dashboard URL: https://us.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard['id']}")
        return dashboard
    else:
        print(f"❌ Failed to create dashboard: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def create_insight(dashboard_id, name, description, query):
    """Create an insight and add it to the dashboard"""
    url = f"{POSTHOG_HOST}/api/projects/{PROJECT_ID}/insights/"

    data = {
        "name": name,
        "description": description,
        "query": query,
        "dashboards": [dashboard_id]
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code in [200, 201]:
        insight = response.json()
        print(f"✅ Insight '{name}' created successfully!")
        print(f"   Insight ID: {insight['id']}")
        print(f"   Insight URL: https://us.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"❌ Failed to create insight '{name}': {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def main():
    print("=" * 80)
    print("Creating PostHog Dashboard: Analytics basics")
    print("=" * 80)
    print()

    # Create dashboard
    dashboard = create_dashboard()
    if not dashboard:
        print("\n❌ Failed to create dashboard. Exiting.")
        return

    dashboard_id = dashboard['id']
    print()

    # Insight 1: Signup to First Generation Funnel
    print("-" * 80)
    insight1_query = {
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
    create_insight(
        dashboard_id,
        "Signup to First Generation Funnel",
        "Tracking conversion from user signup to first content generation",
        insight1_query
    )
    print()

    # Insight 2: Daily Content Generation Trend
    print("-" * 80)
    insight2_query = {
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
    create_insight(
        dashboard_id,
        "Daily Content Generation Trend",
        "Content generation events over time, broken down by generation type",
        insight2_query
    )
    print()

    # Insight 3: User Auth Trend
    print("-" * 80)
    insight3_query = {
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
    create_insight(
        dashboard_id,
        "User Auth Trend",
        "User login and signup trends over the last 30 days",
        insight3_query
    )
    print()

    # Insight 4: Insufficient Credits (Churn Signal)
    print("-" * 80)
    insight4_query = {
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
    create_insight(
        dashboard_id,
        "Insufficient Credits (Churn Signal)",
        "Tracking insufficient credits events - potential upgrade triggers",
        insight4_query
    )
    print()

    # Insight 5: API Adoption
    print("-" * 80)
    insight5_query = {
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
    create_insight(
        dashboard_id,
        "API Adoption",
        "API key creation and revocation trends",
        insight5_query
    )
    print()

    print("=" * 80)
    print("✅ Dashboard and all insights created successfully!")
    print(f"Dashboard URL: https://us.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard_id}")
    print("=" * 80)

if __name__ == "__main__":
    main()

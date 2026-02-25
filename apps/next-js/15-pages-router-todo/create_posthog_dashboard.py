#!/usr/bin/env python3
"""
PostHog Dashboard and Insights Creation Script

This script creates the "Analytics basics" dashboard with 5 insights for the Next.js Todo App.
It requires a PostHog Personal API Key with the following scopes:
- dashboard:write
- insight:write
- dashboard:read
- insight:read

Usage:
    export POSTHOG_PERSONAL_API_KEY="your-api-key-here"
    python3 create_posthog_dashboard.py
"""

import os
import sys
import json
import requests
from typing import Dict, Any, List

# Configuration
PROJECT_ID = 238460
BASE_URL = "https://us.posthog.com"
DASHBOARD_NAME = "Analytics basics"
DASHBOARD_DESCRIPTION = "Core analytics dashboard for the Next.js Todo App - tracking todo creation, completion, deletion, and error rates"

def get_headers() -> Dict[str, str]:
    """Get request headers with API key."""
    api_key = os.environ.get('POSTHOG_PERSONAL_API_KEY', '')
    if not api_key:
        print("Error: POSTHOG_PERSONAL_API_KEY environment variable not set")
        sys.exit(1)

    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

def create_dashboard() -> Dict[str, Any]:
    """Create the Analytics basics dashboard."""
    print(f"\n📊 Creating dashboard: {DASHBOARD_NAME}")

    dashboard_data = {
        "name": DASHBOARD_NAME,
        "description": DASHBOARD_DESCRIPTION
    }

    response = requests.post(
        f"{BASE_URL}/api/projects/{PROJECT_ID}/dashboards/",
        headers=get_headers(),
        json=dashboard_data
    )

    if response.status_code == 201:
        dashboard = response.json()
        print(f"✅ Dashboard created successfully!")
        print(f"   ID: {dashboard['id']}")
        print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/dashboard/{dashboard['id']}")
        return dashboard
    else:
        print(f"❌ Error creating dashboard: {response.status_code}")
        print(f"   Response: {response.text}")
        sys.exit(1)

def create_insight_1_todo_creation_trend(dashboard_id: int) -> Dict[str, Any]:
    """Create Insight 1: Todo Creation Trend (Line Chart)."""
    print("\n📈 Creating Insight 1: Todo Creation Trend")

    insight_data = {
        "name": "Todo Creation Trend",
        "filters": {
            "events": [
                {
                    "id": "todo_created",
                    "name": "todo_created",
                    "type": "events",
                    "order": 0
                }
            ],
            "insight": "TRENDS",
            "display": "ActionsLineGraph",
            "date_from": "-30d"
        },
        "dashboards": [dashboard_id]
    }

    response = requests.post(
        f"{BASE_URL}/api/projects/{PROJECT_ID}/insights/",
        headers=get_headers(),
        json=insight_data
    )

    if response.status_code == 201:
        insight = response.json()
        print(f"✅ Insight created successfully!")
        print(f"   ID: {insight['id']}")
        print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"❌ Error creating insight: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def create_insight_2_todo_completion_funnel(dashboard_id: int) -> Dict[str, Any]:
    """Create Insight 2: Todo Completion Funnel."""
    print("\n📊 Creating Insight 2: Todo Completion Funnel")

    insight_data = {
        "name": "Todo Completion Funnel",
        "filters": {
            "events": [
                {
                    "id": "todo_created",
                    "name": "todo_created",
                    "type": "events",
                    "order": 0
                },
                {
                    "id": "todo_completed",
                    "name": "todo_completed",
                    "type": "events",
                    "order": 1
                }
            ],
            "insight": "FUNNELS",
            "funnel_viz_type": "steps",
            "date_from": "-30d"
        },
        "dashboards": [dashboard_id]
    }

    response = requests.post(
        f"{BASE_URL}/api/projects/{PROJECT_ID}/insights/",
        headers=get_headers(),
        json=insight_data
    )

    if response.status_code == 201:
        insight = response.json()
        print(f"✅ Insight created successfully!")
        print(f"   ID: {insight['id']}")
        print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"❌ Error creating insight: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def create_insight_3_todo_actions_breakdown(dashboard_id: int) -> Dict[str, Any]:
    """Create Insight 3: Todo Actions Breakdown (Bar Chart)."""
    print("\n📊 Creating Insight 3: Todo Actions Breakdown")

    insight_data = {
        "name": "Todo Actions Breakdown",
        "filters": {
            "events": [
                {
                    "id": "todo_created",
                    "name": "todo_created",
                    "type": "events",
                    "order": 0
                },
                {
                    "id": "todo_completed",
                    "name": "todo_completed",
                    "type": "events",
                    "order": 1
                },
                {
                    "id": "todo_deleted",
                    "name": "todo_deleted",
                    "type": "events",
                    "order": 2
                }
            ],
            "insight": "TRENDS",
            "display": "ActionsBar",
            "date_from": "-30d"
        },
        "dashboards": [dashboard_id]
    }

    response = requests.post(
        f"{BASE_URL}/api/projects/{PROJECT_ID}/insights/",
        headers=get_headers(),
        json=insight_data
    )

    if response.status_code == 201:
        insight = response.json()
        print(f"✅ Insight created successfully!")
        print(f"   ID: {insight['id']}")
        print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"❌ Error creating insight: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def create_insight_4_todo_error_rate(dashboard_id: int) -> Dict[str, Any]:
    """Create Insight 4: Todo Error Rate (Line Chart)."""
    print("\n📊 Creating Insight 4: Todo Error Rate")

    insight_data = {
        "name": "Todo Error Rate",
        "filters": {
            "events": [
                {
                    "id": "todo_create_failed",
                    "name": "todo_create_failed",
                    "type": "events",
                    "order": 0
                },
                {
                    "id": "todo_delete_failed",
                    "name": "todo_delete_failed",
                    "type": "events",
                    "order": 1
                },
                {
                    "id": "todo_toggle_failed",
                    "name": "todo_toggle_failed",
                    "type": "events",
                    "order": 2
                }
            ],
            "insight": "TRENDS",
            "display": "ActionsLineGraph",
            "date_from": "-30d"
        },
        "dashboards": [dashboard_id]
    }

    response = requests.post(
        f"{BASE_URL}/api/projects/{PROJECT_ID}/insights/",
        headers=get_headers(),
        json=insight_data
    )

    if response.status_code == 201:
        insight = response.json()
        print(f"✅ Insight created successfully!")
        print(f"   ID: {insight['id']}")
        print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"❌ Error creating insight: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def create_insight_5_server_side_activity(dashboard_id: int) -> Dict[str, Any]:
    """Create Insight 5: Todo Activity (Server-side) (Bar Chart)."""
    print("\n📊 Creating Insight 5: Todo Activity (Server-side)")

    insight_data = {
        "name": "Todo Activity (Server-side)",
        "filters": {
            "events": [
                {
                    "id": "server_todo_created",
                    "name": "server_todo_created",
                    "type": "events",
                    "order": 0
                },
                {
                    "id": "server_todo_updated",
                    "name": "server_todo_updated",
                    "type": "events",
                    "order": 1
                },
                {
                    "id": "server_todo_deleted",
                    "name": "server_todo_deleted",
                    "type": "events",
                    "order": 2
                }
            ],
            "insight": "TRENDS",
            "display": "ActionsBar",
            "date_from": "-30d"
        },
        "dashboards": [dashboard_id]
    }

    response = requests.post(
        f"{BASE_URL}/api/projects/{PROJECT_ID}/insights/",
        headers=get_headers(),
        json=insight_data
    )

    if response.status_code == 201:
        insight = response.json()
        print(f"✅ Insight created successfully!")
        print(f"   ID: {insight['id']}")
        print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/insights/{insight['short_id']}")
        return insight
    else:
        print(f"❌ Error creating insight: {response.status_code}")
        print(f"   Response: {response.text}")
        return None

def main():
    """Main execution function."""
    print("=" * 80)
    print("PostHog Dashboard and Insights Creation")
    print("=" * 80)
    print(f"Project ID: {PROJECT_ID}")
    print(f"Base URL: {BASE_URL}")

    # Create dashboard
    dashboard = create_dashboard()
    dashboard_id = dashboard['id']

    # Create all insights
    insights = []
    insights.append(create_insight_1_todo_creation_trend(dashboard_id))
    insights.append(create_insight_2_todo_completion_funnel(dashboard_id))
    insights.append(create_insight_3_todo_actions_breakdown(dashboard_id))
    insights.append(create_insight_4_todo_error_rate(dashboard_id))
    insights.append(create_insight_5_server_side_activity(dashboard_id))

    # Summary
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    print(f"\n✅ Dashboard Created:")
    print(f"   Name: {DASHBOARD_NAME}")
    print(f"   ID: {dashboard_id}")
    print(f"   URL: {BASE_URL}/project/{PROJECT_ID}/dashboard/{dashboard_id}")

    print(f"\n✅ Insights Created:")
    for i, insight in enumerate(insights, 1):
        if insight:
            print(f"   {i}. {insight['name']}")
            print(f"      URL: {BASE_URL}/project/{PROJECT_ID}/insights/{insight['short_id']}")

    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()

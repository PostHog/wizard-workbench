#!/usr/bin/env python3
"""
Create PostHog Analytics Dashboard for Express Todo API

This script creates a dashboard with 5 insights tracking:
1. Todos created over time
2. Todo completion rate
3. Todos deleted over time
4. Todo deletion breakdown (completed vs incomplete)
5. Overall event volume

Usage:
    export POSTHOG_API_KEY=phx_your_api_key_with_write_permissions
    python3 create_posthog_dashboard.py
"""

import os
import sys
import json
import requests
from typing import Dict, Any, List

PROJECT_ID = 238460
API_BASE_URL = "https://us.posthog.com/api"


def get_api_key() -> str:
    """Get PostHog API key from environment"""
    api_key = os.environ.get("POSTHOG_API_KEY") or os.environ.get("POSTHOG_PERSONAL_API_KEY")
    if not api_key:
        print("Error: POSTHOG_API_KEY environment variable not set")
        print("Please set it with: export POSTHOG_API_KEY=phx_your_api_key")
        sys.exit(1)
    return api_key


def create_dashboard(api_key: str) -> Dict[str, Any]:
    """Create the main dashboard"""
    url = f"{API_BASE_URL}/projects/{PROJECT_ID}/dashboards/"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "name": "Analytics basics",
        "description": "Core analytics dashboard for the Express Todo API - tracking todo creation, updates, deletions, and completion rates"
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    dashboard = response.json()
    print(f"✓ Created dashboard: {dashboard['name']} (ID: {dashboard['id']})")
    return dashboard


def create_insight(api_key: str, name: str, description: str, query: Dict[str, Any]) -> Dict[str, Any]:
    """Create an insight"""
    url = f"{API_BASE_URL}/projects/{PROJECT_ID}/insights/"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "name": name,
        "description": description,
        "query": query
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    insight = response.json()
    print(f"  ✓ Created insight: {name} (ID: {insight['id']})")
    return insight


def add_insight_to_dashboard(api_key: str, dashboard_id: int, insight_id: int) -> None:
    """Add an insight to the dashboard"""
    url = f"{API_BASE_URL}/projects/{PROJECT_ID}/dashboards/{dashboard_id}/"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # First, get the current dashboard to see existing tiles
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    dashboard = response.json()

    # Add the new insight as a tile
    tiles = dashboard.get("tiles", [])
    new_tile = {
        "insight": insight_id
    }
    tiles.append(new_tile)

    # Update the dashboard
    payload = {"tiles": tiles}
    response = requests.patch(url, headers=headers, json=payload)
    response.raise_for_status()


def main():
    """Main function to create dashboard and insights"""
    api_key = get_api_key()

    print(f"Creating PostHog dashboard for Express Todo API (Project {PROJECT_ID})...\n")

    # Create dashboard
    try:
        dashboard = create_dashboard(api_key)
        dashboard_id = dashboard["id"]
        dashboard_url = f"https://us.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard_id}"
        print(f"Dashboard URL: {dashboard_url}\n")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print(f"Error: API key lacks required permissions")
            print(f"Details: {e.response.json()}")
            print("\nThe API key needs 'dashboard:write' scope.")
        else:
            print(f"Error creating dashboard: {e}")
            print(f"Response: {e.response.json()}")
        sys.exit(1)

    # Define insights
    insights = [
        {
            "name": "Todos Created Over Time",
            "description": "Track the trend of todo_created events to monitor new todo creation activity",
            "query": {
                "kind": "InsightVizNode",
                "source": {
                    "kind": "TrendsQuery",
                    "series": [
                        {
                            "kind": "EventsNode",
                            "event": "todo_created",
                            "custom_name": "Todos Created"
                        }
                    ],
                    "interval": "day",
                    "dateRange": {"date_from": "-30d"},
                    "trendsFilter": {"display": "ActionsLineGraph"},
                    "version": 2
                }
            }
        },
        {
            "name": "Todo Completion Rate",
            "description": "Track todo_updated events where completed=true to measure task completion",
            "query": {
                "kind": "InsightVizNode",
                "source": {
                    "kind": "TrendsQuery",
                    "series": [
                        {
                            "kind": "EventsNode",
                            "event": "todo_updated",
                            "custom_name": "Todos Updated",
                            "properties": []
                        },
                        {
                            "kind": "EventsNode",
                            "event": "todo_updated",
                            "custom_name": "Todos Completed",
                            "properties": [
                                {
                                    "key": "completed",
                                    "value": ["true"],
                                    "operator": "exact",
                                    "type": "event"
                                }
                            ]
                        }
                    ],
                    "interval": "day",
                    "dateRange": {"date_from": "-30d"},
                    "trendsFilter": {"display": "ActionsLineGraph"},
                    "version": 2
                }
            }
        },
        {
            "name": "Todos Deleted Over Time",
            "description": "Track the trend of todo_deleted events to monitor deletion activity",
            "query": {
                "kind": "InsightVizNode",
                "source": {
                    "kind": "TrendsQuery",
                    "series": [
                        {
                            "kind": "EventsNode",
                            "event": "todo_deleted",
                            "custom_name": "Todos Deleted"
                        }
                    ],
                    "interval": "day",
                    "dateRange": {"date_from": "-30d"},
                    "trendsFilter": {"display": "ActionsLineGraph"},
                    "version": 2
                }
            }
        },
        {
            "name": "Todo Deletion: Completed vs Incomplete",
            "description": "Breakdown of todo_deleted events by was_completed property",
            "query": {
                "kind": "InsightVizNode",
                "source": {
                    "kind": "TrendsQuery",
                    "series": [
                        {
                            "kind": "EventsNode",
                            "event": "todo_deleted",
                            "custom_name": "Todos Deleted"
                        }
                    ],
                    "breakdownFilter": {
                        "breakdown": "was_completed",
                        "breakdown_type": "event"
                    },
                    "interval": "day",
                    "dateRange": {"date_from": "-30d"},
                    "trendsFilter": {"display": "ActionsLineGraph"},
                    "version": 2
                }
            }
        },
        {
            "name": "Overall Event Volume",
            "description": "Combined trend of all three todo events to track overall API activity",
            "query": {
                "kind": "InsightVizNode",
                "source": {
                    "kind": "TrendsQuery",
                    "series": [
                        {
                            "kind": "EventsNode",
                            "event": "todo_created",
                            "custom_name": "Created"
                        },
                        {
                            "kind": "EventsNode",
                            "event": "todo_updated",
                            "custom_name": "Updated"
                        },
                        {
                            "kind": "EventsNode",
                            "event": "todo_deleted",
                            "custom_name": "Deleted"
                        }
                    ],
                    "interval": "day",
                    "dateRange": {"date_from": "-30d"},
                    "trendsFilter": {"display": "ActionsLineGraph"},
                    "version": 2
                }
            }
        }
    ]

    # Create insights and add to dashboard
    print("Creating insights...\n")
    insight_urls = []

    for insight_spec in insights:
        try:
            insight = create_insight(
                api_key,
                insight_spec["name"],
                insight_spec["description"],
                insight_spec["query"]
            )
            insight_url = f"https://us.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}"
            insight_urls.append({
                "name": insight_spec["name"],
                "url": insight_url
            })

            # Add insight to dashboard
            add_insight_to_dashboard(api_key, dashboard_id, insight["id"])

        except requests.exceptions.HTTPError as e:
            print(f"  ✗ Error creating insight '{insight_spec['name']}': {e}")
            if hasattr(e, 'response'):
                print(f"    Response: {e.response.json()}")

    # Print summary
    print("\n" + "="*80)
    print("Dashboard created successfully!")
    print("="*80)
    print(f"\nDashboard URL:")
    print(f"  {dashboard_url}")
    print(f"\nInsight URLs:")
    for item in insight_urls:
        print(f"  - {item['name']}")
        print(f"    {item['url']}")
    print()


if __name__ == "__main__":
    main()

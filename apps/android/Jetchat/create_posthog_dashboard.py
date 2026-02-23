#!/usr/bin/env python3
"""
Create PostHog dashboard and insights for Jetchat Android app.
This script uses the PostHog API to create analytics dashboards and insights.
"""

import json
import urllib.request
import urllib.error
import os
import sys
from typing import Dict, Any, List

# Configuration
API_KEY = os.environ.get('POSTHOG_PERSONAL_API_KEY')
REGION = os.environ.get('POSTHOG_REGION', 'us')
BASE_URL = f"https://{REGION}.posthog.com/api"
PROJECT_ID = 2  # PostHog App + Website project

def make_request(endpoint: str, method: str = 'GET', data: Dict[Any, Any] = None) -> Dict[Any, Any]:
    """Make an HTTP request to the PostHog API."""
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }

    url = f"{BASE_URL}{endpoint}"

    if data:
        data_bytes = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    else:
        req = urllib.request.Request(url, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
        print(f"Response: {error_body}", file=sys.stderr)
        raise

def create_dashboard(name: str, description: str) -> Dict[Any, Any]:
    """Create a new dashboard."""
    endpoint = f"/projects/{PROJECT_ID}/dashboards/"
    data = {
        "name": name,
        "description": description,
        "pinned": False
    }
    return make_request(endpoint, method='POST', data=data)

def create_trend_insight(name: str, event_name: str, description: str = "", events: List[str] = None) -> Dict[Any, Any]:
    """Create a trend insight for tracking event volume over time."""

    # Build series based on whether we have multiple events or just one
    if events:
        series = [
            {
                "kind": "EventsNode",
                "event": event,
                "custom_name": event.replace('_', ' ').title(),
                "math": "total"
            }
            for event in events
        ]
    else:
        series = [{
            "kind": "EventsNode",
            "event": event_name,
            "custom_name": event_name.replace('_', ' ').title(),
            "math": "total"
        }]

    query = {
        "kind": "InsightVizNode",
        "source": {
            "kind": "TrendsQuery",
            "series": series,
            "dateRange": {
                "date_from": "-30d",
                "date_to": None
            },
            "interval": "day",
            "properties": [],
            "filterTestAccounts": False
        }
    }

    data = {
        "name": name,
        "description": description,
        "query": query,
        "favorited": False
    }

    endpoint = f"/projects/{PROJECT_ID}/insights/"
    return make_request(endpoint, method='POST', data=data)

def create_funnel_insight(name: str, steps: List[str], description: str = "") -> Dict[Any, Any]:
    """Create a funnel insight for conversion tracking."""

    series = [
        {
            "kind": "EventsNode",
            "event": step,
            "custom_name": step.replace('_', ' ').title()
        }
        for step in steps
    ]

    query = {
        "kind": "InsightVizNode",
        "source": {
            "kind": "FunnelsQuery",
            "series": series,
            "dateRange": {
                "date_from": "-30d",
                "date_to": None
            },
            "properties": [],
            "filterTestAccounts": False,
            "funnelsFilter": {
                "layout": "vertical",
                "breakdownAttributionType": "first_touch",
                "funnelOrderType": "ordered",
                "funnelVizType": "steps",
                "funnelWindowInterval": 14,
                "funnelWindowIntervalUnit": "day",
                "funnelStepReference": "total"
            }
        }
    }

    data = {
        "name": name,
        "description": description,
        "query": query,
        "favorited": False
    }

    endpoint = f"/projects/{PROJECT_ID}/insights/"
    return make_request(endpoint, method='POST', data=data)

def add_insight_to_dashboard(dashboard_id: int, insight_id: int) -> Dict[Any, Any]:
    """Add an insight to a dashboard."""
    endpoint = f"/projects/{PROJECT_ID}/dashboards/{dashboard_id}/"

    # Get current dashboard to append to tiles
    dashboard = make_request(endpoint)

    # Create new tile
    new_tile = {
        "insight": insight_id
    }

    # Update dashboard with new tile
    tiles = dashboard.get('tiles', [])
    tiles.append(new_tile)

    data = {
        "tiles": tiles
    }

    return make_request(endpoint, method='PATCH', data=data)

def main():
    """Main execution function."""
    print("=" * 80)
    print("Creating PostHog Dashboard and Insights for Jetchat Android App")
    print("=" * 80)
    print()

    # STEP 1: Create Dashboard
    print("STEP 1: Creating dashboard...")
    dashboard = create_dashboard(
        name="Analytics basics",
        description="Key business metrics for the Jetchat Android app: user authentication, messaging, and engagement."
    )
    dashboard_id = dashboard['id']
    dashboard_url = f"https://{REGION}.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard_id}"
    print(f"✓ Dashboard created: {dashboard['name']}")
    print(f"  ID: {dashboard_id}")
    print(f"  URL: {dashboard_url}")
    print()

    # STEP 2: Create Insights
    print("STEP 2: Creating insights...")
    insights = []

    # Insight 1: Daily Active Users (Login Rate)
    print("  Creating insight 1: Daily Active Users (Login Rate)...")
    insight1 = create_trend_insight(
        name="Daily Active Users (Login Rate)",
        event_name="user_logged_in",
        description="Trend of user_logged_in events over time"
    )
    insights.append(insight1)
    print(f"  ✓ Insight 1 created (ID: {insight1['id']})")

    # Insight 2: Message Sending Volume
    print("  Creating insight 2: Message Sending Volume...")
    insight2 = create_trend_insight(
        name="Message Sending Volume",
        event_name="message_sent",
        description="Trend of message_sent events over time"
    )
    insights.append(insight2)
    print(f"  ✓ Insight 2 created (ID: {insight2['id']})")

    # Insight 3: Login to Message Conversion Funnel
    print("  Creating insight 3: Login to Message Conversion Funnel...")
    insight3 = create_funnel_insight(
        name="Login to Message Conversion Funnel",
        steps=["user_logged_in", "message_sent"],
        description="Funnel from user_logged_in -> message_sent"
    )
    insights.append(insight3)
    print(f"  ✓ Insight 3 created (ID: {insight3['id']})")

    # Insight 4: User Churn Signal (Logout Rate)
    print("  Creating insight 4: User Churn Signal (Logout Rate)...")
    insight4 = create_trend_insight(
        name="User Churn Signal (Logout Rate)",
        event_name="user_logged_out",
        description="Trend of user_logged_out events over time"
    )
    insights.append(insight4)
    print(f"  ✓ Insight 4 created (ID: {insight4['id']})")

    # Insight 5: Feature Engagement comparison
    print("  Creating insight 5: Feature Engagement: Profile Views vs Drawer Opens...")
    insight5 = create_trend_insight(
        name="Feature Engagement: Profile Views vs Drawer Opens",
        event_name="profile_viewed",  # Will be overridden by events param
        events=["profile_viewed", "drawer_opened"],
        description="Trend comparing profile_viewed and drawer_opened events"
    )
    insights.append(insight5)
    print(f"  ✓ Insight 5 created (ID: {insight5['id']})")
    print()

    # STEP 3: Add insights to dashboard
    print("STEP 3: Adding insights to dashboard...")
    for i, insight in enumerate(insights, 1):
        print(f"  Adding insight {i} to dashboard...")
        add_insight_to_dashboard(dashboard_id, insight['id'])
        print(f"  ✓ Insight {i} added")
    print()

    # STEP 4: Print Results
    print("=" * 80)
    print("STEP 4: Summary - Dashboard and Insight URLs")
    print("=" * 80)
    print()
    print(f"Dashboard URL: {dashboard_url}")
    print()
    for i, insight in enumerate(insights, 1):
        insight_url = f"https://{REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}"
        print(f"Insight {i} URL: {insight_url}")
        print(f"  Name: {insight['name']}")
    print()
    print("=" * 80)
    print("✓ All tasks completed successfully!")
    print("=" * 80)

    # Return JSON output for programmatic access
    result = {
        "dashboard": {
            "id": dashboard_id,
            "url": dashboard_url,
            "name": dashboard['name']
        },
        "insights": [
            {
                "id": insight['id'],
                "short_id": insight['short_id'],
                "url": f"https://{REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}",
                "name": insight['name']
            }
            for insight in insights
        ]
    }

    return result

if __name__ == "__main__":
    try:
        result = main()
        # Print JSON for parsing
        print()
        print("JSON OUTPUT:")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

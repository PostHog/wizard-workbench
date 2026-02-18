#!/usr/bin/env python3
"""
Setup script to create PostHog dashboard and insights for Django SaaS application.

REQUIREMENTS:
-------------
This script requires a PostHog Personal API Key with the following scopes:
- dashboard:write
- insight:write
- insight:read

To create a new Personal API Key:
1. Go to https://us.posthog.com/settings/user-api-keys
2. Click "Create personal API key"
3. Select the following scopes:
   - dashboard:write
   - insight:write
   - insight:read
4. Copy the key and set it as POSTHOG_PERSONAL_API_KEY environment variable

USAGE:
------
export POSTHOG_PERSONAL_API_KEY="your-key-with-correct-scopes"
python3 setup_posthog_analytics.py

NOTE: The current POSTHOG_PERSONAL_API_KEY in the environment does NOT have
the required scopes and will result in 403 Forbidden errors.
"""

import os
import sys
import json
import requests
from typing import Dict, Any, List, Optional

# Configuration
POSTHOG_API_KEY = os.environ.get('POSTHOG_PERSONAL_API_KEY')
POSTHOG_REGION = os.environ.get('POSTHOG_REGION', 'us')
PROJECT_ID = 238460
BASE_URL = f"https://{POSTHOG_REGION}.posthog.com/api"

# Dashboard configuration
DASHBOARD_CONFIG = {
    "name": "Analytics basics",
    "description": "Core analytics dashboard for the Django SaaS application tracking user signups, logins, subscriptions, project activity, and churn.",
    "pinned": False
}

# Insights configuration
INSIGHTS_CONFIG = [
    {
        "name": "User Signups Over Time",
        "description": "Track new user registrations over time",
        "type": "trends",
        "events": ["user_signed_up"]
    },
    {
        "name": "Signup → Subscription Conversion Funnel",
        "description": "Conversion funnel from signup to first paid subscription",
        "type": "funnels",
        "events": ["user_signed_up", "subscription_started"]
    },
    {
        "name": "Subscription Cancellations Over Time",
        "description": "Track subscription churn/cancellations over time",
        "type": "trends",
        "events": ["subscription_canceled"]
    },
    {
        "name": "Login Activity Over Time",
        "description": "Track daily active user logins",
        "type": "trends",
        "events": ["user_logged_in"]
    },
    {
        "name": "Project Activity",
        "description": "Track project CRUD activity across all users",
        "type": "trends",
        "events": ["project_created", "project_updated", "project_deleted"]
    }
]


def get_headers() -> Dict[str, str]:
    """Get API request headers."""
    if not POSTHOG_API_KEY:
        print("ERROR: POSTHOG_PERSONAL_API_KEY environment variable not set!")
        sys.exit(1)

    return {
        "Authorization": f"Bearer {POSTHOG_API_KEY}",
        "Content-Type": "application/json"
    }


def check_api_key_permissions() -> bool:
    """Test if the API key has the necessary permissions."""
    headers = get_headers()

    # Test read access to dashboards
    url = f"{BASE_URL}/projects/{PROJECT_ID}/dashboards/"
    response = requests.get(url, headers=headers)

    if response.status_code == 403:
        error = response.json()
        print(f"ERROR: API key permission denied: {error.get('detail', 'Unknown error')}")
        print("\nYour API key is missing required scopes.")
        print("Please create a new Personal API Key with these scopes:")
        print("  - dashboard:write")
        print("  - insight:write")
        print("  - insight:read")
        print("\nCreate one at: https://us.posthog.com/settings/user-api-keys")
        return False
    elif response.status_code != 200:
        print(f"ERROR: Unexpected response: {response.status_code}")
        print(f"Response: {response.text}")
        return False

    return True


def create_dashboard(name: str, description: str) -> Optional[Dict[str, Any]]:
    """Create a new dashboard."""
    url = f"{BASE_URL}/projects/{PROJECT_ID}/dashboards/"
    payload = {
        "name": name,
        "description": description,
        "pinned": False
    }

    try:
        response = requests.post(url, headers=get_headers(), json=payload)
        response.raise_for_status()
        dashboard = response.json()
        print(f"✓ Created dashboard: {name}")
        print(f"  Dashboard ID: {dashboard['id']}")
        dashboard_url = f"https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard['id']}"
        print(f"  Dashboard URL: {dashboard_url}")
        return dashboard
    except requests.exceptions.HTTPError as e:
        print(f"✗ Failed to create dashboard: {e}")
        print(f"  Response: {e.response.text}")
        return None


def create_trends_insight(
    name: str,
    description: str,
    events: List[str],
    dashboard_id: int
) -> Optional[Dict[str, Any]]:
    """Create a trends insight."""
    url = f"{BASE_URL}/projects/{PROJECT_ID}/insights/"

    # Build events array for the query
    events_array = [
        {"id": event, "name": event, "type": "events", "order": i}
        for i, event in enumerate(events)
    ]

    payload = {
        "name": name,
        "description": description,
        "filters": {
            "events": events_array,
            "insight": "TRENDS",
            "date_from": "-30d",
            "interval": "day"
        },
        "dashboards": [dashboard_id]
    }

    try:
        response = requests.post(url, headers=get_headers(), json=payload)
        response.raise_for_status()
        insight = response.json()
        print(f"✓ Created insight: {name}")
        print(f"  Insight ID: {insight['id']}")
        insight_url = f"https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}"
        print(f"  Insight URL: {insight_url}")
        return insight
    except requests.exceptions.HTTPError as e:
        print(f"✗ Failed to create insight: {e}")
        print(f"  Response: {e.response.text}")
        return None


def create_funnel_insight(
    name: str,
    description: str,
    events: List[str],
    dashboard_id: int
) -> Optional[Dict[str, Any]]:
    """Create a funnel insight."""
    url = f"{BASE_URL}/projects/{PROJECT_ID}/insights/"

    # Build events array for the funnel query
    events_array = [
        {"id": event, "name": event, "type": "events", "order": i}
        for i, event in enumerate(events)
    ]

    payload = {
        "name": name,
        "description": description,
        "filters": {
            "events": events_array,
            "insight": "FUNNELS",
            "funnel_viz_type": "steps",
            "date_from": "-30d"
        },
        "dashboards": [dashboard_id]
    }

    try:
        response = requests.post(url, headers=get_headers(), json=payload)
        response.raise_for_status()
        insight = response.json()
        print(f"✓ Created insight: {name}")
        print(f"  Insight ID: {insight['id']}")
        insight_url = f"https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}"
        print(f"  Insight URL: {insight_url}")
        return insight
    except requests.exceptions.HTTPError as e:
        print(f"✗ Failed to create insight: {e}")
        print(f"  Response: {e.response.text}")
        return None


def create_insight(config: Dict[str, Any], dashboard_id: int) -> Optional[Dict[str, Any]]:
    """Create an insight based on configuration."""
    if config["type"] == "trends":
        return create_trends_insight(
            name=config["name"],
            description=config["description"],
            events=config["events"],
            dashboard_id=dashboard_id
        )
    elif config["type"] == "funnels":
        return create_funnel_insight(
            name=config["name"],
            description=config["description"],
            events=config["events"],
            dashboard_id=dashboard_id
        )
    else:
        print(f"✗ Unknown insight type: {config['type']}")
        return None


def main():
    """Main execution function."""
    print("=" * 80)
    print("PostHog Analytics Setup for Django SaaS Application")
    print("=" * 80)
    print()

    # Check API key permissions
    print("Checking API key permissions...")
    if not check_api_key_permissions():
        sys.exit(1)
    print("✓ API key permissions verified")
    print()

    # Create the dashboard
    print("Creating Dashboard...")
    print("-" * 80)
    dashboard = create_dashboard(
        name=DASHBOARD_CONFIG["name"],
        description=DASHBOARD_CONFIG["description"]
    )

    if not dashboard:
        print("\n✗ Failed to create dashboard. Exiting.")
        sys.exit(1)

    dashboard_id = dashboard['id']
    dashboard_url = f"https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard_id}"
    print()

    # Create insights
    print("Creating Insights...")
    print("-" * 80)
    insights = []

    for i, insight_config in enumerate(INSIGHTS_CONFIG, 1):
        print(f"\n[{i}/{len(INSIGHTS_CONFIG)}] Creating: {insight_config['name']}")
        insight = create_insight(insight_config, dashboard_id)
        if insight:
            insights.append(insight)
        print()

    # Summary
    print("=" * 80)
    print("Setup Complete!")
    print("=" * 80)
    print()

    if dashboard:
        print(f"Dashboard: {DASHBOARD_CONFIG['name']}")
        print(f"URL: {dashboard_url}")
        print()

    if insights:
        print(f"Created {len(insights)}/{len(INSIGHTS_CONFIG)} insights:")
        for insight in insights:
            insight_url = f"https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}"
            print(f"  - {insight['name']}")
            print(f"    {insight_url}")
        print()

    if len(insights) < len(INSIGHTS_CONFIG):
        print(f"Warning: {len(INSIGHTS_CONFIG) - len(insights)} insights failed to create.")
        print("Check the error messages above for details.")
        sys.exit(1)


if __name__ == "__main__":
    main()

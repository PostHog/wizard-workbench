#!/usr/bin/env python3
"""
Script to create a PostHog dashboard with insights for Django SaaS application.
"""
import os
import json
import requests
from typing import Dict, Any, List

# Configuration
POSTHOG_API_KEY = os.environ.get('POSTHOG_PERSONAL_API_KEY')
POSTHOG_REGION = os.environ.get('POSTHOG_REGION', 'us')
PROJECT_ID = 238460
BASE_URL = f"https://{POSTHOG_REGION}.posthog.com/api"

headers = {
    "Authorization": f"Bearer {POSTHOG_API_KEY}",
    "Content-Type": "application/json"
}


def create_dashboard(name: str, description: str) -> Dict[str, Any]:
    """Create a new dashboard."""
    url = f"{BASE_URL}/projects/{PROJECT_ID}/dashboards/"
    payload = {
        "name": name,
        "description": description,
        "pinned": False
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    dashboard = response.json()
    print(f"✓ Created dashboard: {name}")
    print(f"  Dashboard ID: {dashboard['id']}")
    print(f"  Dashboard URL: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard['id']}")
    return dashboard


def create_trends_insight(name: str, description: str, events: List[str], dashboard_id: int) -> Dict[str, Any]:
    """Create a trends insight."""
    url = f"{BASE_URL}/projects/{PROJECT_ID}/insights/"

    # Build events array for the query
    events_array = [{"id": event, "name": event, "type": "events", "order": i} for i, event in enumerate(events)]

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

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    insight = response.json()
    print(f"✓ Created insight: {name}")
    print(f"  Insight ID: {insight['id']}")
    print(f"  Insight URL: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}")
    return insight


def create_funnel_insight(name: str, description: str, events: List[str], dashboard_id: int) -> Dict[str, Any]:
    """Create a funnel insight."""
    url = f"{BASE_URL}/projects/{PROJECT_ID}/insights/"

    # Build events array for the funnel query
    events_array = [{"id": event, "name": event, "type": "events", "order": i} for i, event in enumerate(events)]

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

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    insight = response.json()
    print(f"✓ Created insight: {name}")
    print(f"  Insight ID: {insight['id']}")
    print(f"  Insight URL: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight['short_id']}")
    return insight


def main():
    print("Creating PostHog Dashboard and Insights for Django SaaS Application")
    print("=" * 80)
    print()

    # Step 1: Create the dashboard
    print("Step 1: Creating Dashboard...")
    dashboard = create_dashboard(
        name="Analytics basics",
        description="Core analytics dashboard for the Django SaaS application tracking user signups, logins, subscriptions, project activity, and churn."
    )
    dashboard_id = dashboard['id']
    print()

    # Step 2: Create insights
    print("Step 2: Creating Insights...")
    print()

    # Insight 1: User Signups Over Time
    insight1 = create_trends_insight(
        name="User Signups Over Time",
        description="Track new user registrations over time",
        events=["user_signed_up"],
        dashboard_id=dashboard_id
    )
    print()

    # Insight 2: Signup → Subscription Conversion Funnel
    insight2 = create_funnel_insight(
        name="Signup → Subscription Conversion Funnel",
        description="Conversion funnel from signup to first paid subscription",
        events=["user_signed_up", "subscription_started"],
        dashboard_id=dashboard_id
    )
    print()

    # Insight 3: Subscription Cancellations Over Time
    insight3 = create_trends_insight(
        name="Subscription Cancellations Over Time",
        description="Track subscription churn/cancellations over time",
        events=["subscription_canceled"],
        dashboard_id=dashboard_id
    )
    print()

    # Insight 4: Login Activity Over Time
    insight4 = create_trends_insight(
        name="Login Activity Over Time",
        description="Track daily active user logins",
        events=["user_logged_in"],
        dashboard_id=dashboard_id
    )
    print()

    # Insight 5: Project Activity
    insight5 = create_trends_insight(
        name="Project Activity",
        description="Track project CRUD activity across all users",
        events=["project_created", "project_updated", "project_deleted"],
        dashboard_id=dashboard_id
    )
    print()

    # Summary
    print("=" * 80)
    print("✓ Dashboard and Insights Created Successfully!")
    print("=" * 80)
    print()
    print(f"Dashboard URL: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/dashboard/{dashboard_id}")
    print()
    print("Insight URLs:")
    print(f"1. {insight1['name']}: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight1['short_id']}")
    print(f"2. {insight2['name']}: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight2['short_id']}")
    print(f"3. {insight3['name']}: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight3['short_id']}")
    print(f"4. {insight4['name']}: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight4['short_id']}")
    print(f"5. {insight5['name']}: https://{POSTHOG_REGION}.posthog.com/project/{PROJECT_ID}/insights/{insight5['short_id']}")
    print()


if __name__ == "__main__":
    main()

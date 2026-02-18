#!/usr/bin/env python3
"""
NeuralFlow AI Marketing Dashboard & Insights Creation Script

This script creates a PostHog dashboard with 5 insights for tracking marketing performance.

Prerequisites:
  1. PostHog Personal API Key with scopes: dashboard:write, insight:write
  2. Project ID for the PostHog project

Usage:
  export POSTHOG_API_KEY="your_personal_api_key_with_write_scopes"
  export POSTHOG_PROJECT_ID="your_project_id"
  python3 create_neuralflow_dashboard.py
"""

import os
import sys
import json
import requests
from typing import Dict, Any, Optional

# Configuration
POSTHOG_API_KEY = os.environ.get('POSTHOG_API_KEY', '')
POSTHOG_PROJECT_ID = os.environ.get('POSTHOG_PROJECT_ID', '19618')
POSTHOG_HOST = os.environ.get('POSTHOG_HOST', 'https://us.posthog.com')

class PostHogDashboardCreator:
    def __init__(self, api_key: str, project_id: str, host: str):
        self.api_key = api_key
        self.project_id = project_id
        self.host = host
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def create_dashboard(self) -> Dict[str, Any]:
        """Create the Analytics basics dashboard."""
        url = f'{self.host}/api/projects/{self.project_id}/dashboards/'
        payload = {
            'name': 'Analytics basics',
            'description': 'Core analytics dashboard for NeuralFlow AI - tracking CTAs, pricing funnel, feature discovery, and docs engagement',
            'pinned': True
        }

        print('Creating dashboard "Analytics basics"...')
        response = self.session.post(url, json=payload)
        response.raise_for_status()

        dashboard = response.json()
        dashboard_url = f"{self.host}/project/{self.project_id}/dashboard/{dashboard['id']}"

        print(f'✓ Dashboard created successfully!')
        print(f'  Dashboard ID: {dashboard["id"]}')
        print(f'  Dashboard URL: {dashboard_url}')
        print()

        return dashboard

    def create_insight(
        self,
        name: str,
        description: str,
        query: Dict[str, Any],
        dashboard_id: int,
        insight_number: int
    ) -> Optional[Dict[str, Any]]:
        """Create an insight and add it to the dashboard."""
        url = f'{self.host}/api/projects/{self.project_id}/insights/'
        payload = {
            'name': name,
            'description': description,
            'query': query,
            'dashboards': [dashboard_id]
        }

        print(f'Creating Insight {insight_number}: {name}...')
        try:
            response = self.session.post(url, json=payload)
            response.raise_for_status()

            insight = response.json()
            insight_url = f"{self.host}/project/{self.project_id}/insights/{insight['id']}"

            print(f'✓ Insight {insight_number} created successfully!')
            print(f'  Insight ID: {insight["id"]}')
            print(f'  Insight URL: {insight_url}')
            print()

            return insight
        except requests.exceptions.HTTPError as e:
            print(f'✗ Error creating Insight {insight_number}:')
            print(f'  {e}')
            print(f'  Response: {e.response.text}')
            print()
            return None

    def create_all_insights(self, dashboard_id: int) -> list:
        """Create all 5 insights for the NeuralFlow AI dashboard."""
        insights = []

        # Insight 1: Conversion Funnel
        insight1_query = {
            'kind': 'FunnelsQuery',
            'series': [
                {
                    'kind': 'EventsNode',
                    'event': 'features_viewed',
                    'name': 'Features Viewed'
                },
                {
                    'kind': 'EventsNode',
                    'event': 'pricing_viewed',
                    'name': 'Pricing Viewed'
                },
                {
                    'kind': 'EventsNode',
                    'event': None,
                    'name': 'CTA or Plan Selected',
                    'custom_name': 'CTA or Plan Selected',
                    'properties': [],
                    'math': 'total',
                    'actions': [
                        {'kind': 'EventsNode', 'event': 'cta_clicked'},
                        {'kind': 'EventsNode', 'event': 'pricing_plan_selected'}
                    ]
                }
            ],
            'funnelsFilter': {
                'funnelWindowInterval': 14,
                'funnelWindowIntervalUnit': 'day'
            }
        }

        insight1 = self.create_insight(
            name='Conversion Funnel: Features → Pricing → CTA',
            description='Tracks top-of-funnel progression from features page through pricing to CTA clicks',
            query=insight1_query,
            dashboard_id=dashboard_id,
            insight_number=1
        )
        if insight1:
            insights.append(insight1)

        # Insight 2: CTA Clicks by Location
        insight2_query = {
            'kind': 'TrendsQuery',
            'series': [
                {'kind': 'EventsNode', 'event': 'cta_clicked', 'name': 'Hero CTA Clicked'},
                {'kind': 'EventsNode', 'event': 'nav_get_started_clicked', 'name': 'Nav Get Started Clicked'},
                {'kind': 'EventsNode', 'event': 'docs_cta_clicked', 'name': 'Docs CTA Clicked'}
            ],
            'interval': 'day',
            'trendsFilter': {'display': 'ActionsLineGraph'},
            'dateRange': {'date_from': '-30d'}
        }

        insight2 = self.create_insight(
            name='CTA Clicks by Location',
            description='Shows which CTAs drive the most engagement across the site',
            query=insight2_query,
            dashboard_id=dashboard_id,
            insight_number=2
        )
        if insight2:
            insights.append(insight2)

        # Insight 3: Pricing Plan Selection Breakdown
        insight3_query = {
            'kind': 'TrendsQuery',
            'series': [
                {'kind': 'EventsNode', 'event': 'pricing_plan_selected', 'name': 'Pricing Plan Selected'}
            ],
            'breakdownFilter': {
                'breakdown': 'plan',
                'breakdown_type': 'event'
            },
            'interval': 'day',
            'trendsFilter': {'display': 'ActionsLineGraph'},
            'dateRange': {'date_from': '-30d'}
        }

        insight3 = self.create_insight(
            name='Pricing Plan Selection Breakdown',
            description='Shows which pricing tier (Starter/Pro) is most popular',
            query=insight3_query,
            dashboard_id=dashboard_id,
            insight_number=3
        )
        if insight3:
            insights.append(insight3)

        # Insight 4: Docs Section Engagement
        insight4_query = {
            'kind': 'TrendsQuery',
            'series': [
                {'kind': 'EventsNode', 'event': 'docs_section_clicked', 'name': 'Docs Section Clicked'}
            ],
            'breakdownFilter': {
                'breakdown': 'section',
                'breakdown_type': 'event'
            },
            'interval': 'day',
            'trendsFilter': {'display': 'ActionsLineGraph'},
            'dateRange': {'date_from': '-30d'}
        }

        insight4 = self.create_insight(
            name='Docs Section Engagement',
            description='Shows which docs sections users explore most',
            query=insight4_query,
            dashboard_id=dashboard_id,
            insight_number=4
        )
        if insight4:
            insights.append(insight4)

        # Insight 5: Daily Active Visitors (Pageviews)
        insight5_query = {
            'kind': 'TrendsQuery',
            'series': [
                {'kind': 'EventsNode', 'event': '$pageview', 'name': 'Pageviews'}
            ],
            'interval': 'day',
            'trendsFilter': {'display': 'ActionsLineGraph'},
            'dateRange': {'date_from': '-30d'}
        }

        insight5 = self.create_insight(
            name='Daily Active Visitors (Pageviews)',
            description='Shows overall daily traffic trend',
            query=insight5_query,
            dashboard_id=dashboard_id,
            insight_number=5
        )
        if insight5:
            insights.append(insight5)

        return insights

    def run(self):
        """Main execution flow."""
        print('=' * 50)
        print('NeuralFlow AI Dashboard Creation')
        print('=' * 50)
        print(f'Project ID: {self.project_id}')
        print(f'PostHog Host: {self.host}')
        print()

        # Step 1: Create dashboard
        dashboard = self.create_dashboard()
        dashboard_id = dashboard['id']
        dashboard_url = f"{self.host}/project/{self.project_id}/dashboard/{dashboard_id}"

        # Step 2: Create all insights
        insights = self.create_all_insights(dashboard_id)

        # Summary
        print('=' * 50)
        print('Dashboard Creation Complete!')
        print('=' * 50)
        print()
        print(f'Dashboard URL:')
        print(f'  {dashboard_url}')
        print()

        if insights:
            print(f'Insights Created ({len(insights)}/5):')
            for i, insight in enumerate(insights, 1):
                insight_url = f"{self.host}/project/{self.project_id}/insights/{insight['id']}"
                print(f'  {i}. {insight["name"]}: {insight_url}')

        print()
        print('Next steps:')
        print('  - Review the dashboard and customize layouts')
        print('  - Set up alerts for key metrics')
        print('  - Share with your team!')
        print()


def main():
    """Main entry point."""
    if not POSTHOG_API_KEY:
        print('Error: POSTHOG_API_KEY environment variable is required')
        print('Please create a Personal API Key with dashboard:write and insight:write scopes')
        print('Visit: https://us.posthog.com/settings/user-api-keys')
        sys.exit(1)

    creator = PostHogDashboardCreator(
        api_key=POSTHOG_API_KEY,
        project_id=POSTHOG_PROJECT_ID,
        host=POSTHOG_HOST
    )

    try:
        creator.run()
    except requests.exceptions.HTTPError as e:
        print(f'\n✗ Error: {e}')
        print(f'Response: {e.response.text}')
        sys.exit(1)
    except Exception as e:
        print(f'\n✗ Unexpected error: {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()

# PostHog Analytics Setup Summary - Nuxt Movies

## Overview

This document provides a summary of the PostHog dashboard and insights configuration for the Nuxt Movies application.

## API Limitations Encountered

The PostHog Personal API Key currently in use has the following scope limitations:
- Missing `dashboard:write` scope - Cannot programmatically create dashboards
- Missing `insight:write` scope - Cannot programmatically create insights
- Missing `organization:read` scope - Cannot read organization details

As a result, dashboard and insights must be created manually through the PostHog UI.

## Solution Provided

Two comprehensive files have been created to facilitate manual setup:

### 1. posthog-dashboard-setup.md
A detailed step-by-step guide with:
- Complete configuration details for the dashboard
- Step-by-step instructions for each of the 5 insights
- Query JSON for each insight (for future automation)
- Direct PostHog URLs for quick access
- Troubleshooting tips

### 2. posthog-insights-config.json
A structured JSON file containing:
- Dashboard configuration
- All 5 insight definitions with complete query objects
- 4 additional suggested insights for future expansion
- Ready for programmatic creation when API permissions are updated

## Dashboard: "Analytics basics"

**Description:** Core analytics for Nuxt Movies: user authentication, content engagement, and search behavior

**Project:** Project ID 2 on https://us.posthog.com

## 5 Core Insights

1. **Login to First Media View Funnel**
   - Type: Funnel
   - Tracks conversion from user login to viewing media content
   - 1-day conversion window

2. **Daily Active Users**
   - Type: Trends
   - Unique users logging in per day
   - Line graph showing DAU trend

3. **Top Search Queries**
   - Type: Trends (Table)
   - Most popular search terms
   - Sorted by frequency

4. **Media Views by Type**
   - Type: Trends
   - Media views split by type (movie vs TV show)
   - Time-series visualization

5. **Error Rate Trend**
   - Type: Trends
   - Daily error page displays
   - Monitors application health

## Quick Access Links

- **Dashboard Creation:** https://us.posthog.com/project/2/dashboard
- **New Insight:** https://us.posthog.com/project/2/insights/new
- **Events List:** https://us.posthog.com/project/2/events
- **Project Settings:** https://us.posthog.com/project/2/settings

## Instrumented Events

The application tracks 8 events:
- `user_logged_in` - Client-side successful login
- `login_failed` - Client-side failed login
- `user_logged_out` - User logout
- `media_viewed` - Movie/TV show detail view (with media_type, media_id, media_title)
- `search_performed` - Search execution (with search_query, result_count)
- `person_viewed` - Actor/director page view (with person_id, person_name)
- `error_displayed` - Error page shown (with status_code, error_message, is_404)
- `server_user_logged_in` - Server-side login event

## Next Steps

1. Navigate to https://us.posthog.com/project/2/dashboard
2. Click "New Dashboard" and create "Analytics basics"
3. Follow the detailed instructions in `posthog-dashboard-setup.md` to create each insight
4. Add each insight to the dashboard as you create them
5. Arrange and resize dashboard tiles as needed

## Future Enhancements

Consider these additional analytics:
- Login failure rate analysis
- Most viewed actors/directors ranking
- Error breakdown by status code
- Search success rate metrics
- Extended user engagement funnels

## Files Created

- `posthog-dashboard-setup.md` - Detailed setup guide
- `posthog-insights-config.json` - Structured configuration file
- `POSTHOG-SETUP-SUMMARY.md` - This summary document

All files are located in: `/home/runner/work/wizard-workbench/wizard-workbench/apps/nuxt/movies-nuxt-4/`

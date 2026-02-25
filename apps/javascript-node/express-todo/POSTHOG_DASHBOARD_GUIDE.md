# PostHog Analytics Dashboard for Express Todo API

## Overview

This guide documents the "Analytics basics" dashboard for the Express Todo API, which tracks todo creation, updates, deletions, and completion rates.

## Tracked Events

The Express Todo API (in `/home/runner/work/wizard-workbench/wizard-workbench/apps/javascript-node/express-todo/index.js`) tracks three main events:

### 1. `todo_created`
- **When**: Fired when a new todo is created via `POST /api/todos`
- **Location**: `index.js` lines 59-63
- **Properties**:
  - `todo_id`: Unique identifier of the todo
  - `title_length`: Length of the todo title
  - `total_todos`: Total number of todos after creation

### 2. `todo_updated`
- **When**: Fired when a todo is updated via `PATCH /api/todos/:id`
- **Location**: `index.js` lines 80-83
- **Properties**:
  - `todo_id`: Unique identifier of the todo
  - `completed`: Boolean indicating if the todo is completed

### 3. `todo_deleted`
- **When**: Fired when a todo is deleted via `DELETE /api/todos/:id`
- **Location**: `index.js` lines 100-103
- **Properties**:
  - `todo_id`: Unique identifier of the todo
  - `was_completed`: Boolean indicating if the todo was completed when deleted

## Dashboard Insights

The dashboard includes 5 key insights:

### 1. Todos Created Over Time
**Purpose**: Track the trend of todo_created events to monitor new todo creation activity

**Query**: Line graph showing daily `todo_created` events over the last 30 days

**Use cases**:
- Monitor user engagement with the API
- Identify peak creation times
- Track growth in API usage

### 2. Todo Completion Rate
**Purpose**: Measure task completion by tracking todo_updated events where completed=true

**Query**: Line graph comparing:
- All `todo_updated` events
- Only `todo_updated` events where `completed=true`

**Use cases**:
- Understand user completion behavior
- Calculate completion rate percentage
- Identify trends in task management

### 3. Todos Deleted Over Time
**Purpose**: Track the trend of todo_deleted events to monitor deletion activity

**Query**: Line graph showing daily `todo_deleted` events over the last 30 days

**Use cases**:
- Monitor deletion patterns
- Identify potential UX issues (high deletion rates)
- Track data cleanup behavior

### 4. Todo Deletion: Completed vs Incomplete
**Purpose**: Understand what types of todos are being deleted

**Query**: Line graph of `todo_deleted` events broken down by the `was_completed` property

**Use cases**:
- Determine if users delete completed or incomplete todos more
- Understand todo lifecycle patterns
- Identify potential feature needs (e.g., auto-delete completed todos)

### 5. Overall Event Volume
**Purpose**: Track overall API activity across all todo operations

**Query**: Line graph showing all three events:
- `todo_created` (labeled "Created")
- `todo_updated` (labeled "Updated")
- `todo_deleted` (labeled "Deleted")

**Use cases**:
- Monitor overall API health and usage
- Identify activity patterns
- Correlate events (e.g., spikes in creation followed by updates)

## Creating the Dashboard

### Option 1: Automated Script (Recommended)

Use the provided Python script to create the dashboard automatically:

```bash
# Install required package
pip install requests

# Set your PostHog API key with write permissions
export POSTHOG_API_KEY=phx_your_api_key_here

# Run the script
python3 create_posthog_dashboard.py
```

The script will:
1. Create the dashboard
2. Create all 5 insights
3. Add the insights to the dashboard
4. Output all URLs for easy access

### Option 2: Manual Creation via PostHog UI

1. Go to https://us.posthog.com/project/238460/dashboard
2. Click "New Dashboard"
3. Name it "Analytics basics"
4. Add description: "Core analytics dashboard for the Express Todo API - tracking todo creation, updates, deletions, and completion rates"
5. For each insight, click "New Insight" and use the query specifications from `posthog-dashboard-spec.json`

### Option 3: API Requests

See the detailed API specifications in `posthog-dashboard-spec.json`

## API Key Requirements

To create dashboards and insights programmatically, your PostHog API key needs the following scopes:
- `dashboard:write`
- `insight:write`

To create a new API key with the required scopes:
1. Go to https://us.posthog.com/settings/user-api-keys
2. Click "Create personal API key"
3. Select the required scopes
4. Save the key securely

## Files

- `/home/runner/work/wizard-workbench/wizard-workbench/apps/javascript-node/express-todo/index.js` - Express API with PostHog tracking
- `/home/runner/work/wizard-workbench/wizard-workbench/apps/javascript-node/express-todo/posthog-dashboard-spec.json` - Complete dashboard specification
- `/home/runner/work/wizard-workbench/wizard-workbench/apps/javascript-node/express-todo/create_posthog_dashboard.py` - Automated dashboard creation script
- `/home/runner/work/wizard-workbench/wizard-workbench/apps/javascript-node/express-todo/POSTHOG_DASHBOARD_GUIDE.md` - This guide

## PostHog Project Information

- **Project ID**: 238460
- **Region**: US
- **Base URL**: https://us.posthog.com
- **API Base**: https://us.posthog.com/api

## Limitations Encountered

The PostHog MCP tools (`mcp__posthog-wizard__*`) available in this environment only provide read operations:
- `dashboard-get` - Get a specific dashboard
- `dashboards-get-all` - List all dashboards
- `event-definitions-list` - List event definitions
- `entity-search` - Search for entities

They do not include write operations for creating dashboards or insights. Therefore, the automated Python script or manual UI creation are the recommended approaches.

## Next Steps

After creating the dashboard:

1. **Verify Event Tracking**: Ensure the Express API is running and events are being captured
2. **Test the API**: Create, update, and delete todos to generate events
3. **Review Insights**: Check that data is appearing in the dashboard
4. **Set Up Monitoring**: Consider setting up PostHog alerts for key metrics
5. **Iterate**: Add additional insights based on your analytics needs

## Support

For issues with:
- **Dashboard creation**: Check API key permissions and scopes
- **Event tracking**: Verify `POSTHOG_API_KEY` is set in the Express app environment
- **Data not appearing**: Allow up to 1 minute for events to appear in PostHog
- **API questions**: See PostHog API docs at https://posthog.com/docs/api

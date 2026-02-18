# NeuralFlow AI PostHog Analytics Dashboard

## Quick Links

- **Dashboard Creation Guide:** [POSTHOG_DASHBOARD_GUIDE.md](./POSTHOG_DASHBOARD_GUIDE.md)
- **Creation Summary:** [DASHBOARD_CREATION_SUMMARY.md](./DASHBOARD_CREATION_SUMMARY.md)
- **Dashboard Mockup:** [DASHBOARD_MOCKUP.md](./DASHBOARD_MOCKUP.md)
- **API Payloads:** [api_payloads.json](./api_payloads.json)

---

## Executive Summary

This package provides complete automation and documentation for creating a PostHog analytics dashboard to track marketing performance for NeuralFlow AI. The dashboard includes 5 key insights covering conversion funnels, CTA engagement, pricing preferences, documentation usage, and traffic trends.

**Dashboard Name:** Analytics basics
**Purpose:** Track CTAs, pricing funnel, feature discovery, and docs engagement
**Insights:** 5 pre-configured analytics views
**Setup Time:** < 5 minutes with proper credentials

---

## What's Included

### 📜 Scripts

1. **`create_neuralflow_dashboard.py`** (Recommended)
   - Python 3 automation script
   - Clean error handling and progress feedback
   - Automatically creates dashboard and all 5 insights
   - Returns URLs for all created resources

2. **`create_neuralflow_dashboard.sh`**
   - Bash alternative using curl
   - Same functionality as Python script
   - Useful for CI/CD pipelines

### 📚 Documentation

1. **`POSTHOG_DASHBOARD_GUIDE.md`**
   - Complete implementation guide
   - API key setup instructions
   - Event schema reference
   - Troubleshooting guide

2. **`DASHBOARD_CREATION_SUMMARY.md`**
   - Executive overview
   - Quick start guide
   - File descriptions

3. **`DASHBOARD_MOCKUP.md`**
   - Visual representation of dashboard
   - Sample data and insights
   - Expected metrics and KPIs

4. **`api_payloads.json`**
   - Raw JSON payloads for all API calls
   - Useful for manual testing or custom integrations

---

## Quick Start

### Prerequisites

1. **PostHog Personal API Key** with scopes:
   - `dashboard:write`
   - `insight:write`

2. **PostHog Project ID** where events are being tracked

### Setup Steps

```bash
# 1. Create API Key (if needed)
#    Visit: https://us.posthog.com/settings/user-api-keys
#    Create key with dashboard:write and insight:write scopes

# 2. Set environment variables
export POSTHOG_API_KEY="phx_your_api_key_here"
export POSTHOG_PROJECT_ID="your_project_id"

# 3. Run the Python script (recommended)
python3 create_neuralflow_dashboard.py

# OR run the Bash script
./create_neuralflow_dashboard.sh
```

### Expected Output

```
Creating dashboard "Analytics basics"...
✓ Dashboard created successfully!
  Dashboard URL: https://us.posthog.com/project/19618/dashboard/12345

Creating Insight 1: Conversion Funnel...
✓ Insight 1 created successfully!

[... 4 more insights ...]

Dashboard Creation Complete!
Dashboard URL: https://us.posthog.com/project/19618/dashboard/12345
```

---

## Dashboard Overview

### Insights Included

| # | Name | Type | Purpose |
|---|------|------|---------|
| 1 | Conversion Funnel | Funnel | Track Features → Pricing → CTA journey |
| 2 | CTA Clicks by Location | Trends | Compare engagement across CTA locations |
| 3 | Pricing Plan Selection | Trends (Breakdown) | Identify most popular pricing tier |
| 4 | Docs Section Engagement | Trends (Breakdown) | Find most valuable docs sections |
| 5 | Daily Active Visitors | Trends | Monitor overall traffic trends |

### Required Events

| Event | Description |
|-------|-------------|
| `features_viewed` | User views features page |
| `pricing_viewed` | User views pricing page |
| `cta_clicked` | Hero CTA click |
| `docs_cta_clicked` | Docs CTA click |
| `nav_get_started_clicked` | Nav CTA click |
| `pricing_plan_selected` | User selects pricing plan |
| `contact_sales_clicked` | Enterprise contact click |
| `docs_section_clicked` | Docs section card click |
| `$pageview` | Standard pageview (auto-tracked) |

---

## File Structure

```
.
├── create_neuralflow_dashboard.py      # Python automation script (recommended)
├── create_neuralflow_dashboard.sh      # Bash automation script
├── POSTHOG_DASHBOARD_GUIDE.md          # Complete implementation guide
├── DASHBOARD_CREATION_SUMMARY.md       # Executive summary
├── DASHBOARD_MOCKUP.md                 # Visual mockup with sample data
├── api_payloads.json                   # Raw API payloads
└── README_POSTHOG_DASHBOARD.md         # This file
```

---

## Troubleshooting

### "API key missing required scope"

**Problem:** API key lacks dashboard:write or insight:write permissions

**Solution:**
1. Go to PostHog → Settings → Personal API Keys
2. Create new key with required scopes
3. Update `POSTHOG_API_KEY` environment variable

### "Authentication credentials were not provided"

**Problem:** API key not set or incorrect format

**Solution:**
- Verify: `echo $POSTHOG_API_KEY`
- Ensure it starts with `phx_`
- Check no extra quotes or spaces

### "Project not found"

**Problem:** Invalid project ID or no access

**Solution:**
- Verify project ID is correct
- Check API key has access to project
- List projects: `curl -H "Authorization: Bearer $POSTHOG_API_KEY" https://us.posthog.com/api/projects/`

### Insights show no data

**Problem:** Events not captured or names don't match

**Solution:**
1. Verify events in PostHog Events tab
2. Check event names are exact (case-sensitive)
3. Ensure properties exist for breakdown insights
4. Wait a few minutes for data processing

---

## API Key Permissions

### Required Scopes

| Scope | Purpose |
|-------|---------|
| `dashboard:write` | Create and modify dashboards |
| `insight:write` | Create and modify insights |

### Optional Scopes (Not Required)

| Scope | Purpose |
|-------|---------|
| `organization:read` | List organizations (not needed for this script) |
| `project:write` | Create projects (not needed) |
| `project:read` | Read project details (helpful but not required) |

### Security Best Practices

1. Create separate API keys for different purposes
2. Use minimum required scopes (principle of least privilege)
3. Rotate keys regularly
4. Store keys securely (environment variables, not in code)
5. Never commit API keys to version control

---

## PostHog API Reference

### Base URLs

- **US Cloud:** `https://us.posthog.com`
- **EU Cloud:** `https://eu.posthog.com`
- **Self-hosted:** `https://your-posthog-instance.com`

### Authentication

All requests require:
```
Authorization: Bearer {your_personal_api_key}
Content-Type: application/json
```

### Rate Limits

- **Analytics endpoints:** 240/minute, 1200/hour
- **Query endpoint:** 2400/hour

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects/{id}/dashboards/` | POST | Create dashboard |
| `/api/projects/{id}/insights/` | POST | Create insight |
| `/api/projects/{id}/dashboards/{id}/` | GET | Get dashboard |
| `/api/projects/{id}/insights/{id}/` | GET | Get insight |

---

## Sample Data & Expected Results

### Conversion Funnel Metrics

Based on typical SaaS marketing metrics:

- **Features → Pricing:** 50-70% progression
- **Pricing → CTA:** 20-40% conversion
- **Overall Conversion:** 15-25% (features to action)

### CTA Performance

Expected click distribution:

- **Hero CTA:** 40-50% of total clicks
- **Navigation CTA:** 25-35% of total clicks
- **Docs CTA:** 15-25% of total clicks

### Pricing Plan Selection

Typical distribution:

- **Starter Plan:** 20-40% of selections
- **Pro Plan:** 60-80% of selections

---

## Next Steps After Creation

### Immediate Actions (Day 1)

1. ✅ Verify dashboard URL is accessible
2. ✅ Confirm all 5 insights are visible
3. ✅ Check that data is populating (may take a few minutes)
4. ✅ Share dashboard URL with team

### Short Term (Week 1)

1. 📐 Customize insight layouts (drag and resize)
2. 🎨 Adjust colors and styling to match brand
3. 📝 Add annotations and descriptions
4. 🔔 Set up alerts for critical metrics
5. 📧 Configure email subscriptions

### Medium Term (Month 1)

1. 📊 Establish baseline metrics
2. 🎯 Set improvement targets
3. 📈 Identify optimization opportunities
4. 🧪 Plan A/B tests based on insights
5. 👥 Train team on dashboard usage

### Long Term (Ongoing)

1. 🔄 Regular review meetings (weekly/monthly)
2. 📊 Add new insights as needs evolve
3. 🚀 Iterate on marketing strategies
4. 📉 Monitor and respond to anomalies
5. 🎓 Share learnings across organization

---

## Key Questions This Dashboard Answers

1. **How effective is our marketing funnel?**
   - Conversion Funnel shows Features → Pricing → CTA flow

2. **Which CTAs drive the most engagement?**
   - CTA Clicks by Location compares all CTA performance

3. **What pricing tier resonates with users?**
   - Pricing Plan Selection shows Starter vs Pro preference

4. **What documentation helps users most?**
   - Docs Section Engagement identifies top sections

5. **Is our traffic growing?**
   - Daily Active Visitors shows 30-day trend

6. **Where do users drop off?**
   - Conversion Funnel reveals friction points

7. **When should we expect peak traffic?**
   - Daily Active Visitors shows weekly patterns

---

## Resources

### PostHog Documentation

- **API Documentation:** https://posthog.com/docs/api
- **Personal API Keys:** https://posthog.com/docs/api/overview#personal-api-keys
- **Dashboard Guide:** https://posthog.com/docs/product-analytics/dashboards
- **Query Types:** https://posthog.com/docs/product-analytics/query-types
- **Funnel Analysis:** https://posthog.com/docs/product-analytics/funnels
- **Trends Analysis:** https://posthog.com/docs/product-analytics/trends

### Community & Support

- **PostHog Questions:** https://posthog.com/questions
- **PostHog Slack:** https://posthog.com/slack
- **GitHub Issues:** https://github.com/PostHog/posthog/issues
- **Status Page:** https://status.posthog.com

### Additional References

- [PostHog Analytics 2026 Review](https://userpilot.com/blog/posthog-analytics/)
- [PostHog MCP Integration](https://mcp.composio.dev/posthog)
- [How to Build Dashboards on PostHog](https://visionlabs.com/academy/posthog/dashboards/)

---

## Technical Details

### Python Script Dependencies

```bash
pip install requests
```

### Bash Script Dependencies

```bash
# Debian/Ubuntu
sudo apt-get install curl jq

# macOS
brew install curl jq
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `POSTHOG_API_KEY` | Yes | - | Personal API key with write scopes |
| `POSTHOG_PROJECT_ID` | Yes | 19618 | Target project ID |
| `POSTHOG_HOST` | No | https://us.posthog.com | PostHog instance URL |

---

## License & Attribution

These scripts and documentation are provided as-is for creating PostHog dashboards. PostHog is a product of PostHog Inc.

- **PostHog:** https://posthog.com
- **PostHog License:** MIT
- **Documentation License:** CC BY 4.0

---

## Changelog

### 2026-02-18 - Initial Release

- ✨ Added Python automation script
- ✨ Added Bash automation script
- 📚 Added comprehensive documentation
- 📊 Added dashboard mockup with sample data
- 🔧 Added API payload reference
- 📝 Added README with quick start guide

---

## FAQ

**Q: Can I use these scripts in CI/CD pipelines?**
A: Yes! Both scripts work well in automated environments. Store API keys securely using CI/CD secret management.

**Q: Can I modify the insights after creation?**
A: Yes! Visit the insight URL and click "Edit" to customize queries, date ranges, and visualizations.

**Q: Can I add more insights to the dashboard later?**
A: Yes! Create new insights and add them to the dashboard via the PostHog UI or API.

**Q: Will this work with self-hosted PostHog?**
A: Yes! Set `POSTHOG_HOST` to your instance URL (e.g., `https://posthog.yourdomain.com`)

**Q: Do I need to install any PostHog SDKs?**
A: No! These scripts only use the PostHog REST API, which doesn't require SDK installation.

**Q: Can I customize the dashboard layout?**
A: Yes! After creation, visit the dashboard and drag/resize insights to your preferred layout.

**Q: What if my events have different names?**
A: Edit the script or API payload JSON to match your event names before running.

**Q: Can I share the dashboard with non-PostHog users?**
A: Yes! Generate a shareable link from the dashboard settings for view-only access.

---

## Contact & Support

For questions about these scripts:
- Review the troubleshooting section above
- Check the comprehensive guide: [POSTHOG_DASHBOARD_GUIDE.md](./POSTHOG_DASHBOARD_GUIDE.md)

For PostHog product questions:
- PostHog Community: https://posthog.com/questions
- PostHog Docs: https://posthog.com/docs

---

**Happy Analyzing!** 📊

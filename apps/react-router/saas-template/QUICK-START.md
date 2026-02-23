# PostHog Dashboard - Quick Start Guide

## TL;DR

Due to API key permission limitations, the dashboard cannot be created automatically. Use one of these methods:

### Method 1: Automated (When You Have API Key)
```bash
export POSTHOG_API_KEY="phx_your_key_with_write_scopes"
python3 create-posthog-dashboard.py
```

### Method 2: Manual UI Setup
Open `POSTHOG-DASHBOARD-SETUP.md` and follow step-by-step instructions.

### Method 3: JSON Import
Copy queries from `posthog-dashboard-setup.json` into PostHog's JSON query editor.

---

## What's Being Created

**Dashboard:** Analytics basics
- User Signup Funnel (4-step conversion)
- Subscription Conversion Rate (checkout start vs complete)
- Subscription Churn (cancellations vs resumptions)
- Daily Active Users (unique logins)
- Contact Sales Submissions (sales pipeline)

---

## Files Created

| File | Purpose |
|------|---------|
| `posthog-dashboard-setup.json` | JSON config for API/import |
| `create-posthog-dashboard.py` | Automation script |
| `POSTHOG-DASHBOARD-SETUP.md` | Detailed setup guide |
| `POSTHOG-SETUP-SUMMARY.md` | Overview & status |
| `POSTHOG-DASHBOARD-VISUAL.md` | Visual reference |
| `QUICK-START.md` | This file |

---

## Events Tracked

```
user_registered → user_signed_up_completed → 
onboarding_user_account_completed → onboarding_organization_created

subscription_checkout_started ↔ checkout_session_completed
subscription_cancelled ↔ subscription_resumed
user_logged_in
contact_sales_submitted
```

---

## Current Limitation

```
✗ API Key Missing Scopes:
  - dashboard:write
  - insight:write
  - query:read
```

**Solution:** Create new Personal API Key in PostHog with these scopes.

---

## Quick Links

- **PostHog Project:** https://us.posthog.com/project/2/
- **Create API Key:** https://us.posthog.com/settings/user-api-keys
- **Dashboards:** https://us.posthog.com/project/2/dashboard
- **SQL Editor:** https://us.posthog.com/project/2/data-management/hogql

---

## Support

Need help? Check:
1. `POSTHOG-SETUP-SUMMARY.md` - Complete overview
2. `POSTHOG-DASHBOARD-SETUP.md` - Detailed instructions
3. PostHog Docs: https://posthog.com/docs

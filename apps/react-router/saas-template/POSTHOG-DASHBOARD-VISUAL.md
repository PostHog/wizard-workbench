# PostHog Dashboard Visual Reference

This document provides a visual representation of what the "Analytics basics" dashboard will look like once created.

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Analytics basics                                                    │
│  Key business metrics for the SaaS app: conversions, churn, and     │
│  user engagement                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  1. User Signup Funnel                                       [Funnel]│
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │  User    │ →  │  Signup  │ →  │ Account  │ →  │   Org    │     │
│  │Registered│    │Completed │    │  Setup   │    │ Created  │     │
│  │   100%   │    │   75%    │    │   60%    │    │   45%    │     │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                      │
│  Conversion window: 7 days | Last 30 days                          │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  2. Subscription Conversion Rate                           [Trend]  │
│                                                                      │
│   ╭╮    ╭─╮           ╭╮                                           │
│   │╰╮  ╭╯ ╰─╮       ╭─╯╰╮     ─── Checkout Started                │
│   │ ╰──╯    ╰─╮   ╭─╯   ╰╮    ··· Checkout Completed              │
│  ╭╯          ╰───╯      ╰╮                                         │
│  ·················································                   │
│                                                                      │
│  Daily | Last 30 days                                              │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  3. Subscription Churn                                     [Trend]  │
│                                                                      │
│   ╭╮                 ╭─╮                                           │
│   │╰╮     ╭─╮      ╭╯ ╰╮       ─── Subscriptions Cancelled        │
│  ╭╯ ╰─────╯ ╰──────╯   ╰─╮     ··· Subscriptions Resumed          │
│  ·························╰─                                        │
│                                                                      │
│  Weekly | Last 90 days                                             │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  4. Daily Active Users (Logins)                            [Trend]  │
│                                                                      │
│      ╭╮    ╭╮    ╭╮    ╭╮    ╭╮                                    │
│     ╭╯╰╮  ╭╯╰╮  ╭╯╰╮  ╭╯╰╮  ╭╯╰╮   ─── Daily Active Users         │
│    ╭╯  ╰──╯  ╰──╯  ╰──╯  ╰──╯  ╰╮                                 │
│   ╭╯                             ╰╮                                │
│                                                                      │
│  Daily | Last 30 days                                              │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  5. Contact Sales Submissions                            [Bar Chart]│
│                                                                      │
│   █          █                  █                                   │
│   █    █     █          █       █          █                        │
│   █    █     █     █    █       █     █    █                        │
│   █    █     █     █    █       █     █    █    █                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
│                                                                      │
│  Daily | Last 90 days                                              │
└────────────────────────────────────────────────────────────────────┘
```

## Insight Details

### 1. User Signup Funnel
**Type:** Conversion Funnel
**Purpose:** Identify where users drop off during signup

**Metrics Shown:**
- Total users entering funnel
- Conversion rate at each step
- Drop-off rate between steps
- Average time between steps
- Overall funnel conversion rate

**Expected Insights:**
- Which onboarding step has highest drop-off
- How long users take to complete signup
- Overall signup completion rate

---

### 2. Subscription Conversion Rate
**Type:** Trend Line Chart
**Purpose:** Track checkout funnel performance

**Metrics Shown:**
- Daily count of checkout initiations (line 1)
- Daily count of checkout completions (line 2)
- Gap between lines shows conversion loss

**Expected Insights:**
- Checkout abandonment trends
- Daily conversion rates
- Impact of changes to checkout flow

---

### 3. Subscription Churn
**Type:** Trend Line Chart
**Purpose:** Monitor subscription health

**Metrics Shown:**
- Weekly cancellations (line 1)
- Weekly resumptions/reactivations (line 2)
- Net churn rate

**Expected Insights:**
- Churn trends over time
- Recovery/win-back effectiveness
- Seasonal churn patterns

---

### 4. Daily Active Users (Logins)
**Type:** Trend Line Chart (Unique Users)
**Purpose:** Track daily engagement

**Metrics Shown:**
- Unique users logging in each day
- 7-day and 30-day moving averages
- Day-of-week patterns

**Expected Insights:**
- User engagement trends
- Weekend vs weekday activity
- Impact of feature launches on engagement

---

### 5. Contact Sales Submissions
**Type:** Bar Chart
**Purpose:** Track enterprise sales pipeline

**Metrics Shown:**
- Daily submission count
- Weekly/monthly totals
- Trends over time

**Expected Insights:**
- Sales inquiry volume
- Marketing campaign effectiveness
- Demand for enterprise features

---

## Dashboard Filters

The dashboard will support these global filters:

- **Date Range:** Adjustable for all insights
- **User Properties:** Filter by user segments
- **Cohorts:** View specific user cohorts
- **Test Mode:** Exclude test accounts

## Refresh Schedule

- Insights auto-refresh every 30 minutes
- Manual refresh available
- Cached results for faster loading

## Expected URLs

Once created, the dashboard will be accessible at:

```
Dashboard:
https://us.posthog.com/project/2/dashboard/{DASHBOARD_ID}

Individual Insights:
https://us.posthog.com/project/2/insights/{INSIGHT_1_SHORT_ID}
https://us.posthog.com/project/2/insights/{INSIGHT_2_SHORT_ID}
https://us.posthog.com/project/2/insights/{INSIGHT_3_SHORT_ID}
https://us.posthog.com/project/2/insights/{INSIGHT_4_SHORT_ID}
https://us.posthog.com/project/2/insights/{INSIGHT_5_SHORT_ID}
```

## Key Performance Indicators (KPIs)

This dashboard tracks these key SaaS metrics:

### Acquisition & Activation
- **Signup Completion Rate:** % of registered users who complete onboarding
- **Time to Value:** Average time from registration to organization creation

### Conversion
- **Checkout Conversion:** % of users who complete checkout after starting
- **Daily Checkout Volume:** Number of checkout attempts per day

### Retention & Churn
- **Net Churn Rate:** Cancellations minus resumptions
- **Churn Trend:** Week-over-week churn change
- **Recovery Rate:** % of cancelled subscriptions that resume

### Engagement
- **DAU (Daily Active Users):** Unique logins per day
- **DAU/MAU Ratio:** Stickiness metric (calculate separately)
- **Login Frequency:** Average logins per user

### Growth
- **Sales Pipeline:** Contact form submissions as leading indicator
- **Team Expansion:** Invitation rate as product-led growth signal

## Best Practices

1. **Review Frequency:**
   - Daily: DAU, Subscription Conversion
   - Weekly: Signup Funnel, Contact Sales
   - Monthly: Subscription Churn trends

2. **Alert Thresholds:**
   - Set alerts for sudden DAU drops (>20%)
   - Monitor checkout conversion drops (>10%)
   - Track churn spikes week-over-week

3. **Iteration:**
   - A/B test signup flow improvements
   - Optimize checkout based on conversion data
   - Improve onboarding based on funnel drop-offs

4. **Sharing:**
   - Pin dashboard for team visibility
   - Share with stakeholders weekly
   - Export reports for board meetings

## Additional Metrics to Consider

Once this dashboard is established, consider adding:

- **Monthly Recurring Revenue (MRR) Trends**
- **Customer Lifetime Value (LTV)**
- **Feature Adoption Rates**
- **Support Ticket Volume**
- **NPS Score Tracking**
- **API Usage Metrics**

---

**Note:** This is a visual reference. Actual PostHog dashboards will display real data with interactive charts, tooltips, and drill-down capabilities.

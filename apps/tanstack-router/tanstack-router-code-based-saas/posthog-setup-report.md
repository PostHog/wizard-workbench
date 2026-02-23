# PostHog Setup Report

## Dashboard

[Analytics basics](https://us.posthog.com/project/2/dashboard/1296055)

## Insights

| Insight | Description | Link |
|---------|-------------|------|
| Sign-ups & Sign-ins (Daily) | Daily trend of new user sign-ups and sign-ins over the last 30 days. | [View](https://us.posthog.com/project/2/insights/eFh5TiwJ) |
| Sign-up to Subscription Conversion Funnel | Conversion funnel from sign-up through checkout initiation to subscription activation. | [View](https://us.posthog.com/project/2/insights/k7GA0RQW) |
| Subscription Cancellations (Weekly) | Weekly count of subscription cancellations — a key churn signal. | [View](https://us.posthog.com/project/2/insights/tGqOWdE7) |
| Account Deletions (Weekly) | Weekly count of account deletions — a hard churn signal to monitor closely. | [View](https://us.posthog.com/project/2/insights/ArSQQBSu) |
| Team Collaboration Activity | Trend of team invitations sent and members removed over the last 30 days — indicates team growth and churn. | [View](https://us.posthog.com/project/2/insights/bg7wPBOc) |

## Instrumented Events

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in to CloudFlow. Captured on login form submit; also calls `posthog.identify(username)` to associate the session with the user. | `src/main.tsx` |
| `user_signed_out` | User signs out of CloudFlow. Captured on sign-out button click; also calls `posthog.reset()` to clear the identified user. | `src/main.tsx` |
| `invoice_created` | User creates a new invoice. Captured on successful form submit in the invoices index view; includes `invoice_id` and `invoice_title` properties. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. Captured on successful patch mutation; includes `invoice_id` and `invoice_title` properties. | `src/main.tsx` |
| `invoice_viewed` | User views a specific invoice detail page — top of the invoice conversion funnel. Captured in a `useEffect` on the invoice route; includes `invoice_id`, `invoice_title`, `invoice_amount`, and `invoice_status`. | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the Account Settings page — key conversion event. Captured on button click; includes `current_plan` and `username` properties. | `src/main.tsx` |
| `team_member_viewed` | User views a team member's profile. Captured in a `useEffect` on the user route; includes `member_id`, `member_name`, `member_email`, and `member_company`. | `src/main.tsx` |
| `team_search_applied` | User filters or searches for team members. Captured on search input change and sort dropdown change; includes `search_query` and `sort_by` properties. | `src/main.tsx` |

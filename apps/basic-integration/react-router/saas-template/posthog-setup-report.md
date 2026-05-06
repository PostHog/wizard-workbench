<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 Framework mode SaaS template. Here's a summary of everything that was set up:

**Client-side:** PostHog JS is initialized in `app/entry.client.tsx` with the `PostHogProvider` wrapping the app. The `__add_tracing_headers` option is enabled so client session and distinct IDs are automatically forwarded to the server on every request.

**Server-side:** A PostHog Node middleware (`app/lib/posthog-middleware.ts`) is registered at the root level. It creates a per-request PostHog Node client, reads the session/distinct ID headers from the client SDK, and uses `withContext()` to automatically correlate server-side events with the correct user session.

**Error tracking:** The root `ErrorBoundary` now calls `posthog.captureException(error)` for all non-404 errors.

**User identification:** Users are identified on the client when they submit the login or registration form (email captured as distinct ID and person property).

**Events instrumented:**

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user submits the login form (email or Google). Includes `method` property. | `app/routes/_user-authentication+/_anonymous-routes+/login.tsx` |
| `user_registered` | Fired when a user submits the registration form (email or Google). Includes `method` property. | `app/routes/_user-authentication+/_anonymous-routes+/register.tsx` |
| `user_onboarding_completed` | Fired server-side when a user completes the user account onboarding step (name + avatar). | `app/features/onboarding/user-account/onboarding-user-account-action.server.ts` |
| `organization_created` | Fired server-side when a user creates a new organization. Includes `organization_id`, `organization_name`, `organization_slug`. | `app/features/organizations/create-organization/create-organization-action.server.ts` |
| `subscription_checkout_started` | Fired when a user clicks to start a subscription checkout. Includes `billing_period` and `lookup_key`. | `app/features/billing/create-subscription-modal-content.tsx` |
| `subscription_checkout_completed` | Fired when the billing success page mounts after a successful Stripe checkout. Includes `organization_slug`. | `app/routes/_authenticated-routes+/organizations_+/$organizationSlug+/settings+/billing_.success.tsx` |
| `subscription_cancelled` | Fired server-side when a user initiates a subscription cancellation. Includes `organization_id`, `organization_slug`, `subscription_id`. | `app/features/billing/billing-action.server.ts` |
| `subscription_resumed` | Fired server-side when a user resumes a paused/cancelling subscription. Includes `organization_id`, `organization_slug`, `subscription_id`. | `app/features/billing/billing-action.server.ts` |
| `member_invited` | Fired server-side when a team member is invited by email. Includes `organization_id`, `organization_slug`, `invited_role`. | `app/features/organizations/settings/team-members/team-members-action.server.tsx` |
| `contact_sales_submitted` | Fired server-side when the contact sales form is submitted successfully. | `app/features/billing/contact-sales/contact-sales-action.server.ts` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Signup → Paid conversion funnel** — Funnel insight with steps: `user_registered` → `subscription_checkout_started` → `subscription_checkout_completed`
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_registered","name":"user_registered","type":"events"},{"id":"subscription_checkout_started","name":"subscription_checkout_started","type":"events"},{"id":"subscription_checkout_completed","name":"subscription_checkout_completed","type":"events"}]})

2. **New signups over time** — Trend of `user_registered` events per day
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_registered","name":"user_registered","type":"events"}]})

3. **Organizations created over time** — Trend of `organization_created` events per day
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"organization_created","name":"organization_created","type":"events"}]})

4. **Subscription churn rate** — Trend of `subscription_cancelled` events over time
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"subscription_cancelled","name":"subscription_cancelled","type":"events"}]})

5. **Team growth (member invitations)** — Trend of `member_invited` events per day
   [Create trend insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"member_invited","name":"member_invited","type":"events"}]})

[Open PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

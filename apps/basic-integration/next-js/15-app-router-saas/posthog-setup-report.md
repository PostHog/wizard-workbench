# PostHog Setup Report

Summary:
- Implemented PostHog client-side initialization at app/instrumentation-client.ts
- Implemented server-side PostHog client at lib/posthog-server.ts
- Added server-side captures for sign in, sign up, and sign out in app/(login)/actions.ts
- Added client-side capture for pricing checkout start in app/(dashboard)/pricing/submit-button.tsx
- Added server-side captures for checkout completed and webhook received in app/api/stripe/checkout/route.ts and app/api/stripe/webhook/route.ts
- Created .posthog-events.json with planned events
- Created PostHog dashboard "Onboarding and Billing - PostHog Setup" with two insights

Events added:

| Event name | Description | File |
|---|---|---|
| user_signed_up | Track when a user successfully signs up | app/(login)/actions.ts |
| user_signed_in | Track when a user successfully signs in | app/(login)/actions.ts |
| user_signed_out | Track when a user signs out | app/(login)/actions.ts |
| checkout_completed | Track successful Stripe checkout completion | app/api/stripe/checkout/route.ts |
| stripe_webhook_received | Track receiving relevant Stripe webhook events | app/api/stripe/webhook/route.ts |
| pricing_checkout_started | Track when user initiates checkout from pricing page | app/(dashboard)/pricing/submit-button.tsx |

Dashboard and insights:
- Dashboard: Onboarding and Billing - PostHog Setup
  - URL: https://us.posthog.com/project/228144/dashboard/1793155
- Insights created:
  - Signups, Logins, Checkout Events: https://us.posthog.com/project/228144/insights/iRh4x2fd
  - Counts by Event Name - Last 30 days: https://us.posthog.com/project/228144/insights/gNxEHnl4

Verify before merging checklist:
- [ ] Confirm environment variables are set in hosting provider (NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, NEXT_PUBLIC_POSTHOG_HOST)
- [ ] Ensure server-side POSTGRES_URL and other DB env vars are set in CI to allow next build
- [ ] Run end-to-end flows: sign-up, sign-in, start pricing checkout, complete checkout webhooks
- [ ] Confirm events appear in PostHog and entities are linked via distinct_id
- [ ] Add source-map upload step to CI if deploying production bundle

Cleanup after merge:
- [ ] Remove .posthog-events.json after events are created in PostHog

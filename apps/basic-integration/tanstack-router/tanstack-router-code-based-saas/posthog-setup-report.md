<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React + TanStack Router (code-based) project. Here is a summary of all changes made:

## Changes made

### `src/main.tsx`
- Imported `PostHogProvider` and `usePostHog` from `@posthog/react`
- Wrapped `RootComponent` with `PostHogProvider` using environment variables for the API key and host, a reverse-proxy `api_host`, and `capture_exceptions: true` for automatic error tracking
- **User sign-in** (`LoginComponent`): calls `posthog.identify(username)` and `posthog.capture('user_signed_in')` on form submit
- **User sign-out** (both `LoginComponent` and `ProfileComponent`): calls `posthog.capture('user_signed_out')` and `posthog.reset()` before logging out
- **Invoice created** (`InvoicesIndexComponent`): captures `invoice_created` with `invoice_id` and `title` on mutation success
- **Invoice create failed** (`InvoicesIndexComponent`): captures `invoice_create_failed` and `posthog.captureException(err)` on mutation error
- **Invoice updated** (`InvoiceComponent`): captures `invoice_updated` with `invoice_id` and `title` on mutation success
- **Invoice update failed** (`InvoiceComponent`): captures `invoice_update_failed` and `posthog.captureException(err)` on mutation error
- **Plan upgrade clicked** (`ProfileComponent`): captures `plan_upgrade_clicked` with `current_plan: 'free'` on button click

### `vite.config.js`
- Added PostHog reverse-proxy rules so analytics events are routed through `/ingest` rather than directly to PostHog servers — improves reliability and ad-blocker bypass
- Routes `/ingest/static/*` and `/ingest/array/*` to `us-assets.i.posthog.com`
- Routes `/ingest/*` to the configured PostHog host

### `.env`
- Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables

### `src/vite-env.d.ts` (new file)
- Added `/// <reference types="vite/client" />` so TypeScript recognises `import.meta.env`

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in via the login form | `src/main.tsx` |
| `user_signed_out` | User signs out from the profile page or login page | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_create_failed` | Invoice creation failed (e.g. title contains 'error') | `src/main.tsx` |
| `invoice_updated` | User successfully updates an existing invoice | `src/main.tsx` |
| `invoice_update_failed` | Invoice update failed (e.g. title contains 'error') | `src/main.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the account page | `src/main.tsx` |

## Next steps

We've designed five insights for an **Analytics basics** dashboard. Create them in PostHog to keep an eye on user behaviour:

1. **Sign-in to invoice funnel** — conversion from sign-in through to invoice creation
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_in","name":"user_signed_in","type":"events"},{"id":"invoice_created","name":"invoice_created","type":"events"}]})

2. **Daily sign-ins trend** — volume of `user_signed_in` events over time
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","name":"user_signed_in","type":"events"}]})

3. **Invoice success vs failure rate** — `invoice_created` compared to `invoice_create_failed`
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"invoice_created","name":"invoice_created","type":"events"},{"id":"invoice_create_failed","name":"invoice_create_failed","type":"events"}]})

4. **Plan upgrade clicks** — `plan_upgrade_clicked` over time (intent signal for paid conversion)
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"plan_upgrade_clicked","name":"plan_upgrade_clicked","type":"events"}]})

5. **User churn signal** — `user_signed_out` events per day
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_out","name":"user_signed_out","type":"events"}]})

[Open PostHog dashboard list →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

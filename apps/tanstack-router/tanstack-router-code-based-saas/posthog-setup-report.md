<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **CloudFlow** React + TanStack Router (code-based routing) application.

## Summary of changes

### `vite.config.js`
- Converted to a function-style config using `loadEnv` so the PostHog host can be loaded from `.env`
- Added a `/ingest` reverse proxy that forwards requests to `VITE_PUBLIC_POSTHOG_HOST`, keeping the PostHog API key off the network and avoiding ad-blocker interference

### `src/main.tsx`
- Added `posthog-js` / `@posthog/react` imports (`PostHogProvider`, `usePostHog`)
- Wrapped `RootComponent` with `PostHogProvider` (initialised with the Vite env vars, exception capture enabled, and the reverse proxy host)
- Added `usePostHog()` and event tracking to four components:
  - **`LoginComponent`** — `posthog.identify()` + `user_signed_in` on form submit; `user_signed_out` + `posthog.reset()` on the "already signed in" sign-out button
  - **`ProfileComponent`** — `plan_upgrade_clicked` on the Upgrade button; `user_signed_out` + `posthog.reset()` on the sign-out button
  - **`InvoicesIndexComponent`** — `invoice_created` (with `invoice_id` and `invoice_title`) in the `useMutation` `onSuccess` callback
  - **`InvoiceComponent`** — `invoice_updated` (with `invoice_id` and `invoice_title`) in the `useMutation` `onSuccess` callback

### `tsconfig.json`
- Added `"types": ["vite/client"]` so `import.meta.env` resolves correctly with TypeScript strict mode

### `.env`
- Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (covered by `.gitignore`)

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form; also calls `posthog.identify()` with the username | `src/main.tsx` |
| `user_signed_out` | User clicks a sign-out button; also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | New invoice successfully created; properties: `invoice_id`, `invoice_title` | `src/main.tsx` |
| `invoice_updated` | Invoice changes saved; properties: `invoice_id`, `invoice_title` | `src/main.tsx` |
| `plan_upgrade_clicked` | User clicks "Upgrade" on the Profile page; property: `current_plan: 'free'` | `src/main.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **PostHog project**: [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)
- 🔐 **User sign-in trend** — Track `user_signed_in` over time: [https://us.posthog.com/project/238460/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","name":"User Signed In","type":"events"}]}](https://us.posthog.com/project/238460/insights/new)
- 📄 **Invoice activity** — Compare `invoice_created` vs `invoice_updated` daily: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)
- 💰 **Upgrade conversion funnel** — `user_signed_in` → `plan_upgrade_clicked`: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)
- 📉 **Churn / sign-out rate** — `user_signed_out` events over time: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)
- 🏠 **Dashboard**: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

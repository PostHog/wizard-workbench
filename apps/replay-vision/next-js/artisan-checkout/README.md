# Artisan Checkout (Next.js 15, app router)

A small ceramics storefront with a real checkout flow, PostHog already integrated.
Test fixture for `wizard replay-vision` - the "already instrumented" arm.

The completion flow is a checkout: `/` → `/cart` → `/checkout` → `/checkout/success`.
PostHog is initialized in `instrumentation-client.ts` with `disable_session_recording: true`
set deliberately.

Expected wizard outcome:

- does **not** install or re-initialize the PostHog SDK (it is already present)
- enables session replay server-side **and** removes the `disable_session_recording: true` override from `instrumentation-client.ts`
- creates a breakage monitor named for this shop (not "Broken experiences"), query scoped to the checkout paths (`/checkout`, `/cart`), watching shop-specific failure modes
- creates a rage-click frustration monitor named for this shop, `$rageclick` gate as the only filter
- creates a summarizer at 10% sampling whose prompt uses shop vocabulary (products, cart, checkout, order)
- report written to `./posthog-replay-vision-report.md`

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

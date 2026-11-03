# Artisan Ceramics (Next.js 15, app router)

A small ceramics storefront with a real checkout flow, PostHog already integrated.
Test fixture for `wizard replay-vision` - the "already instrumented" arm.

The completion flow is a checkout: `/` → `/cart` → `/checkout` → `/checkout/success`,
with a payment-declined error state on the checkout page (card `0000 0000 0000 0000`).
PostHog is initialized in `instrumentation-client.ts` with `disable_session_recording: true`
set deliberately.

Expected wizard outcome, on top of the shared expectations in [`../../README.md`](../../README.md):

- does **not** install or re-initialize the PostHog SDK (it is already present)
- removes the `disable_session_recording: true` override from `instrumentation-client.ts`
- the completion flow it describes is the checkout (`/cart`, `/checkout`, `/checkout/success`), read from the route tree - the directory name no longer contains "checkout", so the paths must come from the code. On the high tier, the problems monitor and the classifier are scoped to those paths
- the report's deploy step names `instrumentation-client.ts` and the env vars it reads
- scanner names and prompts use this shop's identity ("Artisan Ceramics") and vocabulary (products, cart, checkout, order), and the problems prompt can reference the payment-declined path

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

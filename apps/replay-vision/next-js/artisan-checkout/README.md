# Artisan Checkout (Next.js 15, app router)

A small ceramics storefront with a real checkout flow, PostHog already integrated.
Test app for `wizard replay-vision`.

What this app exercises:

- **PostHog is already installed and initialized** (`instrumentation-client.ts`), so the run must skip the install/init tasks and go straight to replay + scanners.
- **`disable_session_recording: true` is set deliberately** in the init options. The enable-replay step has to remove it (or flip it to `false`) - the server-side toggle alone is not enough for this app.
- **The completion flow is a checkout**: `/` → `/cart` → `/checkout` → `/checkout/success`. The Broken experiences scanner's query should scope to these paths.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

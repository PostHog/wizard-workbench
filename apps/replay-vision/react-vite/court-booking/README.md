# Court Booking (Vite + React SPA)

A padel court booking app (client-side routing via react-router-dom) with no analytics at all.
Test fixture for `wizard replay-vision` - the "no PostHog yet" arm.

The completion flow is a booking, not a checkout: `/` → `/book/:courtId` → `/confirmation`.
There is no PostHog dependency, snippet, or init anywhere.

Expected wizard outcome, on top of the shared expectations in [`../../README.md`](../../README.md):

- installs and initializes posthog-js first, with a minimal footprint (no identify, capture, or dashboards)
- scopes the breakage monitor to the booking paths (`/book`, `/confirmation`) - never a guessed `/checkout`
- scanner prompts and names use booking vocabulary (courts, slots, bookings)

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.
